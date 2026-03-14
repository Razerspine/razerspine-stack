import {describe, it, expect, vi} from 'vitest';
import {createStore} from '../../src';

describe('createStore', () => {

    it('returns initial state through proxy', () => {
        const {state} = createStore({count: 1}, null);

        expect(state.count).toBe(1);
    });

    it('triggers onChange when property changes', () => {
        const listener = vi.fn();

        const {state} = createStore({count: 0}, listener);

        state.count = 5;

        expect(listener).toHaveBeenCalledTimes(1);
    });

    it('triggers onChange for nested property changes', () => {
        const listener = vi.fn();

        const {state} = createStore({
            user: {name: 'John'}
        }, listener);

        state.user.name = 'Jane';

        expect(listener).toHaveBeenCalledTimes(1);
    });

    it('does not trigger listener on property read', () => {
        const listener = vi.fn();

        const {state} = createStore({count: 1}, listener);

        const value = state.count;

        expect(value).toBe(1);
        expect(listener).not.toHaveBeenCalled();
    });

    it('preserves reference stability for nested proxies', () => {
        const {state} = createStore({
            user: {name: 'John'}
        }, null);

        const a = state.user;
        const b = state.user;

        expect(a).toBe(b);
    });

    it('triggers onChange when nested object is replaced', () => {
        const listener = vi.fn();

        const {state} = createStore({
            user: {name: 'John'}
        }, listener);

        state.user = {name: 'Jane'};

        expect(listener).toHaveBeenCalledTimes(1);
    });

    it('disconnect stops change notifications', () => {
        const listener = vi.fn();

        const {state, disconnect} = createStore({count: 0}, listener);

        disconnect();

        state.count = 10;

        expect(listener).not.toHaveBeenCalled();
    });

});
