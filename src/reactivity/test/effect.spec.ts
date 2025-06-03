import { effect } from "../effect";
import { stop } from "../effect";
import { reactive } from "../reactive";

describe('effect', () => {

    it('happy path', () => {
        const user = reactive({
            age: 10
        })

        let nextAge;
        effect(() => {
            nextAge = user.age + 1
        })

        expect(nextAge).toBe(11)

        user.age++
        expect(nextAge).toBe(12)
    });

    it('should return runner when call effect', () => {
        let foo = 10
        const runner = effect(()=>{
            foo++
            return 'foo'
        })

        expect(foo).toBe(11)

        const r = runner()
        expect(foo).toBe(12)
        expect(r).toBe('foo')

    });

    it('scheduler', () => {
        let dummy;
        let run;
        const scheduler = jest.fn(()=>{
            run = runner
        });
        const obj = reactive({ foo: 1})
        const runner = effect(()=>{
            dummy = obj.foo
        },
        { scheduler }
        )

        // 初始化时, scheduler不会被调用, effect会被调用一次
        expect(scheduler).not.toHaveBeenCalled()
        expect(dummy).toBe(1)

        // 后续, scheduler会被调用, effect不再被调用
        obj.foo++
        expect(scheduler).toHaveBeenCalledTimes(1)
        expect(dummy).toBe(1)

        // 调用runner仍然有用
        run()
        expect(dummy).toBe(2)

    });

    it('stop', () => {
        let dummy;
        const obj = reactive({ prop: 1 })
        const runner = effect(()=>{
            dummy = obj.prop
        })
        obj.prop = 2
        expect(dummy).toBe(2)

        stop(runner)
        // obj.prop = 3
        obj.prop++ // 重新触发了依赖收集
        expect(dummy).toBe(2)

        runner()
        expect(dummy).toBe(3)
    });

    it('onStop', () => {
        const obj = reactive({
            foo: 1
        })
        const onStop = jest.fn()
        let dummy
        const runner = effect(
            ()=>{
                dummy = obj.foo
            },
            {
            onStop  
            }
        )

        stop(runner)
        expect(onStop).toHaveBeenCalledTimes(1)
    });

})