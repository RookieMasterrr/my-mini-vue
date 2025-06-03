import { extend } from "../shared";

const targetMap = new Map()
let activeEffect;
let shouldTrack;

export class ReactiveEffect {
    private _fn: any;
    deps:any = [];
    active = true;
    onStop: any;
    constructor(fn, public scheduler?) {
        this._fn = fn
        this.scheduler = scheduler
    }
    run() {
        if(!this.active) {
            return this._fn() // 执行副作用函数, 会触发get操作, get操作可能触发trigger函数
        }

        activeEffect = this // 设置当前活跃副作用
        shouldTrack = true

        const value = this._fn()
        shouldTrack = false
        return value

    }
    stop() {
        if(this.active) {
            cleanupEffect(this)
            this.active = false
            if (this.onStop) {
                this.onStop()
            }
        }
    }
}

function cleanupEffect(effect) {
    for (const deps of effect.deps) {
        deps.delete(effect)
    }
}

export function effect(fn, options:any={}) {
    const scheduler = options.scheduler
    const _effect = new ReactiveEffect(fn, scheduler)

    extend(_effect, options)

    _effect.run()

    const runner:any = _effect.run.bind(_effect)
    runner.effect = _effect
    return  runner// 返回的是封装完后的run, 调用完之后仍会设置activeEffect
}



export function track(target, key) {
    if(!isTracking()) return;
    
    let depsMap = targetMap.get(target)
    if(!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }

    let deps:Set<any> = depsMap.get(key)
    if(!deps) {
        deps = new Set()
        depsMap.set(key, deps)
    }

    trackEffect(deps)
}


export function trackEffect(deps) {
    if (deps.has(activeEffect)) return;
    deps.add(activeEffect)
    activeEffect.deps.push(deps)
}


export function isTracking() {
    return shouldTrack && activeEffect!==undefined
}

export function trigger(target, key) {
    const depsMap = targetMap.get(target)
    const deps = depsMap.get(key)
    triggerEffect(deps)
}

export function triggerEffect(deps) {
    for (const effect of deps) {
        if (effect.scheduler) {
            effect.scheduler()
        }else {
            effect.run()
        }
    }
}


export function stop(runner) {
    runner.effect.stop()
}