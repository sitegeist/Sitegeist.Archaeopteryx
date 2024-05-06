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
}
