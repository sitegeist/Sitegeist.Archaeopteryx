import { INodeTypesRegistry } from '../ContentRepository/NodeTypesRegistry';
export interface IGlobalRegistry {
    get(key: string): {
        get: <T>(key: string) => T;
        getAllAsList: <T>() => T[];
        set(key: string, value: any): void;
    } | undefined;
    get(key: '@neos-project/neos-ui-contentrepository'): INodeTypesRegistry;
    set(key: string, value: any): void;
}
export declare function useGlobalRegistry(): null | IGlobalRegistry;
