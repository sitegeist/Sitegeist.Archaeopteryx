import * as React from 'react';
interface NeosContextProperties {
    globalRegistry: {
        get: (key: string) => {
            get: <T>(key: string) => T;
            getAllAsList: <T>() => T[];
        } | undefined;
    };
    store: {
        getState: () => {
            cr?: {
                nodes?: {
                    siteNode?: string;
                    documentNode?: string;
                };
            };
        };
    };
    configuration: {
        nodeTree?: {
            loadingDepth?: number;
            presets?: {
                default?: {
                    baseNodeType?: string;
                };
            };
        };
    };
}
export declare const NeosContext: React.Context<NeosContextProperties | null>;
export declare function useNeos(): NeosContextProperties | null;
export {};
