/**
 * @module dedupe-rules
 * @description Removes duplicate webpack rules based on a stable rule signature.
 *
 * ⚠️ Important:
 * Webpack rules may contain RegExp, functions, arrays, and complex objects.
 * Using JSON.stringify is unsafe because it ignores RegExp and functions,
 * causing rule collisions and unintended rule removal.
 *
 * This implementation provides a stable serialization strategy that:
 * - preserves RegExp identity
 * - supports arrays and nested structures
 * - supports functions
 * - produces deterministic output
 *
 * ---
 * Deduplication strategy:
 *
 * Rules are identified by a signature composed of:
 * - test
 * - include
 * - exclude
 * - issuer
 * - resourceQuery
 *
 * This covers the most common rule-matching dimensions used in Webpack
 * and significantly reduces false-positive deduplication.
 *
 * Note:
 * This is still a heuristic approach (not a full structural comparison),
 * but is safe enough for real-world usage without overengineering.
 */

import {RuleSetRule} from 'webpack';

/**
 * Safely serializes a value into a stable string representation.
 *
 * Supports:
 * - RegExp
 * - arrays
 * - functions
 * - plain objects (with sorted keys for determinism)
 *
 * Ensures that logically different values do not collapse
 * into identical string representations.
 */
function serialize(value: unknown): string {
    if (!value) return '';

    if (value instanceof RegExp) {
        return `__REGEXP__:${value.toString()}`;
    }

    if (Array.isArray(value)) {
        return `[${value.map(serialize).join(',')}]`;
    }

    if (typeof value === 'function') {
        return `__FUNC__:${value.toString()}`;
    }

    if (typeof value === 'object') {
        const obj = value as Record<string, unknown>;

        return `{${Object.keys(obj)
            .sort()
            .map(key => `${key}:${serialize(obj[key])}`)
            .join(',')}}`;
    }

    return String(value);
}

/**
 * Extracts a comparable key from a rule.
 *
 * Uses the most relevant matching fields:
 * - test
 * - include
 * - exclude
 * - issuer
 * - resourceQuery
 *
 * Produces a stable signature to prevent accidental rule collisions
 * while keeping "last rule wins" semantics.
 */
function getRuleKey(rule: RuleSetRule): string {
    const parts = [
        serialize(rule.test),
        serialize(rule.include),
        serialize(rule.exclude),
        serialize(rule.issuer),
        serialize(rule.resourceQuery),
    ];

    return parts.join('|');
}

/**
 * Dedupe rules (last one wins)
 *
 * Iterates through rules and keeps only the last occurrence
 * of each unique rule signature.
 *
 * This is important for:
 * - user overrides
 * - buildPlugins mutations
 * - extending internal rule pipelines safely
 */
export function dedupeRules(rules: RuleSetRule[]): RuleSetRule[] {
    const map = new Map<string, RuleSetRule>();

    for (const rule of rules) {
        const key = getRuleKey(rule);
        map.set(key, rule);
    }

    return Array.from(map.values());
}
