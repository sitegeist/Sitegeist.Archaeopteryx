import * as React from 'react';

import {Button} from '@neos-project/react-ui-components';

import {LinkType, useLinkTypeForHref, useEditorTransactions} from '@sitegeist/archaeopteryx-core';

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
    const tx = useEditorTransactions();
    const value = typeof props.value === 'string' ? (props.value || undefined) : undefined;
    const linkType = useLinkTypeForHref(value ?? null);

    const editLink = React.useCallback(async () => {
        const result = await tx.editLink(value === undefined ? null : {href: value});
        if (result.change) {
            props.commit(result.value?.href);
        }
    }, [value, tx.editLink]);

    if (linkType) {
        return (
            <InspectorEditorWithLinkType
                value={value}
                linkType={linkType}
                editLink={editLink}
            />
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

const InspectorEditorWithLinkType: React.FC<{
    value: undefined | string,
    linkType: LinkType,
    editLink: () => Promise<void>
}> = props => {
    const link = props.value === undefined ? undefined : {href: props.value};
    const {busy, error, result: linkTypeProps} = props.linkType.useResolvedProps(link);
    const {getPreview: Preview, getLoadingPreview: LoadingPreview} = props.linkType;

    if (error) {
        throw error;
    }

    return (
        <div>
            {busy ? (
                <LoadingPreview link={link}/>
            ) : (
                <Preview {...linkTypeProps}/>
            )}
            <Button onClick={props.editLink}>
                Edit Link
            </Button>
        </div>
    );
};