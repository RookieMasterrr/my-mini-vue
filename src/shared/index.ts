export const extend = Object.assign

export function isObject(value) {
    return (value !== null) && (typeof value === 'object')
}

export const hasChanged = (oldValue, newValue) => !Object.is(oldValue, newValue)