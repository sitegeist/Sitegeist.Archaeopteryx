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
}

interface INodeType {
    ui?: {
        icon?: string
    }
}

export const NeosContext = React.createContext<null | NeosContextProperties>(null);

export function useNeos() {
    return React.useContext(NeosContext);
}