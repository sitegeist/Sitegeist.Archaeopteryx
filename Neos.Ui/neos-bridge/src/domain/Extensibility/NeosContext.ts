import * as React from 'react';

import {IConfiguration} from './Configuration';
import {IGlobalRegistry} from './GlobalRegistry';
import {IRoutes} from './Routes';
import {IStore} from './Store';

interface NeosContextProperties {
    globalRegistry: IGlobalRegistry
    store: IStore
    configuration: IConfiguration
    routes?: IRoutes
}

export const NeosContext = React.createContext<null | NeosContextProperties>(null);

export function useNeos() {
    return React.useContext(NeosContext);
}