import { track, trigger } from "./effect"

export function reactive(raw) {
    return new Proxy(raw, {
        get(target, key) {
            const res = Reflect.get(target,key)

            // TODO 依赖收集, 每个target的每个key, 都有一个依赖列表, 列表中的项都依赖与这个数据
            track(target, key)
            return res
        },

        set(target, key, newValue) {
            const res = Reflect.set(target, key, newValue)

            trigger(target, key)
            // TODO 触发依赖
            return res
        },
    })
}