import { createRender } from "../runtime-core";


function createElement(type) {
    return document.createElement(type)
}

function patchProp(el, key, prevVal, nextVal) {
    const isOn = (key:string)=>/^on[A-Z]/.test(key)
    if (isOn(key)) {
        const event = key.slice(2).toLowerCase()
        el.addEventListener(event, nextVal)
    }else {
        if(nextVal === undefined || nextVal === null) {
            el.removeAttribute(key)
        }else {
            el.setAttribute(key, nextVal)
        }
    }
}

function insert(child, container, anchor=null) {
    container.insertBefore(child, anchor)
}

function remove(el) {
    el.remove()
}

function setElementText(container, text) {
    container.textContent = text
}

const renderer:any = createRender({
    createElement,
    patchProp, 
    insert,
    remove,
    setElementText
})

export function createApp(...args) {
    return renderer.createApp(...args)
}

export * from "../runtime-core";