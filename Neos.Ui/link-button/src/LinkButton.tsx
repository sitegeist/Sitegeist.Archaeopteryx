import * as React from 'react';

import {IconButton} from '@neos-project/react-ui-components';

import {useEditorTransactions} from '@sitegeist/archaeopteryx-core';
import {useI18n} from '@sitegeist/archaeopteryx-neos-bridge';

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
    const i18n = useI18n();
    const tx = useEditorTransactions();
    const handleLinkButtonClick = React.useCallback(async () => {
        const link = (() => {
            if (props.formattingUnderCursor.link) {
                const [href, anchor] = props.formattingUnderCursor.link.split('#');
                return {
                    href,
                    options: {
                        anchor,
                        title: props.formattingUnderCursor.linkTitle,
                        targetBlank: props.formattingUnderCursor.linkTargetBlank,
                        relNoFollow: props.formattingUnderCursor.linkRelNofollow
                    }
                };
            }

            return null;
        })();

        const result = await tx.editLink(link, true);

        if (result.change) {
            if (result.value === null) {
                props.executeCommand('linkTitle', false, false);
                props.executeCommand('linkRelNofollow', false, false);
                props.executeCommand('linkTargetBlank', false, false);
                props.executeCommand('unlink', undefined, true);
            } else {
                props.executeCommand('linkTitle', result.value.options?.title || false, false);
                props.executeCommand('linkTargetBlank', result.value.options?.targetBlank ?? false, false);
                props.executeCommand('linkRelNofollow', result.value.options?.relNoFollow ?? false, false);

                if (result.value.options?.anchor) {
                    props.executeCommand('link', `${result.value.href}#${result.value.options?.anchor}`, true);
                } else {
                    props.executeCommand('link', result.value.href, true);
                }
            }
        } else {
            props.executeCommand('undo', undefined, true);
            props.executeCommand('redo', undefined, true);
        }
    }, [props.executeCommand, props.formattingUnderCursor.link, tx]);

    return (
        <IconButton
            title={i18n('Sitegeist.Archaeopteryx:Main:linkButton.title')}
            isActive={Boolean(props.formattingUnderCursor.link)}
            icon={Boolean(props.formattingUnderCursor.link) ? 'unlink' : 'link'}
            onClick={handleLinkButtonClick}
        />
    );
};