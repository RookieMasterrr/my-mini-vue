import { hasChanged, isObject } from "../shared";
import { isTracking, trackEffects, triggerEffect } from "./effect";
import { reactive } from "./reactive";

export class refImpl {
    private _value: any;
    public dep
    private _rawValue: any;
    public __v_isRef = true;
    constructor(value) { // value是单个值
        this._rawValue = value
        this._value = convert(value)
        this.dep = new Set();
    }

    get value() {
        trackRefValue(this)
        return this._value;
    }
    
    set value(newValue) {
        if(hasChanged(newValue,this._rawValue)){
            this._rawValue = newValue
            this._value = convert(newValue)
            triggerEffect(this.dep)
        }
    }
}

function trackRefValue(ref) {
    if(isTracking()) {
        trackEffects(ref.dep)
    }
}

function convert(value) {
    return isObject(value) ? reactive(value) : value
}

export function ref(value) {
    return new refImpl(value)
}

export function isRef(ref) {
    return !!ref.__v_isRef
}

export function unRef(ref) {
    return isRef(ref) ? ref.value : ref
}

export function proxyRefs(objectWithRefs) {
    return new Proxy(objectWithRefs, {
        get(target, key) {
            return unRef(Reflect.get(target, key))
        },
        set(target, key, value) {
            if (isRef(target[key]) && !isRef(value)) {
                return Reflect.set(target[key], 'value', value)
            }else {
                return Reflect.set(target, key, value)
            }
        }
    })
}