const THEME_STORAGE_KEY = 'data_theme_value'

/**
 * 主题文件夹中有多少主题，就配置多少
 */
export enum ETheme {
  dark = 'dark',
}

export interface StyleThemeOption {
  themes?: ETheme[]
}

export class ThemeService {
  themes: ETheme[]

  constructor({ themes = [ETheme.dark] }: StyleThemeOption = { themes: [ETheme.dark] }) {
    this.themes = themes

    this.init()
  }

  setTheme(theme: ETheme) {
    if (!this.themes.includes(theme)) return
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || this.themes[0]
      if (this.themes.includes(savedTheme as ETheme)) {
        this.setTheme(savedTheme as ETheme)
      }
    })
  }
}
