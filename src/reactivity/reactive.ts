import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from "./baseHandlers"

export const enum ReactiveFlag {
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadonly'
}

export function reactive(raw) {
    return createActiveObject(raw, mutableHandlers)
}

export function readonly(raw) {
    return createActiveObject(raw, readonlyHandlers)
}

export function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHandlers)
}

export function isReactive(value) {
    return !!value[ReactiveFlag.IS_REACTIVE] // 传入的value是普通object的话, 返回的是undefined, 需要转化为bool类型
}

export function isReadonly(value) {
    return !!value[ReactiveFlag.IS_READONLY]
}

export function isProxy(value) {
    return !!value[ReactiveFlag.IS_READONLY] || !!value[ReactiveFlag.IS_REACTIVE]
}

function createActiveObject(raw, handlers) {
    return new Proxy(raw, handlers)
}