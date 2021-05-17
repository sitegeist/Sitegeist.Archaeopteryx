import * as React from 'react';
import styled from 'styled-components';

import {Button, Icon} from '@neos-project/react-ui-components';

import {useI18n} from '@sitegeist/archaeopteryx-neos-bridge';
import {ILinkType, useLinkTypeForHref, useEditorTransactions, Deletable} from '@sitegeist/archaeopteryx-core';
import {ErrorBoundary, decodeError} from '@sitegeist/archaeopteryx-error-handling';

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
    options: {
        linkTypes?: Record<string, unknown>
    }
    helpMessage: string
    helpThumbnail: string
    highlight: boolean
    identifier: string
    value: any
    hooks: null | any
    commit: (value: any) => void
}

export const InspectorEditor: React.FC<Props> = props => {
    const i18n = useI18n();
    const tx = useEditorTransactions();
    const value = typeof props.value === 'string' ? (props.value || undefined) : undefined;
    const linkType = useLinkTypeForHref(value ?? null);

    const editLink = React.useCallback(async () => {
        const result = await tx.editLink(
            value === undefined ? null : {href: value},
            [],
            props.options ?? {}
        );


        if (result.change) {
            props.commit(result.value?.href ?? '');
        }
    }, [value, tx.editLink, props.options, props.commit]);

    if (linkType) {
        return (
            <ErrorBoundary>
                <InspectorEditorWithLinkType
                    key={linkType.id}
                    value={value!}
                    linkType={linkType}
                    options={props.options?.linkTypes?.[linkType.id] ?? {}}
                    editLink={editLink}
                    commit={props.commit}
                />
            </ErrorBoundary>
        );
    } else if (Boolean(value) === false) {
        return (
            <Button onClick={editLink}>
                <Icon icon="plus"/>
                &nbsp;&nbsp;&nbsp;&nbsp;
                {i18n('Sitegeist.Archaeopteryx:Main:inspector.create')}
            </Button>
        );
    } else {
        return (
            <div>
                {i18n('Sitegeist.Archaeopteryx:Main:inspector.notfound', undefined, {
                    href: JSON.stringify(value)
                })}
                <br/>
                <br/>
                <Button onClick={editLink}>
                    <Icon icon="plus"/>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {i18n('Sitegeist.Archaeopteryx:Main:inspector.create')}
                </Button>
            </div>
        );
    }
};

const SeamlessButton = styled.button`
    display: block;
    border: none;
    margin: 0;
    padding: 0;
    width: 100%;
    overflow: visible;
    background: transparent;
    color: inherit;
    font: inherit;
    line-height: normal;
    -webkit-font-smoothing: inherit;
    -moz-osx-font-smoothing: inherit;
    -webkit-appearance: none;
    cursor: pointer;
    filter: brightness(1);
    transition: filter .2s;

    &:hover {
        filter: brightness(2) drop-shadow(0 0 1px #aaa);
    }

    &::-moz-focus-inner {
        border: 0;
        padding: 0;
    }
`;

const InspectorEditorWithLinkType: React.FC<{
    value: string
    linkType: ILinkType
    options: any
    editLink: () => Promise<void>
    commit: (value: any) => void
}> = props => {
    const i18n = useI18n();
    const link = {href: props.value};
    const {busy, error, result: model} = props.linkType.useResolvedModel(link);
    const {Preview, LoadingPreview} = props.linkType;

    if (error) {
        throw decodeError(error);
    }

    return (
        <Deletable onDelete={() => props.commit('')}>
            <SeamlessButton
                title={i18n('Sitegeist.Archaeopteryx:Main:inspector.edit')}
                type="button"
                onClick={props.editLink}
            >
                {busy ? (
                    <LoadingPreview
                        link={link}
                        options={props.options}
                    />
                ) : (
                    <Preview
                        model={model}
                        link={link}
                        options={props.options}
                    />
                )}
            </SeamlessButton>
        </Deletable>
    );
};