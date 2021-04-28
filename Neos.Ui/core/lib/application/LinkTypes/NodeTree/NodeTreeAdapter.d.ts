import * as React from 'react';
export interface INode {
    identifier: string;
    contextPath: string;
    nodeType: string;
    label: string;
    depth: number;
    children: {
        contextPath: string;
        nodeType: string;
    }[];
    properties: {
        _hidden: boolean;
        _hiddenInIndex: boolean;
    };
}
interface Props {
    selected: null | INode;
    onSelect: (node: INode) => void;
}
export declare const NodeTreeAdapter: React.FC<Props>;
export {};
