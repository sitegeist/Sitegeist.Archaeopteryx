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
    }
    executeCommand: (command: string, argument?: any, reFocusEditor?: boolean) => void
}

export const LinkButton: React.FC<Props> = props => {
    const tx = useEditorTransactions();
    const handleLinkButtonClick = React.useCallback(async () => {
        const result = await tx.editLink(props.formattingUnderCursor.link ?? null);
        if (result.change) {
            if (result.value === null) {
                props.executeCommand('unlink');
            } else {
                props.executeCommand('link', result.value, false);
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