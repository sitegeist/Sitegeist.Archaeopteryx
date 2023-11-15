import * as React from 'react';
import styled from 'styled-components';
import {Button, Icon} from '@neos-project/react-ui-components';
import {INodeType, useI18n} from '@sitegeist/archaeopteryx-neos-bridge';
import {ILinkType, useLinkTypeForHref, useEditorTransactions, Deletable} from '@sitegeist/archaeopteryx-core';
import {ErrorBoundary, decodeError} from '@sitegeist/archaeopteryx-error-handling';
import {ILink} from '@sitegeist/archaeopteryx-core/lib/domain';
import {useNodeType} from '@sitegeist/archaeopteryx-neos-bridge';
import {useCurrentlyFocusedNode} from '@sitegeist/archaeopteryx-neos-bridge/lib/domain/ContentRepository/Node';
import {EditorProps} from './EditorProps';
import {ILinkOptions} from '@sitegeist/archaeopteryx-core/lib/domain';

/**
 * Translates to php's {@see \Sitegeist\Archaeopteryx\Link}
 */
type LinkValueObject = {
    href: string;
    title?: string;
    target?: string;
    rel: string[];
};

enum LinkDataType {
    string,
    valueObject
}

/**
 * These are the possible formats from {@see LinkDataType} to store the link in the Node.
 *  The string is the default
 *  The valueObject is on php side this vo: {@see \Sitegeist\Archaeopteryx\Link}
 */
type SerializeableLink = {
    dataType: LinkDataType.valueObject,
    value: LinkValueObject | null
} | {
    dataType: LinkDataType.string,
    value: string | null
}

/**
 * Determine based on the property type of the schema how to interpret the property value
 */
const resolveCurrentSerializedLink = (value: any, propertyName: string, nodeType: INodeType): SerializeableLink => {
    const linkDataType = nodeType.properties?.[propertyName]?.type === "Sitegeist\\Archaeopteryx\\Link"
        ? LinkDataType.valueObject
        : LinkDataType.string;

    if (linkDataType === LinkDataType.valueObject) {
        // @ts-ignore
        const linkArray = (typeof value === "object" && value !== null && "href" in value && typeof value.href === "string") ? value as LinkValueObject : null;
        return {
            dataType: linkDataType,
            value: linkArray
        }
    }
    return {
        dataType: linkDataType,
        value: value || null
    }
}

/**
 * Convert the {@see SerializeableLink} to the editor representation.
 * For example the anchor field is in the value object encoded into the href, but for editing treated separately.
 *
 * Counterpart of {@see convertILinkToSerializedLinkValue}
 */
const serializedLinkToILink = (serializedLink: SerializeableLink): ILink | null => {
    if (serializedLink.value === null) {
        return null;
    }
    switch (serializedLink.dataType) {
        case LinkDataType.valueObject:
            // downcastFromLinkValueObject
            const linkValueObject = serializedLink.value;

            const [baseHref, hash] = linkValueObject.href.split('#', 2);

            return {
                href: baseHref,
                options: {
                    anchor: hash || undefined,
                    title: linkValueObject.title || undefined,
                    targetBlank: linkValueObject.target ? linkValueObject.target === '_blank' : undefined,
                    relNofollow: linkValueObject.rel.includes('nofollow'),
                }
            };
        case LinkDataType.string:
            return {
                href: serializedLink.value
            };
    }
}

/**
 * Convert the editor representation of the link to the {@see SerializeableLink.value}
 * For example the anchor field is for editing treated separately but in the value object encoded into the href.
 *
 * Counterpart of {@see serializedLinkToILink}
 */
const convertILinkToSerializedLinkValue = (link: ILink, dataType: LinkDataType): any => {
    switch (dataType) {
        case LinkDataType.valueObject:
            // upcastToLinkValueObject
            const href = link.options?.anchor
                ? `${link.href}#${link.options.anchor}`
                : link.href;

            return {
                href: href.toString(),
                title: link.options?.title,
                target: link.options?.targetBlank ? '_blank' : undefined,
                rel: link.options?.relNofollow ? ['nofollow'] : [],
            };
        case LinkDataType.string:
            return link.href;
    }
}

export const InspectorEditor: React.FC<EditorProps<any, any>> = props => {

    const reset = () => props.commit('');

    const nodeType = useNodeType(
        useCurrentlyFocusedNode()!.nodeType
    )!;

    const i18n = useI18n();
    const tx = useEditorTransactions();

    const serializedLink = resolveCurrentSerializedLink(props.value, props.identifier, nodeType);

    const linkType = useLinkTypeForHref(
        (serializedLink.dataType === LinkDataType.valueObject ? serializedLink.value?.href : serializedLink.value) ?? null
    );

    const editLink = React.useCallback(async () => {
        const enabledLinkOptions = (() => {
            const enabledLinkOptions: (keyof ILinkOptions)[] = [];

            if (serializedLink.dataType === LinkDataType.string) {
                // the simple type doesn't allow any options, as they cannot be encoded.
                return enabledLinkOptions;
            }

            if (props.options?.anchor) {
                enabledLinkOptions.push('anchor');
            }

            if (props.options?.title) {
                enabledLinkOptions.push('title');
            }

            if (props.options?.relNofollow) {
                enabledLinkOptions.push('relNofollow');
            }

            if (props.options?.targetBlank) {
                enabledLinkOptions.push('targetBlank');
            }

            return enabledLinkOptions;
        })();

        const result = await tx.editLink(
            serializedLinkToILink(serializedLink),
            enabledLinkOptions,
            props.options ?? {}
        );

        if (result.change) {
            if (!result.value) {
                reset();
                return;
            }

            props.commit(
                convertILinkToSerializedLinkValue(result.value, serializedLink.dataType)
            );
        }
    }, [serializedLink, tx.editLink, props.options, props.commit, reset]);

    if (linkType) {
        return (
            <ErrorBoundary>
                <InspectorEditorWithLinkType
                    key={linkType.id}
                    link={serializedLinkToILink(serializedLink)!}
                    linkType={linkType}
                    options={props.options?.linkTypes?.[linkType.id] ?? {}}
                    editLink={editLink}
                    reset={reset}
                />
            </ErrorBoundary>
        );
    } else if (serializedLink.value === null) {
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
                    href: JSON.stringify(serializedLink.value)
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
    link: ILink
    linkType: ILinkType
    options: any
    editLink: () => Promise<void>
    reset: () => void
}> = props => {
    const i18n = useI18n();
    const {busy, error, result: model} = props.linkType.useResolvedModel(props.link);
    const {Preview, LoadingPreview} = props.linkType;

    if (error) {
        throw decodeError(error);
    }

    return (
        <Deletable onDelete={props.reset}>
            <SeamlessButton
                title={i18n('Sitegeist.Archaeopteryx:Main:inspector.edit')}
                type="button"
                onClick={props.editLink}
            >
                {busy ? (
                    <LoadingPreview
                        link={props.link}
                        options={props.options}
                    />
                ) : (
                    <Preview
                        model={model}
                        link={props.link}
                        options={props.options}
                    />
                )}
            </SeamlessButton>
        </Deletable>
    );
};
