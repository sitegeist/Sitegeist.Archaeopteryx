import {INode, INodePartialForTree} from '../ContentRepository/Node';
import {ContextPath} from "../ContentRepository/ContextPath";
import {NodeTypeName} from '../ContentRepository/NodeType';

export class FlowQuery {
    constructor(private q : any) {}

    public find(selector: string): this {
        this.q = this.q.find(selector);
        return this;
    }

    public children(selector: string): this {
        this.q = this.q.children(selector);
        return this;
    }

    public neosUiDefaultNodes(
        baseNodeType: NodeTypeName,
        loadingDepth: number,
        toggledNodes: ContextPath[],
        clipboardNodesContextPaths: ContextPath[]
    ): this {
        this.q = this.q.neosUiDefaultNodes(
            baseNodeType,
            loadingDepth,
            toggledNodes.map(cp => cp.toString()),
            clipboardNodesContextPaths.map(cp => cp.toString())
        );
        return this;
    }

    public search(searchTerm?: string, nodeTypeFilter?: NodeTypeName): this {
        this.q = this.q.search(searchTerm, nodeTypeFilter);
        return this;
    }

    public async get(): Promise<INode[]> {
        return this.q.get().then((nodes: any[]) => {
            return nodes.map(node => ({
                ...node,
                contextPath: ContextPath.fromString(node.contextPath)
            })).filter(node => node.contextPath);
        });
    }

    public async getForTree(): Promise<INodePartialForTree[]> {
        return this.q.getForTree().then((nodes: any[]) => {
            return nodes.map(node => ({
                ...node,
                contextPath: ContextPath.fromString(node.contextPath)
            })).filter(node => node.contextPath);
        });
    }

    public async getForTreeWithParents(): Promise<INodePartialForTree[]> {
        return this.q.getForTreeWithParents().then((nodes: any[]) => {
            return nodes.map(node => ({
                ...node,
                contextPath: ContextPath.fromString(node.contextPath)
            })).filter(node => node.contextPath);
        });
    }
}