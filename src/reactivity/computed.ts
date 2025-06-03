import { ReactiveEffect } from "./effect"

class ComputedRefImp {
    private _getter: any
    private _dirty: any
    private _value: any
    private _effect: ReactiveEffect
    constructor(getter) {
        this._getter = getter
        this._dirty = true // 脏数据, 说明需要执行getter以更新
        this._effect = new ReactiveEffect(getter, ()=>{
            this._dirty = true
        })
    }
    get value() {
        if (this._dirty) {
            this._dirty = false // 不脏, 说明是干净的数据, 不应该执行函数
            this._value = this._effect.run()
        }
        return this._value
    }
}

export function computed(getter) {
    return new ComputedRefImp(getter)
}