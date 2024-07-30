## 问题记录

### 材质
1. read type undefined 
    uniforms字段的值为undefined时，会报错
2. Invalid vec4 value for uniform 'color_0'
    这个错误通常表示赋给 color_0 的值不是有效的 vec4 类型。在WebGL中，vec4 通常表示一个包含四个分量的向量，通常对应RGBA（红、绿、蓝、不透明度）颜色。
3. polyline无法渲染，控制台vite报错：document is not defined
    最后发现是vite 5.2.0版本,回退到^3.1.7即可