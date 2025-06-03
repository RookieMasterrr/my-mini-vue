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

        const getter = jest.fn(() => {
            return value.foo
        })

        // lazy(没有调用cValue.value的话, 不应该执行)
        const cValue = computed(getter)
        expect(getter).not.toHaveBeenCalled()

        expect(cValue.value).toBe(1);
        expect(getter).toHaveBeenCalledTimes(1)

        // should not computed again
        expect(cValue.value).toBe(1);
        expect(getter).toHaveBeenCalledTimes(1)


        value.foo = 2
        expect(getter).toHaveBeenCalledTimes(1) // 仍然未调用cValue.value
        expect(cValue.value).toBe(2);// 调用了cValue.value
        expect(getter).toHaveBeenCalledTimes(2)


        // 仍然是lazily load
        expect(cValue.value).toBe(2);
        expect(getter).toHaveBeenCalledTimes(2)



    });
})