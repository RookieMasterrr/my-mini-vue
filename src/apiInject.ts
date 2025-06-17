import { getCurrentInstance } from "./runtime-core";

export function provide(key, value) {
    const currentInstance:any = getCurrentInstance()
    if(currentInstance) {
        const parentProvides = currentInstance.parent.provides

        // init
        if (currentInstance.provides === currentInstance.parent.provides) {
            currentInstance.provides = Object.create(parentProvides)
        }

        currentInstance.provides[key] = value
    }
}

export function inject(key, defaultValue?) {
    const currentInstance:any = getCurrentInstance()
    if(currentInstance) {
        const { parent } = currentInstance
        const { provides } = parent
        if (key in provides) {
            return provides[key]
        }else if(defaultValue){
            if (typeof defaultValue === 'function'){ 
                return defaultValue()
            }
            return defaultValue
        }
        
    }
}