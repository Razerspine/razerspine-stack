/**
 * Parses a method expression like:
 * - "method"
 * - "method()"
 * - "method(1, 'test')"
 *
 * @param expression
 */
export function parseExpression(expression: string): { name: string; args: any[] } {
    const match = expression.match(/^([$\w]+)(?:\((.*)\))?$/);

    if (!match) {
        return {name: expression, args: []};
    }

    const [, name, argsStr] = match;

    if (!argsStr) {
        return {name, args: []};
    }

    /**
     * Very simple argument parser:
     * - numbers
     * - strings
     * - booleans
     */
    const args = argsStr.split(',').map(arg => {
        const trimmed = arg.trim();

        // number
        if (!isNaN(Number(trimmed))) return Number(trimmed);

        // boolean
        if (trimmed === 'true') return true;
        if (trimmed === 'false') return false;

        // string (remove quotes)
        if (
            (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
            (trimmed.startsWith("'") && trimmed.endsWith("'"))
        ) {
            return trimmed.slice(1, -1);
        }

        // fallback: raw string
        return trimmed;
    });

    return {name, args};
}
