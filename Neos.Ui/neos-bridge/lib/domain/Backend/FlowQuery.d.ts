import { INode, INodePartialForTree } from '../ContentRepository/Node';
import { ContextPath } from "../ContentRepository/ContextPath";
import { NodeTypeName } from '../ContentRepository/NodeType';
export declare class FlowQuery {
    private q;
    constructor(q: any);
    find(selector: string): this;
    children(selector: string): this;
    neosUiDefaultNodes(baseNodeType: NodeTypeName, loadingDepth: number, toggledNodes: ContextPath[], clipboardNodesContextPaths: ContextPath[]): this;
    search(searchTerm?: string, nodeTypeFilter?: NodeTypeName): this;
    get(): Promise<INode[]>;
    getForTree(): Promise<INodePartialForTree[]>;
    getForTreeWithParents(): Promise<INodePartialForTree[]>;
}
