import * as React from 'react';
import { INodePartialForTree, NodeTypeName, ContextPath } from '@sitegeist/archaeopteryx-neos-bridge';
interface Props {
    configuration: {
        rootNodeContextPath: ContextPath;
        baseNodeTypeName: NodeTypeName;
        loadingDepth: number;
        documentNodeContextPath: ContextPath;
        selectedNodeContextPath?: ContextPath;
    };
    options?: {
        enableSearch?: boolean;
        enableNodeTypeFilter?: boolean;
    };
    onSelect(node: INodePartialForTree): void;
}
export declare const NodeTree: React.FC<Props>;
export {};
