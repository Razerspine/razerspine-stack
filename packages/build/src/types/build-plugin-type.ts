import {Configuration} from 'webpack';
import {NormalizedCoreOptions} from '../options';

export type BuildContextType = {
    options: NormalizedCoreOptions;
};

export type BuildPluginType = {
    name: string;

    /**
     * Runs once during base config creation
     */
    setup?: (ctx: BuildContextType) => void;

    /**
     * Extends base config
     */
    applyBase?: (config: Configuration) => void;

    /**
     * Extends dev config
     */
    applyDev?: (config: Configuration) => void;

    /**
     * Extends production config
     */
    applyProd?: (config: Configuration) => void;
};
