import { extend } from "../shared";

let activateEffect;
let shouldTrack;

export class ReactiveEffect {
    _fn: Function;
    deps: any[];
    active:boolean;
    onStop:any
    scheduler: Function | undefined;
    constructor(fn:Function, scheduler?:Function) {
        this._fn = fn
        this.deps = [];
        this.active = true
        this.scheduler = scheduler
    }
    run() {

        if (!this.active) {
            return this._fn()
        }
        
        shouldTrack = true
        activateEffect = this
        const res = this._fn()
        shouldTrack = false

        return res

    }
    stop() {
        if (this.active) {
            cleanupEffect(this)
            if (this.onStop) {
                this.onStop()
            }
            this.active = false
        }
        
    }
}

function cleanupEffect(effect){
    effect.deps.forEach(dep => {
        dep.delete(effect)
    });
}


export function effect(fn, options:any={}) {

    const _effect = new ReactiveEffect(fn)

    extend(_effect, options)

    _effect.run()

    const runner:any = _effect.run.bind(_effect)
    runner.effect = _effect
    return runner
}


const targetMap = new Map();
export function track(target, key) { // collect dependencies
    if (!isTracking() ) return
    
    let depsMap = targetMap.get(target)
    if(!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }

    let dep = depsMap.get(key)
    if(!dep) {
        dep = new Set()
        depsMap.set(key, dep)
    }

    trackEffects(dep)
}

export function trackEffects(dep) {
    if (dep.has(activateEffect)) return;
    dep.add(activateEffect)
    activateEffect.deps.push(dep)
}

export function isTracking() {
    return shouldTrack && activateEffect!==undefined
}

export function trigger(target, key) {
    const dep = targetMap.get(target).get(key)
    triggerEffect(dep)
}

export function triggerEffect(dep) {
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler()
        }else {
            effect.run()
        }
    }
}


export function stop(runner) { // 从依赖中找到这个函数, 然后将其删除
    runner.effect.stop()
}