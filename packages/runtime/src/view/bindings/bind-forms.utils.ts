/**
 * Resolves the correct value for different form controls.
 *
 * Handles edge cases:
 * - radio: updates only when checked
 * - checkbox: uses checked instead of value
 * - default: uses value
 *
 * @param target - The form element
 * @returns The resolved value or undefined (if should not update)
 */
export function resolveInputValue(
    target: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
): any {

    /**
     * RADIO:
     * Only update when the radio is checked.
     */
    if (target instanceof HTMLInputElement && target.type === 'radio') {
        if (!target.checked) return undefined;
        return target.value;
    }

    /**
     * CHECKBOX:
     * Use boolean checked state.
     */
    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
        return target.checked;
    }

    /**
     * DEFAULT:
     * text, textarea, select, etc.
     */
    return target.value;
}
