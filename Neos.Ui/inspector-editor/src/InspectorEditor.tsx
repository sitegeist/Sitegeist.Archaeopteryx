import * as React from 'react';

import {useLinkTypeForUri} from '@sitegeist/archaeopteryx-core';

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
    const value = typeof props.value === 'string' ? props.value : '';
    const linkType = useLinkTypeForUri(value || 'http://example.com');

    if (linkType) {
        const {Preview} = linkType;

        return (
            <Preview uri={value}/>
        );
    }

    return (
        <div>No Editor for {value}</div>
    );
};