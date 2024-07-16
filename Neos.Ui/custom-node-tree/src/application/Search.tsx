import * as React from 'react';
import {useDebounce} from 'react-use';

import {useNodeTypesRegistry} from '@sitegeist/archaeopteryx-neos-bridge';

import {INodeTreeState, NodeTreeDispatch, searchForNodesInNodeTree} from '../domain';
import {SearchInput} from '../presentation';

interface Props {
    state: INodeTreeState
    dispatch: NodeTreeDispatch
    initialValue: string
}

export const Search: React.FC<Props> = props => {
    const componentWasInitializedRef = React.useRef(false);
    const valueWasClearedRef = React.useRef(false);
    const nodeTypesRegistry = useNodeTypesRegistry();
    const [value, setValue] = React.useState(props.initialValue);
    const handleClear = React.useCallback(() => {
        setValue('');
        if (nodeTypesRegistry) {
            searchForNodesInNodeTree(
                {state: props.state, dispatch: props.dispatch},
                nodeTypesRegistry,
                null
            );
        }
        valueWasClearedRef.current = true;
    }, [setValue, nodeTypesRegistry]);

    useDebounce(() => {
        if (componentWasInitializedRef.current && !valueWasClearedRef.current) {
            searchForNodesInNodeTree(
                {state: props.state, dispatch: props.dispatch},
                nodeTypesRegistry,
                value || null
            );
        } else {
            componentWasInitializedRef.current = true;
            valueWasClearedRef.current = false;
        }
    }, 300, [value, nodeTypesRegistry]);

    return (
        <SearchInput
            value={value}
            onChange={setValue}
            onClear={handleClear}
        />
    );
}