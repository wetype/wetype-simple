# 小程序框架 Wetype Simple 文档

![wetype_group](http://ac-29n1vuqk.clouddn.com/ab3025c1e159febe3d98.png)


## 介绍

自微信小程序发布以来，作为一名前端开发者，就一直在关注，并尝试做一款自己的小程序。首先尝试的是官方的开发框架，在开发过程中发现官方框架在许多地方使得代码写得很不舒服，包括不仅限于：

- API未使用Promise封装
- setData很繁琐
- 
很快在社区里发现了[wepy](https://github.com/tencent/wepy)这样的小程序开发框架，一番尝试后决定用它来开发我的第一款小程序。但在开发过程中，仍然觉得wepy不能满足我的要求：

- 没有代码提示，用惯了TypeScript再去写纯的JS，没有代码提示是很不舒服的事情
- 定义对class API不太友好

于是我在wepy的启发下，着手开发出wetype这样的小程序框架，全程用TypeScript开发。

## 先看一段demo

````
// myPage.ts

import { Page, wx, wt, types } from 'wetype-simple'
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

    @Page.watch((newVal) => {
        console.log('newVal', newVal)
    })
    myName: string = 'GrePuG'

    /**
    * 相当于手写一个
    * onInput(e) {
    *     this.inputVal = e.detail.value
    * }
    */
    @Page.input('onInput')
    inputVal: string = ''

    onLoad(options: types.OnloadOptions) {
        this.list.push('hello, world')
        this.title = 'hi'
    }

    @Page.on
    onListChanged(list) {
        this.list = list
    }

    tapItem(e: types.wxEvent) {

    }

}

````

````
//- myPage.pug

.page
    .list
        .item(:for="(el, i) in list" :data-i="i" @tap="tapItem")
            .id {{i}}
            .title {{el.title}}

````