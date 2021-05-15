import * as React from 'react';

import {Button} from '@neos-project/react-ui-components';

import {useI18n} from '@sitegeist/archaeopteryx-neos-bridge';
import {ILinkType, useLinkTypeForHref, useEditorTransactions, Deletable} from '@sitegeist/archaeopteryx-core';

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
            <InspectorEditorWithLinkType
                value={value!}
                linkType={linkType}
                options={props.options?.linkTypes?.[linkType.id] ?? {}}
                editLink={editLink}
                commit={props.commit}
            />
        );
    } else if (Boolean(value) === false) {
        return (
            <Button onClick={editLink}>
                {i18n('Sitegeist.Archaeopteryx:Main:inspector.create')}
            </Button>
        );
    } else {
        return (
            <div>
                {i18n('Sitegeist.Archaeopteryx:Main:inspector.notfound', undefined, {
                    href: JSON.stringify(value)
                })}
            </div>
        );
    }
};

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
        throw error;
    }

    return (
        <div>
            {busy ? (
                <LoadingPreview
                    link={link}
                    options={props.options}
                />
            ) : (
                <Deletable onDelete={() => props.commit('')}>
                    <Preview
                        model={model}
                        link={link}
                        options={props.options}
                    />
                </Deletable>
            )}
            <Button onClick={props.editLink}>
                {i18n('Sitegeist.Archaeopteryx:Main:inspector.edit')}
            </Button>
        </div>
    );
};