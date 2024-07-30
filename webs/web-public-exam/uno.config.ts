import { defineConfig, presetAttributify, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
  shortcuts: [
    {
      'uno-center': 'flex justify-center items-center',
    },
  ],
  presets: [presetUno(), presetAttributify()],
  transformers: [transformerDirectives()],
})
