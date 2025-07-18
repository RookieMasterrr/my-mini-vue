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
        patch(null, vnode, container, parentComponent, null);
    }
    
    function patch(n1, n2, container, parentComponent, anchor) {
        const { type, shapeFlag } = n2
    
        switch (type) {
            case Fragment:
                processFragment(n1, n2, container, parentComponent, anchor)
                break;
            case Text:
                processText(n1, n2, container);
                break;
            default:
                if (shapeFlag & ShapeFlags.ELEMENT) {
                    processElement(n1, n2, container, parentComponent, anchor);
                }else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                    processComponent(n1, n2, container, parentComponent, anchor);
                }
                break;
        }
    
    }
    
    function processText(n1, n2, container) {
        const {children:text} = n2
        const textNode = n2.el = document.createTextNode(text)
        container.append(textNode)
    }
    
    function processFragment(n1, n2: any, container: any, parentComponent, anchor) {
        mountChildren(n2.children, container, parentComponent, anchor)
    }
    
    function processComponent(n1, n2, container, parentComponent, anchor) {
        mountComponent(n2, container, parentComponent, anchor);
    }
    
    function processElement(n1, n2, container, parentComponent, anchor) {
        if(!n1) {
            mountElement(n2, container, parentComponent, anchor);
        }else {
            patchElement(n1, n2, container, parentComponent, anchor)
        }
    }
    
    function patchElement(n1, n2, container, parentComponent, anchor) {
        // console.log(n1);
        // console.log(n2);
        const oldProps = n1.props || {}
        const newProps = n2.props || {}

        const el = n2.el = n1.el
        patchChildren(n1, n2, el, parentComponent, anchor)
        patchProps(el, oldProps, newProps)
    }

    function patchChildren(n1, n2, container, parentComponent, anchor) {
        const prevShapeFlag = n1.shapeFlag
        const nextShapeFlag = n2.shapeFlag
        const c1 = n1.children
        const c2 = n2.children
        if (nextShapeFlag & ShapeFlags.TEXT_CHILDREN) {
            if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                unmountChildren(n1.children)
                hostSetElementText(container, c2)
            }else if(prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
                if(c1 === c2) return;
                hostSetElementText(container, c2)
            }
        }else if(nextShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
                hostSetElementText(container, '')
                mountChildren(c2, container, parentComponent, anchor)
            }else if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                patchKeyedChildren(c1, c2, container, parentComponent, anchor)
            }
        }
    }

    function patchKeyedChildren(c1, c2, container, parentComponent, parentAnchor) {
        let i = 0;
        let e1 = c1.length - 1
        let e2 = c2.length - 1
        // 左侧
        while( (i <= e1) && (i <= e2) ) {
            const n1 = c1[i]
            const n2 = c2[i]

            if(isSameVNodeType(n1, n2)) {
                patch(n1, n2, container, parentComponent, parentAnchor)
            }else {
                break
            }
            i++
        }

        while( (i <= e1) && (i <= e2) ) {
            const n1 = c1[e1]
            const n2 = c2[e2]

            if(isSameVNodeType(n1, n2)) {
                patch(n1, n2, container, parentComponent, parentAnchor)
            }else {
                break
            }
            e1--
            e2--
        }

        if(i > e1){
            if(i <= e2) { // 需要新增
                const nextPos = i + 1
                const anchor:any = i+1 < c2.length ? c2[nextPos].el : null
                patch(null, c2[i], container, parentComponent, anchor)
            }
        }

    }

    function isSameVNodeType(n1, n2) {
        return (n1.type === n2.type) && (n1.key === n2.key)
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

    function mountComponent(initinalVNode, container, parentComponent, anchor) {
        const instance = createComponentInstance(initinalVNode, parentComponent);
        setupComponent(instance);
        setupRenderEffect(instance, initinalVNode, container, anchor)
    }
    
    function mountElement(vnode, container, parentComponent, anchor) {
        const { type,children,props,shapeFlag } = vnode
    
        const el = vnode.el = hostCreateElement(type)
    
        if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            mountChildren(vnode.children, el, parentComponent, anchor)
        }else if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
            el.textContent = children
        }
    
        for (const key in props) {
            const value = props[key]
            hostPatchProp(el, key, null, value)
        }
    
        hostInsert(el, container, anchor)
    }
    
    function mountChildren(children, container, parentComponent, anchor) {
        children.forEach(child => {
            patch(null, child, container, parentComponent, anchor)
        });
    }
    
    function setupRenderEffect(instance, initialVnode, container, anchor) {
        effect(()=>{
            if(!instance.isMounted) {
                const { proxy } = instance
                const subTree = instance.subTree = instance.render.call(proxy)
                
                patch(null, subTree, container, instance, anchor)
                
                initialVnode.el = subTree.el
                instance.isMounted = true
            }else {
                const { proxy } = instance
                const subTree = instance.render.call(proxy)
                const prevSubTree = instance.subTree
                
                instance.subTree = subTree

                console.log("current", subTree);
                console.log("prev", prevSubTree);

                patch(prevSubTree, subTree, container, instance, anchor)
                
            }
        })
    }

    return {
        createApp: createAppAPI(render)
    }
}