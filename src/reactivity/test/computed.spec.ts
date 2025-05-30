import { computed } from "../computed";
import { reactive } from "../reactive";

describe('computed', ()=>{
    it('happy path', () => {
        const user = reactive({
            age: 1
        })
        const age = computed(()=>{
            return user.age
        })
        expect(age.value).toBe(1)
    });

    it('should compute lazily', () => {
        const value = reactive({
            foo: 1
        })

        const getter = jest.fn(()=>{
            return value.foo
        })

        const cValue = computed(getter)

        // lazy, 没有调用cValue.value的话, getter都不会被调用
        expect(getter).not.toHaveBeenCalled()

        expect(cValue.value).toBe(1)
        expect(getter).toHaveBeenCalledTimes(1)

        cValue.value // 仍然应该还是只被调用了一次
        expect(getter).toHaveBeenCalledTimes(1)

        value.foo = 2 // 修改了响应式的值, 但是还没调用cValue, effect仍然不该被调用
        expect(getter).toHaveBeenCalledTimes(1)
    });
})