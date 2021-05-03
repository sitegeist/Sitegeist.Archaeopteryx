import * as React from 'react';
import { INodePartialForTree } from '@sitegeist/archaeopteryx-neos-bridge';
interface Props {
    selected: null | INodePartialForTree;
    onSelect: (node: INodePartialForTree) => void;
}
export declare const NodeTreeAdapter: React.FC<Props>;
export {};
