# TypeScript Support

Headwind is built with TypeScript and provides full type safety for configuration, APIs, and custom extensions.

## Type-Safe Configuration

Use TypeScript for your configuration file to get autocompletion and type checking:

```typescript
// headwind.config.ts
import type { HeadwindOptions } from 'headwind'

const config = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  output: './dist/headwind.css',
  minify: false,

  theme: {
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
    },
  },

  shortcuts: {
    btn: 'px-4 py-2 rounded font-semibold',
  },
} satisfies HeadwindOptions

export default config
```

## Type Checking

The `satisfies` keyword provides type checking while preserving literal types:

```typescript
import type { HeadwindOptions } from 'headwind'

// ✅ Type-safe with autocompletion
const config = {
  content: ['./src/**/*.tsx'],
  output: './dist/headwind.css',
  minify: true,
} satisfies HeadwindOptions

// ❌ Type error - unknown property
const badConfig = {
  content: ['./src/**/*.tsx'],
  outputPath: './dist/headwind.css', // Error: 'outputPath' does not exist
  // ^^^^^^^^ Property error
} satisfies HeadwindOptions
```

## Available Types

### HeadwindConfig

Main configuration interface:

```typescript
interface HeadwindConfig {
  content: string[]
  output: string
  minify: boolean
  watch: boolean
  verbose?: boolean
  theme: Theme
  shortcuts: Record<string, string | string[]>
  rules: CustomRule[]
  variants: VariantConfig
  safelist: string[]
  blocklist: string[]
  preflights: Preflight[]
  presets: Preset[]
  compileClass?: CompileClassConfig
}
```

### Theme

Theme customization types:

```typescript
interface Theme {
  colors: Record<string, string | Record<string, string>>
  spacing: Record<string, string>
  fontSize: Record<string, [string, { lineHeight: string }]>
  fontFamily: Record<string, string[]>
  screens: Record<string, string>
  borderRadius: Record<string, string>
  boxShadow: Record<string, string>
}
```

### CompileClassConfig

Compile class configuration:

```typescript
interface CompileClassConfig {
  enabled?: boolean
  trigger?: string
  classPrefix?: string
  layer?: string
}
```

### CustomRule

Custom rule type:

```typescript
type CustomRule = [
  RegExp,
  (match: RegExpMatchArray) => Record<string, string> | undefined
]
```

## Autocompletion

Get IntelliSense and autocompletion in your IDE:

### VSCode

1. Install the TypeScript extension (comes pre-installed)
2. Create `headwind.config.ts` with the type import:

```typescript
import type { HeadwindOptions } from 'headwind'

const config = {
  // Press Ctrl+Space here for autocompletion
  theme: {
    // Autocomplete shows all theme options
  },
} satisfies HeadwindOptions
```

### Theme Autocompletion

```typescript
const config = {
  theme: {
    // Autocomplete shows: colors, spacing, fontSize, etc.
    colors: {
      // Type 'primary' and get suggestions
    },
    fontSize: {
      // See all font size options
    },
  },
} satisfies HeadwindOptions
```

### Shortcuts Autocompletion

```typescript
const config = {
  shortcuts: {
    // Autocomplete for shortcut names
    'btn': 'px-4 py-2 rounded',
    'btn-primary': 'btn bg-blue-500', // Autocomplete shows existing shortcuts
  },
} satisfies HeadwindOptions
```

## Type Inference

TypeScript infers types from your configuration:

```typescript
const config = {
  theme: {
    colors: {
      primary: '#3b82f6',
      brand: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        500: '#0ea5e9',
      },
    },
  },
} satisfies HeadwindOptions

// TypeScript knows:
// config.theme.colors.primary is string
// config.theme.colors.brand is Record<string, string>
```

## Programmatic API Types

### Build Function

```typescript
import type { BuildResult, HeadwindConfig } from 'headwind'
import { build } from 'headwind'

const result: BuildResult = await build({
  content: ['./src/**/*.tsx'],
  output: './dist/headwind.css',
} as HeadwindConfig)

// result.css: string
// result.classes: Set<string>
// result.duration: number
// result.compiledClasses?: Map<string, { className: string; utilities: string[] }>
// result.transformedFiles?: Map<string, string>
```

