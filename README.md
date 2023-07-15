## 项目架构

- packages 前端公用包
  - common\*
    - core
      - ant 组件 + http + style
    - shared
      - 公用组件、模块、工具库
    - node
      - 后端中的公用组件、模块、工具库，包括 nestjs/electron 等
    - web
      - web 中的 - 跨项目业务组件、业务逻辑
    - upper
      - 上位机中的 - 跨项目业务组件、业务逻辑
  - tool-\* 工具库
    - cli
    - gen-api
- projects 所有前端项目
  - own-\* 前端自建项目
    - docs 前端文档
  - tool-\* 工具类项目，通常为了服务某个项目而建
  - upper-\* 上位机类项目
    - pa 功放
    - pp 频谱侦测
    - omt 电围
  - web-\* 管理后台类项目

## 前端规范

## VSCode 配置指南

### 插件

- Vue Language Features(Volar)
- TypeScript Vue Plugin(Volar)
- prettier
- ESLint
