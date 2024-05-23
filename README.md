# 简介
自己项目所有代码都会放在这个仓库里，方便维护。

## 项目架构

- packages 公用包
  - common\*
  - tool-\* 工具库
- apps 所有项目

## 分类依据
- packages
  - 语言功能
    - 正则
    - DOM
    - ...
  - 共有概念
    - UI组件
    - 多语言
    - 主题色
    - http
    - 协议
    - 设备连接
    - 功能概念
      - 地图
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