### BuildResult Type

```typescript
interface BuildResult {
  css: string
  classes: Set<string>
  duration: number
  compiledClasses?: Map<string, { className: string, utilities: string[] }>
  transformedFiles?: Map<string, string>
}
```

### Using with async/await

```typescript
import { build, buildAndWrite } from 'headwind'

async function buildStyles() {
  // With build
  const result = await build({
    content: ['./src/**/*.tsx'],
    output: './dist/headwind.css',
    minify: true,
  })

  console.log(`Generated ${result.classes.size} classes`)

  // With buildAndWrite
  await buildAndWrite({
    content: ['./src/**/*.tsx'],
    output: './dist/headwind.css',
    minify: true,
  })
}
```

## Custom Rules with Types

Define type-safe custom rules:

```typescript
import type { CustomRule, HeadwindConfig } from 'headwind'

const customRules: CustomRule[] = [
  // Pattern and handler with types
  [
    /^custom-(\w+)$/,
    (match: RegExpMatchArray): Record<string, string> | undefined => {
      const value = match[1]
      return {
        'custom-property': value,
      }
    },
  ],
]

const config = {
  rules: customRules,
} satisfies HeadwindOptions
```

## Preset Types

Create type-safe presets:

```typescript
import type { Preset, Theme } from 'headwind'

const myPreset: Preset = {
  name: 'my-design-system',

  theme: {
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
    },
    spacing: {
      sm: '0.5rem',
      md: '1rem',
      lg: '2rem',
    },
  },

  shortcuts: {
    btn: 'px-4 py-2 rounded font-semibold',
  },

  rules: [
    [/^custom-/, () => ({ color: 'red' })],
  ],
}

// Use in config
const config = {
  presets: [myPreset],
}
```

## Extending Types

### Custom Theme Values

Extend the theme with custom properties:

```typescript
import type { HeadwindOptions, Theme } from 'headwind'

interface CustomTheme extends Theme {
  customSpacing: Record<string, string>
  customColors: Record<string, string>
}

const config = {
  theme: {
    customSpacing: {
      'xs': '0.25rem',
      '2xs': '0.125rem',
    },
    customColors: {
      brand: '#ff6b6b',
    },
  } as CustomTheme,
} satisfies HeadwindOptions
```

### Custom Config

Create a custom config interface:

```typescript
import type { HeadwindOptions } from 'headwind'

interface MyConfig extends Partial<HeadwindConfig> {
  // Add custom properties
  customOption?: boolean
  metadata?: {
    version: string
    author: string
  }
}

const config: MyConfig = {
  content: ['./src/**/*.tsx'],
  output: './dist/headwind.css',

  customOption: true,
  metadata: {
    version: '1.0.0',
    author: 'Your Name',
  },
}
```

## Type Guards

Use type guards for runtime type checking:

```typescript
import type { HeadwindOptions } from 'headwind'

function isValidConfig(config: unknown): config is HeadwindConfig {
  return (
    typeof config === 'object'
    && config !== null
    && 'content' in config
    && 'output' in config
    && Array.isArray((config as HeadwindConfig).content)
  )
}

// Usage
const config: unknown = loadConfigFromSomewhere()

if (isValidConfig(config)) {
  // TypeScript knows config is HeadwindConfig
  console.log(config.content)
}
```

## Generics

Use generics for flexible, type-safe functions:

```typescript
import type { HeadwindOptions } from 'headwind'

function createConfig<T extends Partial<HeadwindConfig>>(config: T): T {
  return {
    ...config,
    // Add defaults while preserving original types
  }
}

const config = createConfig({
  content: ['./src/**/*.tsx'],
  theme: {
    colors: {
      primary: '#3b82f6',
    },
  },
})

// TypeScript infers the exact type
```

## Module Augmentation

Extend Headwind types globally:

