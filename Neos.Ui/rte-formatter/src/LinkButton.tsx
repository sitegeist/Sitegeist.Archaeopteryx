import * as React from 'react';

import {IconButton} from '@neos-project/react-ui-components';

import {useEditorTransactions} from '@sitegeist/archaeopteryx-core';

interface Props {
    inlineEditorOptions?: {
        linking?: {
            anchor?: boolean
            title?: boolean
            relNofollow?: boolean
            targetBlank?: boolean
            startingPoint?: string
        }
    }
    formattingUnderCursor: {
        link?: string
        linkTitle?: string
        linkTargetBlank?: boolean
        linkRelNofollow?: boolean,
    }
    executeCommand: (command: string, argument?: any, reFocusEditor?: boolean) => void
}

export const LinkButton: React.FC<Props> = props => {
    const tx = useEditorTransactions();
    const handleLinkButtonClick = React.useCallback(async () => {
        if (props.formattingUnderCursor.link) {
            const [href, anchor] = props.formattingUnderCursor.link.split('#');
            const result = await tx.editLink({
                href,
                options: {
                    anchor,
                    title: props.formattingUnderCursor.linkTitle,
                    targetBlank: props.formattingUnderCursor.linkTargetBlank,
                    relNoFollow: props.formattingUnderCursor.linkRelNofollow
                }
            });

            if (result.change) {
                if (result.value === null) {
                    props.executeCommand('linkTitle', false, false);
                    props.executeCommand('linkRelNofollow', false, false);
                    props.executeCommand('linkTargetBlank', false, false);
                    props.executeCommand('unlink');
                } else {
                    props.executeCommand('linkTitle', result.value.options?.title || false, false);
                    props.executeCommand('linkTargetBlank', result.value.options?.targetBlank ?? false, false);
                    props.executeCommand('linkRelNofollow', result.value.options?.relNoFollow ?? false, false);

                    if (result.value.options?.anchor) {
                        props.executeCommand('link', `${result.value.href}#${result.value.options?.anchor}`, false);
                    } else {
                        props.executeCommand('link', result.value.href, false);
                    }
                }
            }
        }
    }, [props.executeCommand, props.formattingUnderCursor.link, tx]);

    return (
        <IconButton
            title={'Link'}
            isActive={Boolean(props.formattingUnderCursor.link)}
            icon={Boolean(props.formattingUnderCursor.link) ? 'unlink' : 'link'}
            onClick={handleLinkButtonClick}
        />
    );
};