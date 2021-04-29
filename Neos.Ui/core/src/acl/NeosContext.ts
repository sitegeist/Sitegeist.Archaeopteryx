import * as React from 'react';

interface NeosContextProperties {
    globalRegistry: {
        get(key: string): {
            get: <T>(key: string) => T
            getAllAsList: <T>() => T[]
        } | undefined
        get(key: '@neos-project/neos-ui-contentrepository'): {
            get: (key: string) => undefined | INodeType
            getAllAsList: () => INodeType[]
            isOfType: (name: string, reference: string) => boolean
            getSubTypesOf: (name: string) => string[]
        }
    }
    store: {
        getState: () => {
            cr?: {
                nodes?: {
                    siteNode?: string
                    documentNode?: string
                }
            }
        }
    }
    configuration: {
        nodeTree?: {
            loadingDepth?: number
            presets?: {
                default?: {
                    baseNodeType?: string
                }
            }
        }
    }
    routes?: {
        core?: {
            modules?: {
                mediaBrowser?: string
            }
        }
    }
}

export interface INodeType {
    name: string
    label: string
    ui?: {
        icon?: string
    }
}

export const NeosContext = React.createContext<null | NeosContextProperties>(null);

export function useNeos() {
    return React.useContext(NeosContext);
}