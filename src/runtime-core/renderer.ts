import { effect } from "../reactivity/effect";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment,Text } from "./vnode";

export function createRender(options) {

    const {
        createElement: hostCreateElement,
        patchProp: hostPatchProp,
        insert: hostInsert,
        remove: hostRemove,
        setElementText: hostSetElementText
    } = options
    

    function render(vnode, container, parentComponent) {
        patch(null, vnode, container, parentComponent);
    }
    
    function patch(n1, n2, container, parentComponent) {
        const { type, shapeFlag } = n2
    
        switch (type) {
            case Fragment:
                processFragment(n1, n2, container, parentComponent)
                break;
            case Text:
                processText(n1, n2, container);
                break;
            default:
                if (shapeFlag & ShapeFlags.ELEMENT) {
                    processElement(n1, n2, container, parentComponent);
                }else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                    processComponent(n1, n2, container, parentComponent);
                }
                break;
        }
    
    }
    
    function processText(n1, n2, container) {
        const {children:text} = n2
        const textNode = n2.el = document.createTextNode(text)
        container.append(textNode)
    }
    
    function processFragment(n1, n2: any, container: any, parentComponent) {
        mountChildren(n2, container, parentComponent)
    }
    
    function processComponent(n1, n2, container, parentComponent) {
        mountComponent(n2, container, parentComponent);
    }
    
    function processElement(n1, n2, container, parentComponent) {
        if(!n1) {
            mountElement(n2, container, parentComponent);
        }else {
            patchElement(n1, n2, container)
        }
    }
    
    function patchElement(n1, n2, container) {
        // console.log(n1);
        // console.log(n2);
        const oldProps = n1.props || {}
        const newProps = n2.props || {}

        const el = n2.el = n1.el
        patchChildren(n1, n2, el)
        patchProps(el, oldProps, newProps)
    }

    function patchChildren(n1, n2, container) {
        const prevShapeFlag = n1.shapeFlag
        const shapeFlag = n2.shapeFlag
        const c1 = n1.children
        const c2 = n2.children
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                unmountChildren(n1.children)
                hostSetElementText(container, c2)
            }else if(prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
                if(c1 === c2) return;
                hostSetElementText(container, c2)
            }
        }
    }

    function unmountChildren(children) {
        for (const child of children) {
            const el = child.el
            hostRemove(el)
        }
    }


    function patchProps(el, oldProps, newProps) {
        if (oldProps === newProps) return;

        for (const key in newProps) {
            const prevProp = oldProps[key]
            const nextProp = newProps[key]
            if (prevProp !== newProps) {
                hostPatchProp(el, key, prevProp, nextProp)
            }
        }

        for (const key in oldProps) {
            if (!(key in newProps)) {
                hostPatchProp(el, key, oldProps[key], null)
            }
        }
    }

    function mountComponent(initinalVNode, container, parentComponent) {
        const instance = createComponentInstance(initinalVNode, parentComponent);
        setupComponent(instance);
        setupRenderEffect(instance, initinalVNode, container)
    }
    
    function mountElement(vnode, container, parentComponent) {
        const { type,children,props,shapeFlag } = vnode
    
        const el = vnode.el = hostCreateElement(type)
    
        if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            mountChildren(vnode, el, parentComponent)
        }else if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
            el.textContent = children
        }
    
        for (const key in props) {
            const value = props[key]
            hostPatchProp(el, key, null, value)
        }
    
        hostInsert(el, container)
    }
    
    function mountChildren(vnode, container, parentComponent) {
        vnode.children.forEach(child => {
            patch(null, child, container, parentComponent)
        });
    }
    
    function setupRenderEffect(instance, initialVnode, container) {
        effect(()=>{
            if(!instance.isMounted) {
                const { proxy } = instance
                const subTree = instance.subTree = instance.render.call(proxy)
                
                patch(null, subTree, container, instance)
                
                initialVnode.el = subTree.el
                instance.isMounted = true
            }else {
                const { proxy } = instance
                const subTree = instance.render.call(proxy)
                const prevSubTree = instance.subTree
                
                instance.subTree = subTree

                console.log("current", subTree);
                console.log("prev", prevSubTree);

                patch(prevSubTree, subTree, container, instance)
                
            }
        })
    }

    return {
        createApp: createAppAPI(render)
    }
}