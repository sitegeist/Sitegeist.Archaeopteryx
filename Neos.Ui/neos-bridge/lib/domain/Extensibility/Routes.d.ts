export interface IRoutes {
    core?: {
        modules?: {
            mediaBrowser?: string;
        };
    };
}
export declare function useRoutes(): undefined | IRoutes;
export declare function useRoutes<R>(selector: (configuration: IRoutes) => R): undefined | R;
