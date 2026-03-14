import {DIContainer} from '../../src';

export function getTestContainer() {
    const container = DIContainer.getInstance();
    container.clear();
    return container;
}
