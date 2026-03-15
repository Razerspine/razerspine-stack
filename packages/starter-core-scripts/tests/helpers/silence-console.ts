import {vi} from 'vitest';

export function silenceConsole(method: 'warn' | 'error' = 'error') {
    return vi.spyOn(console, method).mockImplementation(() => {
    });
}
