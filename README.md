# 小程序框架 Wetype Simple 文档

![wetype_group](http://ac-29n1vuqk.clouddn.com/ab3025c1e159febe3d98.png)

## 介绍

自微信小程序发布以来，作为一名前端开发者，就一直在关注，并尝试做一款自己的小程序。首先尝试的是官方的开发框架，在开发过程中发现官方框架在许多地方使得代码写得很不舒服，包括不仅限于：

* API 未使用 Promise 封装
* setData 很繁琐
*

很快在社区里发现了[wepy](https://github.com/tencent/wepy)这样的小程序开发框架，一番尝试后决定用它来开发我的第一款小程序。但在开发过程中，仍然觉得 wepy 不能满足我的要求：

* 没有代码提示，用惯了 TypeScript 再去写纯 JS，没有代码提示是很不舒服的事情
* 定义对 class API 不太友好

于是我在 wepy 的启发下，着手开发出 wetype 这样的小程序框架，全程用 TypeScript 开发。

## 先看一段 demo

```typescript
// app.ts

import { App } from 'wetype'

@App.decor({
    config: {
        pages: ['index'],
        window: {
            backgroundTextStyle: 'light',
            navigationBarBackgroundColor: '#3cf',
            navigationBarTitleText: 'WeType'
        }
    }
})
class APP extends App {
    onLaunch() {}
}
```

```typescript
// myPage.ts

import { Page, wx, wt, types } from 'wetype'
import { MyMixin } from './myMixin'

@Page.decor({
    config: {
        navigationBarTitleText: '我的标题'
    },
    mixins: [MyMixin]
})
class MyPage extends Page {
    list: string[] = []
    title: string = ''

    @Page.watch(newVal => {
        console.log('newVal', newVal)
    })
    myName: string = 'GrePuG'

    /**
     * 相当于手写一个
     * onInput(e) {
     *     this.inputVal = e.detail.value
     * }
     */
    @Page.input('onInput') inputVal: string = ''

    onLoad(options: types.OnloadOptions) {
        this.list.push('hello, world')
        this.title = 'hi'
    }

    /**
     * 计算属性
     * */
    get myComputedValue() {
        return this.inputVal + 1
    }

    @Page.on
    myMixinLoaded() {}

    tapItem(e: types.wxEvent) {}
}
```

```typescript
// myMixin.ts

import { Page, wx } from 'wetype'

export class MyMixin extends Page {
    onLoad() {
        this.emit('myMixinLoaded', true)
    }
}
```

```pug
//- myPage.pug

.page
    .list
        .item(:for="(el, i) in list" :data-i="i" @tap="tapItem")
            .id {{i}}
            .title {{el.title}}
```

从 demo 不难看出，实际上 wetype 就是封装了一层语法糖，把一些很繁琐的语法精简了一下：

* class 属性直接用作`data`

* `get`语法用作计算属性

* class 方法直接用作`Page`对象的方法

* 装饰器`@Page.watch`可以直接对`data`对象的属性进行监听变化；

* 装饰器`@Page.input(eventName)`可以直接将表单输入的值对被修饰的`data`对象属性进行赋值；

* 装饰器`@Page.on`可以监听 mixin 发生的事件；

* ...

## 用法

推荐使用 wetype 提供的开发模板`wetype-template`

```bash
$ git clone https://github.com/wetype/wetype-template
```

```bash
$ cd wetype-template
```

```bash
$ npm i
```

```bash
$ npm start
```

## 申明

wetype 目前并没有强大的后盾去支持，现阶段只是本人一个对于小程序框架用 TypeScript 去封装的一个尝试，暂时还没有用 wetype 开发并上线的小程序产品。这么早开源出来也是想起到一个抛砖引玉的作用。希望感兴趣的社区里的开发者朋友能一起来使 wetype 变得强大。

## TODO

* [ ] 文档
* [ ] 单元测试
* [ ] 代码精简
* [ ] 打包工具优化
* [ ] 库体积优化
