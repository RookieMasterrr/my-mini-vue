import { isObject } from "../shared"
import { track, trigger } from "./effect"
import { reactive, ReactiveFlags, readonly } from "./reactive"


const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key) {

    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    }
    if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }



    const res = Reflect.get(target, key)

    if (shallow) {
      return res
    }

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }


    if (!isReadonly) {
      track(target, key)
    }
    // 依赖收集
    return res
  }
}

function createSetter() {
  return function set(target, key, newValue) {
    const res = Reflect.set(target, key, newValue)

    // 触发依赖
    trigger(target, key)
    return res
  }
}


// Handlers
export const mutableHandlers = {
  get: get,
  set: set
}

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, newValue) {
    console.warn(`key: ${key} set failed, bacause target is readonly`, target)
    return true
  },
}

export const shallowReadonlyHandlers = {
  get: shallowReadonlyGet,
  set(target, key, newValue) {
    console.warn(`key: ${key} set failed, bacause target is readonly`, target)
    return true
  },
}