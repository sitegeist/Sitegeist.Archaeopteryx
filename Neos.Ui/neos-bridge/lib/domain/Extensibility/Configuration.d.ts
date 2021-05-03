import { NodeTypeName } from '../ContentRepository/NodeType';
export interface IConfiguration {
    nodeTree?: {
        loadingDepth?: number;
        presets?: {
            default?: {
                baseNodeType?: NodeTypeName;
            };
        };
    };
}
export declare function useConfiguration(): undefined | IConfiguration;
export declare function useConfiguration<R>(selector: (configuration: IConfiguration) => R): undefined | R;
