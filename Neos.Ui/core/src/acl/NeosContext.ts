import * as React from 'react';

interface NeosContextProperties {
}

export const NeosContext = React.createContext<null | NeosContextProperties>(null);

export function useNeos() {
    return React.useContext(NeosContext);
}