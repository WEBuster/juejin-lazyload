# juejin-lazyload

[![Version](https://img.shields.io/npm/v/juejin-lazyload.svg?style=flat-square)](https://www.npmjs.com/package/juejin-lazyload)
[![License](https://img.shields.io/npm/l/juejin-lazyload.svg?style=flat-square)](LICENSE)

[掘金](https://juejin.im) 图片延迟加载插件。

## 机制

### 起始状态

```html
<img data-src="pic.jpg">
<div data-src="pic.jpg"></div>
```

### 初始化

```html
<img data-src="pic.jpg" class="inited" src="[placeholder]">
<div data-src="pic.jpg" class="inited"></div>
```

### 加载中

```html
<img data-src="pic.jpg" class="inited loading" src="[placeholder]">
<div data-src="pic.jpg" class="inited loading"></div>
```

`[placeholder]` 为透明占位 SVG 的 Data URL（`data:image/svg+xml,...`），其宽高由 `infoGetter` 得到，不指定则无占位。使用透明占位 SVG 可以使 IMG 元素得到与加载成功状态相同的尺寸布局表现以防止页面跳动。

### 加载成功

```html
<img data-src="pic.jpg" class="inited loaded" src="pic.jpg">
<div data-src="pic.jpg" class="inited loaded" style="background-image:url(pic.jpg)"></div>
```

### 加载失败

```html
<img data-src="pic.jpg" class="inited error" src="[placeholder]">
<div data-src="pic.jpg" class="inited error"></div>
```

为防止失败时页面跳动，占位 SVG 保持不变。

## 建议

加载中及加载失败推荐根据状态类来自定义样式，比如使用 `background-image` 来显示表示正在加载的动图。

状态变化钩子 `onStateChange` 可以用来应对更自由的需求，比如使自定义结构下 IMG 元素图片渐显。

## 安装

```bash
npm i -S juejin-lazyload
```

## 使用

### 初始化

#### 模块化环境

```js
import JuejinLazyload from 'juejin-lazyload'

const lazyload = new JuejinLazyload(...)
```

#### 浏览器直引

```html
<script src="path/to/juejin-lazyload.min.js"></script>
```

```js
var lazyload = new JuejinLazyload(...)
```

### 构造参数

```js
new JuejinLazyload(Element || ElementList || selector, {
  // 加载区域与可视区域之差
  threshold: 0,

  // 状态更新的最小时间间隔
  interval: 200,

  // 是否启用防抖，待可视状态变化停止时才更新图片状态
  debounce: false,

  // 是否自动监听 window 的 scroll 和 resize 事件
  reactive: true,

  // 初始化及 addOrUpdateElement 时调用
  infoGetter: (Element) => ({
    url: String,   // 图片地址，用以设置 IMG 元素的 src 或其它元素的 background-image
    width: Number, // 图片宽度，用以设置加载时透明占位 SVG 宽度
    height: Number // 图片高度，用以设置加载时透明占位 SVG 高度
  }),

  // 可视区域，默认为文档可视区域
  visibleAreaGetter: () => DOMRect,

  // 状态变化钩子，state = 'inited' || 'loading' || 'loaded' || 'error'
  onStateChange: (state, url, Element, JuejinLazyload) => {}
})
```

### 图片元素状态类

```bash
inited  # 已初始化
loading # 正在加载
loaded  # 已加载
error   # 加载失败
```

### 方法

```js
// 添加或更新元素
lazyload.addOrUpdateElement(Element || ElementList || selector)

// 移除元素
lazyload.removeElement(Element || ElementList || selector)

// 移除所有元素
lazyload.clean()

// 更新图片状态，可视状态变化时调用
lazyload.updateState()

// 销毁
lazyload.destroy()
```
