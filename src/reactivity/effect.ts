import { extend } from "../shared";

class ReactiveEffect {
    _fn: Function;
    deps: any[];
    active:boolean;
    onStop:any
    constructor(fn:Function) {
        this._fn = fn
        this.deps = [];
        this.active = true
    }
    run() {
        activateEffect = this
        return this._fn()
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

let activateEffect;
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

    if (activateEffect) {
        dep.add(activateEffect)
        activateEffect.deps.push(dep)
    }

}

export function trigger(target, key) {
    const deps = targetMap.get(target).get(key)
    for (const effect of deps) {
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