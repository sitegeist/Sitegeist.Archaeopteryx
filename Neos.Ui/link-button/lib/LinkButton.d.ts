import * as React from 'react';
interface Props {
    inlineEditorOptions?: {
        linking?: {
            anchor?: boolean;
            title?: boolean;
            relNofollow?: boolean;
            targetBlank?: boolean;
            startingPoint?: string;
        };
    };
    formattingUnderCursor: {
        link?: string;
        linkTitle?: string;
        linkTargetBlank?: boolean;
        linkRelNofollow?: boolean;
    };
    executeCommand: (command: string, argument?: any, reFocusEditor?: boolean) => void;
}
export declare const LinkButton: React.FC<Props>;
export {};
