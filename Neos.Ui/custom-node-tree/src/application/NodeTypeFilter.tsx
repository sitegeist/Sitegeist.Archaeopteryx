import * as React from 'react';

import {INodeType, useNodeTypesRegistry, useConfiguration, NodeTypeName, useI18n} from '@sitegeist/archaeopteryx-neos-bridge';
import {SelectBox} from '@neos-project/react-ui-components';

import {INodeTreeState, NodeTreeDispatch, filterNodesByNodeTypeInNodeTree} from '../domain';

const searchOptions = (searchTerm: string, processedSelectBoxOptions: { label:string }[]) =>
    processedSelectBoxOptions.filter(
        option => true
            && option.label
            && option.label.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
    );

interface Props {
    state: INodeTreeState
    dispatch: NodeTreeDispatch
    initialValue: string
}

export const NodeTypeFilter: React.FC<Props> = props => {
    const i18n = useI18n();
    const presets = useConfiguration(c => c.nodeTree?.presets) ?? {};
    const nodeTypesRegistry = useNodeTypesRegistry();
    const [filterTerm, setFilterTerm] = React.useState('');
    const [value, setValue] = React.useState(props.initialValue);
    const options = React.useMemo(() => {
        let options = Object.keys(presets)
            .filter(presetName => (presetName !== 'default'))
            .map(presetName => ({
                value: presets[presetName].baseNodeType,
                label: presets[presetName].ui?.label
                    ? i18n(presets[presetName].ui!.label!)
                    : '[' + presetName + ']',
                icon: presets[presetName].ui?.icon
            }));

        if (options.length === 0 && nodeTypesRegistry) {
            const documentNodeTypes = nodeTypesRegistry
                .getSubTypesOf(nodeTypesRegistry.getRole('document'))
                .map(nodeTypeName => nodeTypesRegistry.get(nodeTypeName))
                .filter(Boolean) as INodeType[];

            options = documentNodeTypes.map(nodeType => ({
                value: nodeType.name,
                label: i18n(nodeType.label),
                icon: nodeType.ui?.icon
            }));
        }

        return options;
    }, [presets, nodeTypesRegistry]);

    React.useEffect(() => {
        filterNodesByNodeTypeInNodeTree(
            {state: props.state, dispatch: props.dispatch},
            nodeTypesRegistry,
            value ? NodeTypeName(value) : null
        );
    }, [value, nodeTypesRegistry]);

    return (
        <SelectBox
            placeholder={i18n('Neos.Neos:Main:filter')}
            placeholderIcon={'filter'}
            onValueChange={setValue}
            allowEmpty={true}
            value={value}
            options={searchOptions(filterTerm, options)}
            displaySearchBox={true}
            searchTerm={filterTerm}
            onSearchTermChange={setFilterTerm}
            threshold={0}
            noMatchesFoundLabel={i18n('Neos.Neos:Main:noMatchesFound')}
            searchBoxLeftToTypeLabel={i18n('Neos.Neos:Main:searchBoxLeftToType')}
        />
    );
}