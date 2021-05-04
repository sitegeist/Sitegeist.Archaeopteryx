import * as React from 'react';
import { IConfiguration } from './Configuration';
import { IGlobalRegistry } from './GlobalRegistry';
import { IRoutes } from './Routes';
import { IStore } from './Store';
export interface INeosContextProperties {
    globalRegistry: IGlobalRegistry;
    store: IStore;
    configuration: IConfiguration;
    routes?: IRoutes;
}
export declare const NeosContext: React.Context<INeosContextProperties | null>;
export declare function useNeos(): INeosContextProperties | null;
