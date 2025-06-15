import { h } from "../../lib/guide-mini-vue.esm.js"

export const Foo = {
    name: "Foo",
    setup(props, {emit}) {
        function emitSomething(){
            emit('add',1,2)            
            emit('add-foo')            
        }
        return {
            emitSomething
        }
    },
    render() {
        const btn = h("button", 
            {
                onClick:this.emitSomething
            }, "Button")
        return h("div", {}, [btn])
    }
}