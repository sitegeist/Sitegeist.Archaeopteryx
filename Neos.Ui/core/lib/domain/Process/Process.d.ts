import { AsyncState } from 'react-use/lib/useAsync';
export declare type IProcess<R> = {
    busy: true;
    error: null;
    result: null;
} | {
    busy: false;
    error: Error;
    result: null;
} | {
    busy: false;
    error: null;
    result: R;
};
export declare function busy(): IProcess<any>;
export declare function error(error: Error): IProcess<any>;
export declare function success<R>(result: R): IProcess<R>;
export declare function fromAsyncState<R>(asyncState: AsyncState<R>): IProcess<R>;
