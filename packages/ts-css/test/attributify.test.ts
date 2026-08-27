import { describe, expect, it } from 'bun:test'
import { extractAttributifyClasses, extractClasses } from '../src/parser'

describe('Attributify Mode', () => {
  describe('extractAttributifyClasses', () => {
    describe('with cw- prefix (default)', () => {
      it('should extract prefixed boolean utility attributes', () => {
        const html = '<div cw-flex cw-items-center></div>'
        const result = extractAttributifyClasses(html, { enabled: true })
        expect(result.has('flex')).toBe(true)
        expect(result.has('items-center')).toBe(true)
      })

      it('should extract prefixed value attributes', () => {
        const html = '<div cw-bg="blue-500" cw-text="white"></div>'
        const result = extractAttributifyClasses(html, { enabled: true })
        expect(result.has('bg-blue-500')).toBe(true)
        expect(result.has('text-white')).toBe(true)
      })

      it('should extract multiple prefixed attributes', () => {
        const html = '<div cw-flex cw-grid cw-block></div>'
        const result = extractAttributifyClasses(html, { enabled: true })
        expect(result.has('flex')).toBe(true)
        expect(result.has('grid')).toBe(true)
        expect(result.has('block')).toBe(true)
      })

      it('should extract prefixed padding and margin attributes', () => {
        const html = '<div cw-p="4" cw-m="2" cw-px="8" cw-py="4"></div>'
        const result = extractAttributifyClasses(html, { enabled: true })
        expect(result.has('p-4')).toBe(true)
        expect(result.has('m-2')).toBe(true)
        expect(result.has('px-8')).toBe(true)
        expect(result.has('py-4')).toBe(true)
      })

      it('should extract prefixed width and height attributes', () => {
        const html = '<div cw-w="full" cw-h="screen"></div>'
        const result = extractAttributifyClasses(html, { enabled: true })
        expect(result.has('w-full')).toBe(true)
        expect(result.has('h-screen')).toBe(true)
      })

      it('should extract multiple values from single attribute', () => {
        const html = '<div cw-p="4 8"></div>'
        const result = extractAttributifyClasses(html, { enabled: true })
        expect(result.has('p-4')).toBe(true)
        expect(result.has('p-8')).toBe(true)
      })

      it('should not extract non-prefixed attributes', () => {
        const html = '<div flex bg="blue-500"></div>'
        const result = extractAttributifyClasses(html, { enabled: true })
        expect(result.has('flex')).toBe(false)
        expect(result.has('bg-blue-500')).toBe(false)
      })
    })

    describe('with custom prefix', () => {
      it('should extract custom prefixed boolean attributes', () => {
        const html = '<div x-flex x-items-center></div>'
        const result = extractAttributifyClasses(html, { enabled: true, prefix: 'x-' })
        expect(result.has('flex')).toBe(true)
        expect(result.has('items-center')).toBe(true)
      })

      it('should extract custom prefixed value attributes', () => {
        const html = '<div x-bg="blue-500" x-text="white"></div>'
        const result = extractAttributifyClasses(html, { enabled: true, prefix: 'x-' })
        expect(result.has('bg-blue-500')).toBe(true)
        expect(result.has('text-white')).toBe(true)
      })

      it('should not extract wrong prefix', () => {
        const html = '<div cw-flex y-bg="blue-500"></div>'
        const result = extractAttributifyClasses(html, { enabled: true, prefix: 'x-' })
        expect(result.has('flex')).toBe(false)
        expect(result.has('bg-blue-500')).toBe(false)
      })
    })

    describe('with empty prefix', () => {
      it('should extract boolean utility attributes without prefix', () => {
        const html = '<div flex items-center></div>'
        const result = extractAttributifyClasses(html, { enabled: true, prefix: '' })
        expect(result.has('flex')).toBe(true)
        expect(result.has('items-center')).toBe(true)
      })

      it('should extract value attributes without prefix', () => {
        const html = '<div bg="blue-500" text="white"></div>'
        const result = extractAttributifyClasses(html, { enabled: true, prefix: '' })
        expect(result.has('bg-blue-500')).toBe(true)
        expect(result.has('text-white')).toBe(true)
      })

      it('should still ignore standard HTML attributes', () => {
        const html = '<div class="flex" id="main" style="color: red" name="test"></div>'
        const result = extractAttributifyClasses(html, { enabled: true, prefix: '' })
        expect(result.has('class-flex')).toBe(false)
        expect(result.has('id-main')).toBe(false)
        expect(result.has('style-color')).toBe(false)
        expect(result.has('name-test')).toBe(false)
      })
    })

    describe('disabled mode', () => {
      it('should not extract when disabled', () => {
        const html = '<div cw-flex cw-items-center></div>'
        const result = extractAttributifyClasses(html, { enabled: false })
        expect(result.size).toBe(0)
      })

      it('should not extract with undefined config', () => {
        const html = '<div cw-flex cw-items-center></div>'
        const result = extractAttributifyClasses(html, undefined)
        expect(result.size).toBe(0)
      })
    })

    describe('ignore attributes', () => {
      it('should ignore data-* attributes', () => {
        const html = '<div data-test="value" data-id="123"></div>'
        const result = extractAttributifyClasses(html, { enabled: true, prefix: '' })
        expect(result.size).toBe(0)
      })

      it('should ignore aria-* attributes', () => {
        const html = '<div aria-label="label" aria-hidden="true"></div>'
        const result = extractAttributifyClasses(html, { enabled: true, prefix: '' })
        expect(result.size).toBe(0)
      })

      it('should ignore event handlers', () => {
        const html = '<div onclick="handler()" onmouseover="hover()"></div>'
        const result = extractAttributifyClasses(html, { enabled: true, prefix: '' })
        expect(result.size).toBe(0)
      })

      it('should ignore standard HTML attributes', () => {
        const html = '<div id="main" class="container" style="color:red" name="form"></div>'
        const result = extractAttributifyClasses(html, { enabled: true, prefix: '' })
        expect(result.size).toBe(0)
      })

      it('should ignore href, src, alt, title', () => {
        const html = '<a href="/about" title="About"><img src="image.jpg" alt="Image"></a>'
        const result = extractAttributifyClasses(html, { enabled: true, prefix: '' })
        expect(result.size).toBe(0)
      })

      it('should ignore form-related attributes', () => {
        const html = '<input type="text" value="hello" placeholder="Enter" required disabled>'
        const result = extractAttributifyClasses(html, { enabled: true, prefix: '' })
        expect(result.size).toBe(0)
      })

      it('should use custom ignore list', () => {
        const html = '<div custom="value" cw-flex></div>'
        const result = extractAttributifyClasses(html, {
          enabled: true,
          ignoreAttributes: ['custom'],
        })
        expect(result.has('custom-value')).toBe(false)
        expect(result.has('flex')).toBe(true)
      })
    })

    describe('complex scenarios', () => {
      it('should extract from multiple elements', () => {
        const html = `
          <div cw-flex cw-p="4">
            <span cw-text="white" cw-font="bold"></span>
            <p cw-bg="gray-100"></p>
          </div>
        `
        const result = extractAttributifyClasses(html, { enabled: true })
        expect(result.has('flex')).toBe(true)
        expect(result.has('p-4')).toBe(true)
        expect(result.has('text-white')).toBe(true)
        expect(result.has('font-bold')).toBe(true)
        expect(result.has('bg-gray-100')).toBe(true)
      })

      it('should handle self-closing tags', () => {
        const html = '<input cw-w="full" cw-p="2" />'
        const result = extractAttributifyClasses(html, { enabled: true })
        expect(result.has('w-full')).toBe(true)
        expect(result.has('p-2')).toBe(true)
      })

      it('should handle mixed prefixed and standard attributes', () => {
        const html = '<div class="container" id="main" cw-flex cw-bg="blue-500"></div>'
        const result = extractAttributifyClasses(html, { enabled: true })
        expect(result.has('flex')).toBe(true)
        expect(result.has('bg-blue-500')).toBe(true)
        expect(result.has('class-container')).toBe(false)
        expect(result.has('id-main')).toBe(false)
      })

      it('should handle compound utility names', () => {
        const html = '<div cw-justify-center cw-items-start cw-gap="4"></div>'
        const result = extractAttributifyClasses(html, { enabled: true })
        expect(result.has('justify-center')).toBe(true)
        expect(result.has('items-start')).toBe(true)
        expect(result.has('gap-4')).toBe(true)
      })

      it('should handle color values', () => {
        const html = '<div cw-bg="blue-500" cw-text="gray-700" cw-border="red-300"></div>'
        const result = extractAttributifyClasses(html, { enabled: true })
        expect(result.has('bg-blue-500')).toBe(true)
        expect(result.has('text-gray-700')).toBe(true)
        expect(result.has('border-red-300')).toBe(true)
      })

      it('should handle spacing values', () => {
        const html = '<div cw-m="4" cw-p="8" cw-gap="2"></div>'
        const result = extractAttributifyClasses(html, { enabled: true })
        expect(result.has('m-4')).toBe(true)
        expect(result.has('p-8')).toBe(true)
        expect(result.has('gap-2')).toBe(true)
      })
    })

    describe('edge cases', () => {
      it('should handle empty attribute values', () => {
        const html = '<div cw-flex="" cw-grid=""></div>'
        const result = extractAttributifyClasses(html, { enabled: true })
        // Empty values should not create invalid classes
        expect(result.has('flex-')).toBe(false)
      })

      it('should handle attributes with special characters in values', () => {
        const html = '<div cw-w="1/2" cw-h="3/4"></div>'
        const result = extractAttributifyClasses(html, { enabled: true })
        expect(result.has('w-1/2')).toBe(true)
        expect(result.has('h-3/4')).toBe(true)
      })

      it('should handle single quotes', () => {
        const html = `<div cw-bg='blue-500' cw-text='white'></div>`
        const result = extractAttributifyClasses(html, { enabled: true })
        expect(result.has('bg-blue-500')).toBe(true)
        expect(result.has('text-white')).toBe(true)
      })

      it('should handle newlines in HTML', () => {
        const html = `<div
          cw-flex
          cw-items-center
          cw-bg="blue-500"
        ></div>`
        const result = extractAttributifyClasses(html, { enabled: true })
        expect(result.has('flex')).toBe(true)
        expect(result.has('items-center')).toBe(true)
        expect(result.has('bg-blue-500')).toBe(true)
      })

      it('should handle tabs in HTML', () => {
        const html = '<div\tcw-flex\tcw-items-center\tcw-bg="blue-500"></div>'
        const result = extractAttributifyClasses(html, { enabled: true })
        expect(result.has('flex')).toBe(true)
        expect(result.has('items-center')).toBe(true)
        expect(result.has('bg-blue-500')).toBe(true)
      })
    })
  })

  describe('extractClasses with attributify', () => {
    it('should extract both class and attributify utilities', () => {
      const html = '<div class="flex p-4" cw-bg="blue-500" cw-items-center></div>'
      const result = extractClasses(html, {
        attributify: { enabled: true },
      })
      // From class attribute
      expect(result.has('flex')).toBe(true)
      expect(result.has('p-4')).toBe(true)
      // From attributify
      expect(result.has('bg-blue-500')).toBe(true)
      expect(result.has('items-center')).toBe(true)
    })

    it('should work with complex HTML', () => {
      const html = `
        <div class="container mx-auto" cw-p="4" cw-bg="gray-100">
          <header cw-flex cw-items-center cw-justify-between cw-p="2">
            <h1 class="text-2xl font-bold">Title</h1>
            <nav cw-flex cw-gap="4">
              <a href="/" cw-text="blue-500">Home</a>
              <a href="/about" cw-text="gray-700">About</a>
            </nav>
          </header>
        </div>
      `
      const result = extractClasses(html, {
        attributify: { enabled: true },
      })

      // Class attributes
      expect(result.has('container')).toBe(true)
      expect(result.has('mx-auto')).toBe(true)
      expect(result.has('text-2xl')).toBe(true)
      expect(result.has('font-bold')).toBe(true)

      // Attributify
      expect(result.has('p-4')).toBe(true)
      expect(result.has('p-2')).toBe(true)
      expect(result.has('bg-gray-100')).toBe(true)
      expect(result.has('flex')).toBe(true)
      expect(result.has('items-center')).toBe(true)
      expect(result.has('justify-between')).toBe(true)
      expect(result.has('gap-4')).toBe(true)
      expect(result.has('text-blue-500')).toBe(true)
      expect(result.has('text-gray-700')).toBe(true)
    })

    it('should not extract attributify when disabled', () => {
      const html = '<div cw-flex cw-bg="blue-500"></div>'
      const result = extractClasses(html)
      expect(result.has('flex')).toBe(false)
      expect(result.has('bg-blue-500')).toBe(false)
    })

    it('should work with custom prefix', () => {
      const html = '<div class="container" x-flex x-bg="blue-500"></div>'
      const result = extractClasses(html, {
        attributify: { enabled: true, prefix: 'x-' },
      })
      expect(result.has('container')).toBe(true)
      expect(result.has('flex')).toBe(true)
      expect(result.has('bg-blue-500')).toBe(true)
    })

    it('should work in JSX/TSX files', () => {
      const jsx = '<Button className="btn" cw-px="4" cw-py="2" cw-bg="blue-500" />'
      const result = extractClasses(jsx, {
        attributify: { enabled: true },
      })
      expect(result.has('btn')).toBe(true)
      expect(result.has('px-4')).toBe(true)
      expect(result.has('py-2')).toBe(true)
      expect(result.has('bg-blue-500')).toBe(true)
    })

    it('should work with template literals', () => {
      const jsx = '<div className={`container ${active && "active"}`} cw-flex cw-p="4"></div>'
      const result = extractClasses(jsx, {
        attributify: { enabled: true },
      })
      expect(result.has('container')).toBe(true)
      expect(result.has('flex')).toBe(true)
      expect(result.has('p-4')).toBe(true)
    })
  })

  describe('attributify + bracket syntax combined', () => {
    it('should support both features together', () => {
      const html = `
        <div class="flex[col jc-center] bg:black" cw-p="4" cw-items-center>
          <span class="text[white 2rem]">Content</span>
        </div>
      `
      const result = extractClasses(html, {
        attributify: { enabled: true },
        bracketSyntax: { enabled: true, colonSyntax: true },
      })

      // Bracket syntax expansions
      expect(result.has('flex-col')).toBe(true)
      expect(result.has('justify-center')).toBe(true)
      expect(result.has('bg-black')).toBe(true)
      expect(result.has('text-white')).toBe(true)
      expect(result.has('text-[2rem]')).toBe(true)

      // Attributify
      expect(result.has('p-4')).toBe(true)
      expect(result.has('items-center')).toBe(true)
    })

    it('should handle complex combined usage', () => {
      const html = `
        <main class="reset:meyer">
          <div class="flex[col jc-center ai-center]" cw-bg="slate-900" cw-w="full" cw-h="screen">
            <h1 class="text[4rem 700]" cw-text="white">Hello Crosswind!</h1>
            <p class="text[lg]" cw-text="gray-400" cw-mt="4">Welcome to the future of CSS</p>
          </div>
        </main>
      `
      const result = extractClasses(html, {
        attributify: { enabled: true },
        bracketSyntax: { enabled: true, colonSyntax: true },
      })

      // From bracket syntax
      expect(result.has('reset-meyer')).toBe(true)
      expect(result.has('flex-col')).toBe(true)
      expect(result.has('justify-center')).toBe(true)
      expect(result.has('items-center')).toBe(true)
      expect(result.has('text-[4rem]')).toBe(true)
      expect(result.has('font-bold')).toBe(true)
      expect(result.has('text-lg')).toBe(true)

      // From attributify
      expect(result.has('bg-slate-900')).toBe(true)
      expect(result.has('w-full')).toBe(true)
      expect(result.has('h-screen')).toBe(true)
      expect(result.has('text-white')).toBe(true)
      expect(result.has('text-gray-400')).toBe(true)
      expect(result.has('mt-4')).toBe(true)
    })
  })

  describe('state variants in attributify', () => {
    it('should extract hover:bg attribute', () => {
      const html = '<div cw-hover:bg="blue-600"></div>'
      const result = extractAttributifyClasses(html, { enabled: true })
      expect(result.has('hover:bg-blue-600')).toBe(true)
    })

    it('should extract dark:text attribute', () => {
      const html = '<div cw-dark:text="white"></div>'
      const result = extractAttributifyClasses(html, { enabled: true })
      expect(result.has('dark:text-white')).toBe(true)
    })

    it('should extract focus:ring attribute', () => {
      const html = '<div cw-focus:ring="2"></div>'
      const result = extractAttributifyClasses(html, { enabled: true })
      expect(result.has('focus:ring-2')).toBe(true)
    })

    it('should extract sm:flex attribute', () => {
      const html = '<div cw-sm:flex></div>'
      const result = extractAttributifyClasses(html, { enabled: true })
      expect(result.has('sm:flex')).toBe(true)
    })

    it('should extract md:grid attribute', () => {
      const html = '<div cw-md:grid></div>'
      const result = extractAttributifyClasses(html, { enabled: true })
      expect(result.has('md:grid')).toBe(true)
    })

    it('should extract dark:hover:bg attribute (multiple variants)', () => {
      const html = '<div cw-dark:hover:bg="gray-800"></div>'
      const result = extractAttributifyClasses(html, { enabled: true })
      expect(result.has('dark:hover:bg-gray-800')).toBe(true)
    })

    it('should extract focus-visible:outline attribute', () => {
      const html = '<div cw-focus-visible:outline="none"></div>'
      const result = extractAttributifyClasses(html, { enabled: true })
      expect(result.has('focus-visible:outline-none')).toBe(true)
    })

    it('should extract active:scale attribute', () => {
      const html = '<div cw-active:scale="95"></div>'
      const result = extractAttributifyClasses(html, { enabled: true })
      expect(result.has('active:scale-95')).toBe(true)
    })

    it('should extract disabled:opacity attribute', () => {
      const html = '<div cw-disabled:opacity="50"></div>'
      const result = extractAttributifyClasses(html, { enabled: true })
      expect(result.has('disabled:opacity-50')).toBe(true)
    })

    it('should extract group-hover:text attribute', () => {
      const html = '<div cw-group-hover:text="blue-500"></div>'
      const result = extractAttributifyClasses(html, { enabled: true })
      expect(result.has('group-hover:text-blue-500')).toBe(true)
    })

    it('should extract multiple variant attributes from same element', () => {
      const html = '<div cw-bg="gray-100" cw-hover:bg="gray-200" cw-dark:bg="gray-800" cw-dark:hover:bg="gray-700"></div>'
      const result = extractAttributifyClasses(html, { enabled: true })
      expect(result.has('bg-gray-100')).toBe(true)
      expect(result.has('hover:bg-gray-200')).toBe(true)
      expect(result.has('dark:bg-gray-800')).toBe(true)
      expect(result.has('dark:hover:bg-gray-700')).toBe(true)
    })

    it('should extract boolean variant attributes', () => {
      const html = '<div cw-hover:underline cw-focus:outline-none></div>'
      const result = extractAttributifyClasses(html, { enabled: true })
      expect(result.has('hover:underline')).toBe(true)
      expect(result.has('focus:outline-none')).toBe(true)
    })

    it('should work with extractClasses', () => {
      const html = '<div class="p-4" cw-hover:bg="blue-500" cw-dark:text="white"></div>'
      const result = extractClasses(html, {
        attributify: { enabled: true },
      })
      expect(result.has('p-4')).toBe(true)
      expect(result.has('hover:bg-blue-500')).toBe(true)
      expect(result.has('dark:text-white')).toBe(true)
    })

    it('should work with custom prefix and variants', () => {
      const html = '<div x-hover:bg="red-500" x-sm:flex></div>'
      const result = extractAttributifyClasses(html, { enabled: true, prefix: 'x-' })
      expect(result.has('hover:bg-red-500')).toBe(true)
      expect(result.has('sm:flex')).toBe(true)
    })
  })

  describe('comprehensive real-world examples', () => {
    it('should handle a button component', () => {
      const html = `
        <button
          class="flex items-center"
          cw-px="4"
          cw-py="2"
          cw-bg="blue-500"
          cw-hover:bg="blue-600"
          cw-active:bg="blue-700"
          cw-text="white"
          cw-rounded="lg"
          cw-font="semibold"
          cw-transition="colors"
          cw-duration="150"
          cw-focus:ring="2"
          cw-focus:ring-offset="2"
          cw-disabled:opacity="50"
          cw-disabled:cursor="not-allowed"
        >
          Click me
        </button>
      `
      const result = extractClasses(html, {
        attributify: { enabled: true },
      })

      expect(result.has('flex')).toBe(true)
      expect(result.has('items-center')).toBe(true)
      expect(result.has('px-4')).toBe(true)
      expect(result.has('py-2')).toBe(true)
      expect(result.has('bg-blue-500')).toBe(true)
      expect(result.has('hover:bg-blue-600')).toBe(true)
      expect(result.has('active:bg-blue-700')).toBe(true)
      expect(result.has('text-white')).toBe(true)
      expect(result.has('rounded-lg')).toBe(true)
      expect(result.has('font-semibold')).toBe(true)
      expect(result.has('transition-colors')).toBe(true)
      expect(result.has('duration-150')).toBe(true)
      expect(result.has('focus:ring-2')).toBe(true)
      expect(result.has('focus:ring-offset-2')).toBe(true)
      expect(result.has('disabled:opacity-50')).toBe(true)
      expect(result.has('disabled:cursor-not-allowed')).toBe(true)
    })

    it('should handle a dark mode card component', () => {
      const html = `
        <div
          cw-bg="white"
          cw-dark:bg="gray-800"
          cw-p="6"
          cw-rounded="xl"
          cw-shadow="lg"
          cw-dark:shadow="none"
          cw-border="gray-200"
          cw-dark:border="gray-700"
        >
          <h2 cw-text="gray-900" cw-dark:text="white" cw-font="bold" cw-text="xl">Card Title</h2>
          <p cw-text="gray-600" cw-dark:text="gray-300" cw-mt="2">Card content goes here.</p>
        </div>
      `
      const result = extractClasses(html, {
        attributify: { enabled: true },
      })

      expect(result.has('bg-white')).toBe(true)
      expect(result.has('dark:bg-gray-800')).toBe(true)
      expect(result.has('p-6')).toBe(true)
      expect(result.has('rounded-xl')).toBe(true)
      expect(result.has('shadow-lg')).toBe(true)
      expect(result.has('dark:shadow-none')).toBe(true)
      expect(result.has('border-gray-200')).toBe(true)
      expect(result.has('dark:border-gray-700')).toBe(true)
      expect(result.has('text-gray-900')).toBe(true)
      expect(result.has('dark:text-white')).toBe(true)
      expect(result.has('font-bold')).toBe(true)
      expect(result.has('text-xl')).toBe(true)
      expect(result.has('text-gray-600')).toBe(true)
      expect(result.has('dark:text-gray-300')).toBe(true)
      expect(result.has('mt-2')).toBe(true)
    })
  })
})
