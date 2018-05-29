低版本浏览器跨域AJAX
===================

Cross domain AJAX via `window.postmessage`, for IE6/7/8.

使用 postmessage 处理IE 6/7/8 AJAX跨域问题.


工作原理
-------

页面 `a.com/a.html` 直接通过ajax请求 `b.com/api/b` , 在低版本浏览器调用中会产生跨域问题.

假设有个 `b.com/proxy.html` , 由它 ajax请求 `b.com/api/b` 是不会有跨域问题.

解决方法就是, 使用 `postmessage`(低版本浏览器有 `window.opener` hack 方式), 

把 `a.com/a.html` 要ajax请求的参数通过 `postmessage` 方法传到 `b.com/proxy.html`, 
然后由 `b.com/proxy.html` ajax请求 `b.com/api/b`. 解决了低版本的跨域问题.

Installation / 安装
-------------------

Using npm to install this package.

你可以使用 npm 安装

```bash
npm install @moln/cross-domain-ajax --save
```

Or `yarn`(Recommend)

或者`yarn`(推荐)

```bash
yarn add @moln/cross-domain-ajax -S
```


Usage / 使用
-------------

示例: `http://127.0.0.1:8080/index.html` 请求 `http://127.0.0.2:8080/test.json`


###  调用端使用示例

调用端: `http://127.0.0.1:8080/index.html`

关键调用代码:

```javascript
var CrossAjax = require('./cross-domain-ajax');
var cajax = new CrossAjax('http://127.0.0.2:8080/cross-proxy.html'); //

cajax.ready(function () {
    cajax.ajax({
        url: 'test.json',
        success: function (data, req) {
            console.log("success", data, req);
        },
        error: function () {
            console.log("error", arguments);
        },
        complete: function () {
            console.log("complete", arguments);
        }
    });
});
```

### 代理端示例

1. 编写请求来源限制
2. 通过 webpack 生成 `cross-proxy.html`

代理端代码示例:

```javascript
var cdp = require('./cross-domain-proxy');

//限制请求来源
cdp.onVerifyOrigin(function (origin) {

    console.log(origin);
    if (!/localhost:8080$/.test(origin)) {
        throw new Error('Invalid origin ' + origin);
    }
});
```
