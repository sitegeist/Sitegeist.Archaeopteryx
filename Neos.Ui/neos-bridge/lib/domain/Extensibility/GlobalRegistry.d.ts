import { INodeTypesRegistry } from '../ContentRepository/NodeTypesRegistry';
export interface IGlobalRegistry {
    get(key: string): {
        get: <T>(key: string) => T;
        getAllAsList: <T>() => T[];
    } | undefined;
    get(key: '@neos-project/neos-ui-contentrepository'): INodeTypesRegistry;
}
export declare function useGlobalRegistry(): null | IGlobalRegistry;
