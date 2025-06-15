import { camelize, toHandlerKey } from "../shared"

export function emit(instance, event, ...args) {
    const { props } = instance
    const handlerName =  toHandlerKey(camelize(event))
    const handler = props[handlerName]
    if (handler) {
        handler(...args)
    }
}