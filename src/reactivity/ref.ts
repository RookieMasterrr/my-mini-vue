import { hasChanged, isObject } from "../shared"
import { isTracking, trackEffect, triggerEffect } from "./effect"
import { reactive } from "./reactive"

export class RefImpl {
    private _value: any
    private deps: any
    private _rawValue: any
    public __v_isRef = true
    constructor(value) {
        this._rawValue = value
        this._value = convert(value)
        this.deps = new Set()
    }
    get value() {
        trackRefValue(this)        
        return this._value
    }
    set value(newValue) {
        if (hasChanged(newValue, this._rawValue)){
            this._rawValue = newValue
            this._value = convert(newValue)
            triggerEffect(this.deps)
        }
    }
}

export function ref(value) {
    return new RefImpl(value)
}

export function isRef(ref) {
    return !!ref.__v_isRef
}

export function unRef(ref) {
    return isRef(ref) ? ref.value : ref
}

export function proxyRefs(obj) {
    return new Proxy(obj, {
        get(target, key) {
            return unRef(Reflect.get(target, key))
        },
        set(target, key, newValue) {
            if (isRef(target[key]) && !isRef(newValue)) {
                target[key].value = newValue
            }else {
                target[key] = newValue
            }
            return true
        },
    })
}

function trackRefValue(ref) {
    if(isTracking()) {
        trackEffect(ref.deps)
    }
}

function convert(value) {
    return isObject(value) ? reactive(value) : value
}