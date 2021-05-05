import * as React from 'react';
import { INodeTreeState, NodeTreeDispatch } from '../domain';
interface Props {
    state: INodeTreeState;
    dispatch: NodeTreeDispatch;
    initialValue: string;
}
export declare const Search: React.FC<Props>;
export {};