```typescript
// Now use in config
import type { HeadwindOptions } from 'headwind'

// types/headwind.d.ts
import 'headwind'

declare module 'headwind' {
  interface HeadwindConfig {
    // Add your custom properties
    customFeature?: {
      enabled: boolean
      options: Record<string, any>
    }
  }

  interface Theme {
    // Extend theme
    customScale?: Record<string, string>
  }
}

const config = {
  customFeature: {
    enabled: true,
    options: {},
  },
  theme: {
    customScale: {
      xs: '0.5rem',
    },
  },
} satisfies HeadwindOptions
```

## Integration with Build Tools

### Vite

```typescript
import type { HeadwindOptions } from 'headwind'
import { build } from 'headwind'
// vite.config.ts
import { defineConfig } from 'vite'

const headwindConfig: HeadwindConfig = {
  content: ['./src/**/*.tsx'],
  output: './dist/headwind.css',
  minify: true,
}

export default defineConfig({
  plugins: [
    {
      name: 'headwind',
      async buildStart() {
        await build(headwindConfig)
      },
    },
  ],
})
```

### Next.js

```typescript
import type { HeadwindOptions } from 'headwind'
// next.config.ts
import type { NextConfig } from 'next'
import { buildAndWrite } from 'headwind'

const headwindConfig: HeadwindConfig = {
  content: ['./src/**/*.tsx', './app/**/*.tsx'],
  output: './public/headwind.css',
  minify: process.env.NODE_ENV === 'production',
}

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      buildAndWrite(headwindConfig)
    }
    return config
  },
}

export default nextConfig
```

## Type Utilities

Headwind provides useful type utilities:

```typescript
import type {
  CustomRule,
  HeadwindConfig,
  ParsedClass,
  Preset,
  Theme,
} from 'headwind'

// Extract specific types
type ConfigColors = Theme['colors']
type ConfigSpacing = Theme['spacing']

// Use utility types
type RequiredConfig = Required<HeadwindConfig>
type PartialTheme = Partial<Theme>
```

## Best Practices

### 1. Always Use Type Imports

```typescript
// ✅ Type-only import
import type { HeadwindOptions } from 'headwind'

// ❌ Value import (unnecessary)
import { HeadwindConfig } from 'headwind'
```

### 2. Use `satisfies` for Validation

```typescript
// ✅ Validates types while preserving literals
const config = {
  content: ['./src/**/*.tsx'],
} satisfies HeadwindOptions

// ❌ Loses literal types
const config: Partial<HeadwindConfig> = {
  content: ['./src/**/*.tsx'],
}
```

### 3. Separate Type Definitions

```typescript
// types/headwind.ts
import type { HeadwindOptions, Preset } from 'headwind'

// headwind.config.ts
import type { MyConfig } from './types/headwind'

export interface MyCustomPreset extends Preset {
  customOption: boolean
}

export interface MyConfig extends Partial<HeadwindConfig> {
  presets: MyCustomPreset[]
}

const config: MyConfig = {
  // ...
}
```

### 4. Document Custom Types

```typescript
/**
 * Custom theme with extended color palette
 */
interface CustomTheme extends Theme {
  /**
   * Brand colors for the application
   */
  brandColors: {
    primary: string
    secondary: string
    accent: string
  }
}
```

## Troubleshooting

### Type Errors

**Problem:** TypeScript errors in config

```typescript
// Error: Type 'string' is not assignable to type 'string[]'
const config = {
  content: './src/**/*.tsx', // Should be array
} satisfies HeadwindOptions
```

**Solution:**

```typescript
const config = {
  content: ['./src/**/*.tsx'], // Correct: array
} satisfies HeadwindOptions
```

### Missing Types

**Problem:** Cannot find type definitions

**Solution:**

```bash
# Ensure TypeScript is installed
bun add --dev typescript

# Ensure types are imported
import type { HeadwindOptions } from 'headwind'
```

### Autocomplete Not Working

**Problem:** No autocompletion in IDE

**Solutions:**

1. Restart TypeScript server
2. Check tsconfig.json includes the config file
3. Ensure proper imports:

   ```typescript
   import type { HeadwindOptions } from 'headwind'
   ```

## Related

- [Configuration](../config.md) - Full configuration guide
- [Custom Rules](../advanced/custom-rules.md) - Creating custom utilities
- [Presets](../advanced/presets.md) - Reusable configurations
- [API Reference](../api-reference.md) - Programmatic API
