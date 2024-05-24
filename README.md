# 简介
自己项目所有代码都会放在这个仓库里，方便维护。

## 项目架构

- packages 公用包
  - common
    - base js语言通用工具，如正则
    - brower 浏览器相关
    - node node环境相关
    - mini 小程序相关
  - global 全局类
    - theme 主题
    - i18n 多语言
  - abstract 抽象类
    - http
    - map
    - connect
    - cvue
  - ui 组件类
    - cvue - ant-design
  - modules 模块类 - 抽象类的实现
    - http - axios/小程序
    - map - 2d/3d - lealfet
    - connect - udp/tcp/serialport
- apps 所有项目
- tools 工具类项目，服务apps

## 分类依据
- packages
  - 语言功能 - base
    - 正则
    - ...
  - 平台功能
    - 浏览器
      - DOM
    - Server
      - fs模块
    - Electron
    - 小程序
  - 共有概念
    - UI组件
    - 多语言
    - 主题色
    - http
    - 协议
    - 设备连接
    - 功能概念
      - 地图
      - 时间
  - 共有概念实现
    - 基于ant-design的UI组件
    - 基于axios的http
    - 基于leaflet的地图
    - 基于设备协议的协议
    - 基于udp/tcp/serialport的设备连接
  - 共有通用功能模块
    - node日志
    - ftp/sftp
    - 高级组合UI组件
### 插件

- Vue Language Features(Volar)
- TypeScript Vue Plugin(Volar)
- prettier
- ESLint
