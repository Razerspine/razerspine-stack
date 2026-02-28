/**
 * Retrieves a nested value from an object using a dot-notation string path.
 * Example: getValue(state, "user.profile.name")
 * @param obj - The source object.
 * @param path - The string path to the desired property.
 * @returns The value at the path, or undefined if any part of the path is missing.
 */
export function getValue(obj: any, path: string) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

/**
 * Sets a nested value within an object using a dot-notation string path.
 * If intermediate objects in the path do not exist, they will be created.
 * @param obj - The target object.
 * @param path - The string path where the value should be set.
 * @param value - The value to assign.
 */
export function setValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
        // Create an empty object if the intermediate key doesn't exist
        if (!(keys[i] in current)) {
            current[keys[i]] = {};
        }
        current = current[keys[i]];
    }

    // Assign the final value to the last key in the path
    current[keys[keys.length - 1]] = value;
}
