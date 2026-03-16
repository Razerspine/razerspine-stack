import {describe, it, expect, beforeEach} from 'vitest';
import {DIContainer, inject} from '../../../src';
import {getTestContainer} from '../../helpers/get-test-container';

class TestService {
    value = 123;
}

class AnotherService {
    name = 'test';
}

abstract class Logger {
    abstract log(msg: string): void;
}

class ConsoleLogger extends Logger {
    log(msg: string) {
    }
}

describe('DIContainer', () => {
    let container: DIContainer;

    beforeEach(() => {
        container = getTestContainer();
    });

    it('returns the same singleton instance', () => {
        const a = DIContainer.getInstance();
        const b = DIContainer.getInstance();

        expect(a).toBe(b);
    });

    it('registers and resolves a service', () => {
        const service = new TestService();

        container.register(TestService, service);

        const resolved = container.resolve(TestService);

        expect(resolved).toBe(service);
        expect(resolved.value).toBe(123);
    });

    it('inject() returns the same instance as resolve()', () => {
        const service = new TestService();

        container.register(TestService, service);

        const resolved = inject(TestService);

        expect(resolved).toBe(service);
    });

    it('inject resolves dependency from global container', () => {
        const service = new TestService();

        DIContainer.getInstance().register(TestService, service);

        const resolved = inject(TestService);

        expect(resolved).toBe(service);
    });

    it('overrides previously registered service', () => {
        const service1 = new TestService();
        const service2 = new TestService();

        container.register(TestService, service1);
        container.register(TestService, service2);

        const resolved = container.resolve(TestService);

        expect(resolved).toBe(service2);
    });

    it('resolves multiple different services', () => {
        const service1 = new TestService();
        const service2 = new AnotherService();

        container.register(TestService, service1);
        container.register(AnotherService, service2);

        expect(container.resolve(TestService)).toBe(service1);
        expect(container.resolve(AnotherService)).toBe(service2);
    });

    it('does not mix instances of different tokens', () => {
        const service = new TestService();
        const another = new AnotherService();

        container.register(TestService, service);
        container.register(AnotherService, another);

        expect(container.resolve(TestService)).toBe(service);
        expect(container.resolve(AnotherService)).toBe(another);
    });

    it('supports abstract class tokens', () => {
        const logger = new ConsoleLogger();

        container.register(Logger, logger);

        const resolved = container.resolve(Logger);

        expect(resolved).toBe(logger);
    });

    it('throws error when resolving unregistered service', () => {
        expect(() => {
            container.resolve(AnotherService);
        }).toThrow(/not registered/);
    });

    it('clear() removes all instances', () => {
        const service = new TestService();

        container.register(TestService, service);

        container.clear();

        expect(() => {
            container.resolve(TestService);
        }).toThrow();
    });
});
