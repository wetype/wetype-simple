import { global } from './global'
import { Page } from './Page'
import { App } from './App'
import { Component } from './Component'
import { Behavior } from './Behavior'
import { wx } from './lib/wx'
import * as wt from './lib/wetype'
import * as types from './types'
import * as _ from 'lodash-es'
// import _ = require('lodash')

export {
    _,
    global,
    Page,
    App,
    Component,
    Behavior,
    wt,
    /**
     * 原生提供的wx对象
     */
    wx,
    types
}