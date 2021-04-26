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
    commit: (value: any) => void
}

export const InspectorEditor: React.FC<Props> = props => {
    const tx = useEditorTransaction();
    const value = typeof props.value === 'string' ? props.value : '';
    const linkType = useLinkTypeForUri(value);

    const editLink = React.useCallback(async () => {
        console.log({ value });
        const result = await tx.editLink(value);
        if (result.change) {
            props.commit(result.value);
        }
    }, [value, tx.editLink]);

    if (linkType) {
        const {getPreview: Preview} = linkType;
        const link = {uri: value};

        return (
            <div>
                <Preview link={link}/>
                <Button onClick={editLink}>
                    Edit Link
                </Button>
            </div>
        );
    } else if (Boolean(value) === false) {
        return (
            <Button onClick={editLink}>
                Create Link
            </Button>
        );
    } else {
        return (
            <div>No Editor found for {JSON.stringify(props.value)}</div>
        );
    }
};