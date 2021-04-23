import * as React from 'react';

interface NeosContextProperties {
    globalRegistry: {
        get: (key: string) => {
            get: <T>(key: string) => T
            getAllAsList: <T>() => T[]
        } | undefined
    }
}

export const NeosContext = React.createContext<null | NeosContextProperties>(null);

export function useNeos() {
    return React.useContext(NeosContext);
}