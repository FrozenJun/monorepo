/**
 * 这一步需要在引入Cesium之前执行
 * 拷贝 node_modules/cesium/Build下的Cesium文件夹到项目的 public 目录下
 * 
 * CesiumJS 需要在您的服务器上托管一些静态文件，例如 Web Worker 和 SVG 图标。配置您的模块捆绑器以复制以下四个目录并将它们作为静态文件提供：

    node_modules/cesium/Build/Cesium/Workers
    node_modules/cesium/Build/Cesium/ThirdParty
    node_modules/cesium/Build/Cesium/Assets
    node_modules/cesium/Build/Cesium/Widgets
    在导入CesiumJS之前必须设置全局变量 window.CESIUM_BASE_URL 。它必须指向提供这四个目录的URL。

    例如，如果 处的图像 Assets/Images/cesium_credit.png 带有 public/Cesium/ 下的前缀 http://localhost:8080/public/Cesium/Assets/Images/cesium_credit.png，则您可以按如下方式设置基本 URL：
    
    window.CESIUM_BASE_URL = '/public/Cesium/';
  */
;(window as any).CESIUM_BASE_URL = '/public/Cesium'
