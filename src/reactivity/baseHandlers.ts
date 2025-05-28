import { isObject } from "../shared"
import { track, trigger } from "./effect"
import { reactive, ReactiveFlag, readonly } from "./reactive"

const get = createGetter()
const set = createSetter()

const readonlyGet = createGetter(true)

function createGetter(isReadonly = false) {
    return function(target, key) {
        if(key === ReactiveFlag.IS_REACTIVE) {
            return !isReadonly
        } else if(key === ReactiveFlag.IS_READONLY) {
            return isReadonly
        }

        const res = Reflect.get(target, key)

        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res)
        }

        if(!isReadonly) {
            track(target, key)
        }
        return res
    }
}

function createSetter() {
    return function(target, key, newValue) {
        const res = Reflect.set(target, key, newValue)

        trigger(target, key)
        // TODO 触发依赖
        return res
    }
}

export const mutableHandlers = {
    get,
    set,
}

export const readonlyHandlers = {
    get:readonlyGet,
    set(target, key, velue) {
        console.warn(`key: ${key} set failed, because target is readonly`)
        return true
    },
}