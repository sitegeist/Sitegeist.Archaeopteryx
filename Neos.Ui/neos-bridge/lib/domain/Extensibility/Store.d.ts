export interface IState {
    cr?: {
        nodes?: {
            siteNode?: string;
            documentNode?: string;
        };
    };
}
export interface IStore {
    getState(): IState;
    subscribe(listener: () => void): () => void;
}
export declare function useSelector<R>(selector: (state: IState) => R): null | R;
