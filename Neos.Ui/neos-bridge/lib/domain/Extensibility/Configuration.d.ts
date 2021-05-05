import { NodeTypeName } from '../ContentRepository/NodeType';
export interface IConfiguration {
    nodeTree?: {
        loadingDepth?: number;
        presets?: {
            [key: string]: {
                baseNodeType?: NodeTypeName;
                ui?: {
                    label?: string;
                    icon?: string;
                };
            };
        };
    };
}
export declare function useConfiguration(): undefined | IConfiguration;
export declare function useConfiguration<R>(selector: (configuration: IConfiguration) => R): undefined | R;
