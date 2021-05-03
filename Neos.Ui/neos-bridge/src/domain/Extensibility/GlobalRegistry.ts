import {INodeTypesRegistry} from '../ContentRepository/NodeTypesRegistry';
import {useNeos} from './NeosContext';

export interface IGlobalRegistry {
    get(key: string): {
        get: <T>(key: string) => T
        getAllAsList: <T>() => T[]
    } | undefined
    get(key: '@neos-project/neos-ui-contentrepository'): INodeTypesRegistry
}

export function useGlobalRegistry(): null | IGlobalRegistry {
    const neos = useNeos();
    return neos?.globalRegistry ?? null;
}