/**
 * @module dedupe-rules
 * @description Removes duplicate webpack rules based on their test pattern.
 */

import {RuleSetRule} from 'webpack';

/**
 * Extracts a comparable key from a rule
 */
function getRuleKey(rule: RuleSetRule): string {
    if (rule.test instanceof RegExp) {
        return rule.test.toString();
    }

    return JSON.stringify(rule.test || rule.include || rule.exclude || {});
}

/**
 * Dedupe rules (last one wins)
 */
export function dedupeRules(rules: RuleSetRule[]): RuleSetRule[] {
    const map = new Map<string, RuleSetRule>();

    for (const rule of rules) {
        const key = getRuleKey(rule);
        map.set(key, rule);
    }

    return Array.from(map.values());
}
