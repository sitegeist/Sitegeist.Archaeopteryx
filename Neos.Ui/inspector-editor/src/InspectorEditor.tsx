import * as React from 'react';

import {Button} from '@neos-project/react-ui-components';

import {useLinkTypeForUri, useEditorTransaction} from '@sitegeist/archaeopteryx-core';

interface Props {
    neos: unknown
    nodeTypesRegistry: unknown
    validatorRegistry: unknown
    editorRegistry: unknown
    i18nRegistry: unknown
    className: unknown

    id: string
    label: string
    editor: string
    options: any
    helpMessage: string
    helpThumbnail: string
    highlight: boolean
    identifier: string
    value: any
    hooks: null | any
}

export const InspectorEditor: React.FC<Props> = props => {
    const {editLink} = useEditorTransaction();
    const value = typeof props.value === 'string' ? props.value : '';
    const linkType = useLinkTypeForUri(value);

    if (linkType) {
        const {getPreview: Preview} = linkType;
        const link = {uri: value};

        return (
            <Preview link={link}/>
        );
    } else if (Boolean(value) === false) {
        return (
            <Button onClick={() => editLink(null)}>
                Create Link
            </Button>
        );
    } else {
        return (
            <div>No Editor for {JSON.stringify(props.value)}</div>
        );
    }
};