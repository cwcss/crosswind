# GitHub Actions

This folder contains the following GitHub Actions:

- [CI][CI] - all CI jobs for the project
  - lints the code
  - `typecheck`s the code
  - runs test suite
  - runs on `ubuntu-latest`
- [Release][Release] - automates the release process & changelog generation

## Release credentials

The npm token can come from either of two places, and the release workflow
picks whichever is available.

**Repository secret (simplest).** Set `NPM_TOKEN` and nothing else is needed:

```sh
gh secret set NPM_TOKEN --repo cwcss/crosswind
```

**Encrypted `.env.production` (committed).** `dotenvx` encrypts each value in
place, so the committed file holds ciphertext plus a public key. Set it up
once:

```sh
cp .env.example .env.production      # fill in NPM_TOKEN
bunx @dotenvx/dotenvx encrypt -f .env.production
gh secret set DOTENV_PRIVATE_KEY_PRODUCTION --repo cwcss/crosswind  # from .env.keys
git add .env.production && git commit -m "chore: add encrypted production env"
```

`.env.keys` holds the private keys and is gitignored — committing it would
make every encrypted value in the repo readable.

Note that this does not remove the need for a repository secret; it swaps
`NPM_TOKEN` for `DOTENV_PRIVATE_KEY_PRODUCTION`. What it buys is the values
living in version control, reviewable and diffable, with one key to rotate
instead of one secret per variable. Publishing a package for the first time
also needs a token that can *create* packages — an Automation token, or a
granular one with read/write across all packages.

[CI]: ./workflows/ci.yml
[Release]: ./workflows/release.yml
