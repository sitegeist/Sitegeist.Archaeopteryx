import {INodeTypesRegistry} from '../ContentRepository/NodeTypesRegistry';
import {useNeos} from './NeosContext';

export interface IGlobalRegistry {
    get(key: string): {
        get: <T>(key: string) => T
        getAllAsList: <T>() => T[]
        set(key: string, value: any): void
    } | undefined
    get(key: '@neos-project/neos-ui-contentrepository'): INodeTypesRegistry
    set(key: string, value: any): void
}

export function useGlobalRegistry(): IGlobalRegistry {
    const neos = useNeos();
    return neos.globalRegistry;
}