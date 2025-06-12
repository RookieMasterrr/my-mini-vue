import { getCurrentInstance } from "./component";

export function provide(key, value) {
    const currentInstance: any = getCurrentInstance()
    if (currentInstance) {
        let { providers } = currentInstance

        const parentProvides = currentInstance.parent.providers

        // init
        if (providers === parentProvides) {
            providers = currentInstance.providers = Object.create(parentProvides)
        }

        providers[key] = value
    }
}

export function inject(key, defaultValue) {
    const currentInstance: any = getCurrentInstance()
    if (currentInstance) {
        const { parent } = currentInstance
        const { providers } = parent
        if (key in providers) {
            return providers[key] 
        }else {
            if (typeof defaultValue === 'function') {
                return defaultValue()
            }else {
                return defaultValue
            }
        }
    }
}   