#!/usr/bin/env bash
#
# One-shot setup for npm publishing via an encrypted .env.production.
#
# Prompts for the npm token (never echoed, never passed as an argument, so it
# stays out of `ps` and shell history), encrypts it, registers the decryption
# key as a repository secret, commits the encrypted file, and re-runs the
# release workflow.
#
# Usage:  bash scripts/setup-publishing.sh [tag]
#         tag defaults to the newest v* tag.

set -euo pipefail

REPO="cwcss/crosswind"
ENV_FILE=".env.production"
KEYS_FILE=".env.keys"

cd "$(dirname "$0")/.." || { echo "could not enter repo root" >&2; exit 1; }

command -v gh >/dev/null || { echo "gh CLI is required" >&2; exit 1; }
command -v bunx >/dev/null || { echo "bun is required" >&2; exit 1; }
gh auth status >/dev/null 2>&1 || { echo "run 'gh auth login' first" >&2; exit 1; }

TAG="${1:-$(git tag --list 'v*' --sort=-v:refname | head -1)}"
[[ -n "$TAG" ]] || { echo "no v* tag found" >&2; exit 1; }

echo "Repository : $REPO"
echo "Release tag: $TAG"
echo
echo "Paste the npm token, then press Enter. It will not be displayed."
echo "It needs permission to CREATE packages (Automation, or granular with"
echo "read/write on all packages) — 'ts-css' does not exist on npm yet."
printf 'npm token: '
read -rs NPM_TOKEN_VALUE
echo

[[ -n "$NPM_TOKEN_VALUE" ]] || { echo "no token entered, aborting" >&2; exit 1; }
case "$NPM_TOKEN_VALUE" in
  npm_*) ;;
  *) echo "warning: token does not start with 'npm_' — continuing anyway" >&2 ;;
esac

# Write, encrypt, and immediately drop the plaintext from this shell.
umask 077
printf 'NPM_TOKEN=%s\n' "$NPM_TOKEN_VALUE" > "$ENV_FILE"
unset NPM_TOKEN_VALUE

echo "Encrypting $ENV_FILE ..."
bunx --bun @dotenvx/dotenvx encrypt -f "$ENV_FILE" >/dev/null

# Refuse to continue if the value is still readable — committing that would
# publish the token to a public repo.
if ! grep -q 'NPM_TOKEN=encrypted:' "$ENV_FILE"; then
  rm -f "$ENV_FILE"
  echo "encryption did not produce ciphertext; aborting and removing $ENV_FILE" >&2
  exit 1
fi
[[ -f "$KEYS_FILE" ]] || { echo "$KEYS_FILE was not created" >&2; exit 1; }

PRIVATE_KEY="$(grep '^DOTENV_PRIVATE_KEY_PRODUCTION=' "$KEYS_FILE" | cut -d= -f2- | tr -d '"')"
[[ -n "$PRIVATE_KEY" ]] || { echo "could not read the private key from $KEYS_FILE" >&2; exit 1; }

echo "Registering DOTENV_PRIVATE_KEY_PRODUCTION ..."
printf '%s' "$PRIVATE_KEY" | gh secret set DOTENV_PRIVATE_KEY_PRODUCTION --repo "$REPO"
unset PRIVATE_KEY

# Belt and braces: .gitignore already excludes it, but a committed .env.keys
# would make every encrypted value in the repo readable.
if git check-ignore -q "$KEYS_FILE"; then
  echo "$KEYS_FILE is gitignored (correct)"
else
  echo "$KEYS_FILE is NOT gitignored — aborting before commit" >&2
  exit 1
fi

echo "Committing $ENV_FILE ..."
git add "$ENV_FILE"
git commit -q -m "chore: add encrypted production env for npm publishing"
git push origin main

echo "Re-running the release workflow for $TAG ..."
RUN_QUERY="[.[] | select(.headBranch==\"$TAG\")][0].databaseId"
RUN_ID="$(gh run list --workflow=Releaser --repo "$REPO" --limit 20 --json databaseId,headBranch --jq "$RUN_QUERY")"

if [[ -n "$RUN_ID" && "$RUN_ID" != "null" ]]; then
  gh run rerun "$RUN_ID" --repo "$REPO"
  echo "Watching run $RUN_ID ..."
  if gh run watch "$RUN_ID" --repo "$REPO" --exit-status; then
    echo "Published."
  else
    echo "Release failed — inspect with: gh run view $RUN_ID --log-failed --repo $REPO" >&2
    exit 1
  fi
else
  echo "No Releaser run found for $TAG. Trigger one with:" >&2
  echo "  gh workflow run Releaser --ref $TAG --repo $REPO" >&2
  exit 1
fi

echo
echo "Done. Verify with: curl -s https://registry.npmjs.org/ts-css | head -c 200"
echo "Remember to rotate the token you pasted earlier in chat."
