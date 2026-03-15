import {describe, it, expect} from 'vitest';
import {bindForms} from '../../../src';

describe('bindForms', () => {

    it('should update state when input changes', () => {
        document.body.innerHTML = '<input data-model="user.name" value="">';
        const input = document.querySelector('input')!;
        const state = {user: {name: ''}};

        const unbind = bindForms(document.body, {}, state);

        input.value = 'Leonid';
        input.dispatchEvent(new Event('input', {bubbles: true}));

        expect(state.user.name).toBe('Leonid');

        unbind();
    });

    it('should create nested path if missing', () => {
        document.body.innerHTML = `
            <input data-model="user.name">
        `;

        const state: any = {};

        bindForms(document.body, {}, state)

        const input = document.querySelector('input')!;

        input.value = 'Alice';
        input.dispatchEvent(new Event('input', {bubbles: true}));

        expect(state.user.name).toBe('Alice');
    });
});
