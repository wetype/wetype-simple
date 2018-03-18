import { PageContext } from './handleConstructor'

export const listeners: {
    [key: string]: { context: PageContext; method: Function }
} = {}

export const pages: {
    [key: string]: any
} = {}
