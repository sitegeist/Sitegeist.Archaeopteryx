import * as React from 'react';
interface NeosContextProperties {
    globalRegistry: {
        get: (key: string) => {
            get: <T>(key: string) => T;
            getAllAsList: <T>() => T[];
        } | undefined;
    };
}
export declare const NeosContext: React.Context<NeosContextProperties | null>;
export declare function useNeos(): NeosContextProperties | null;
export {};
