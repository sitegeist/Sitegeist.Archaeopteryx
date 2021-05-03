import * as React from 'react';
import { IConfiguration } from './Configuration';
import { IGlobalRegistry } from './GlobalRegistry';
import { IRoutes } from './Routes';
import { IStore } from './Store';
interface NeosContextProperties {
    globalRegistry: IGlobalRegistry;
    store: IStore;
    configuration: IConfiguration;
    routes?: IRoutes;
}
export declare const NeosContext: React.Context<NeosContextProperties | null>;
export declare function useNeos(): NeosContextProperties | null;
export {};
