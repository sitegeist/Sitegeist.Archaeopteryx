import {NodeTypeName} from '../ContentRepository/NodeType';
import {useNeos} from './NeosContext';

export interface IConfiguration {
    nodeTree?: {
        loadingDepth?: number
        presets?: {
            default?: {
                baseNodeType?: NodeTypeName
            }
        }
    }
}

export function useConfiguration(): undefined | IConfiguration;
export function useConfiguration<R>(
    selector: (configuration: IConfiguration) => R
): undefined | R;
export function useConfiguration<R>(selector?: (configuration: IConfiguration) => R): undefined | R {
    const neos = useNeos();

    if (neos) {
        if (selector) {
            return selector(neos.configuration);
        } else {
            return neos.configuration as R;
        }
    }
}