import * as React from 'react';
interface Props {
    neos: unknown;
    nodeTypesRegistry: unknown;
    validatorRegistry: unknown;
    editorRegistry: unknown;
    i18nRegistry: unknown;
    className: unknown;
    id: string;
    label: string;
    editor: string;
    options: any;
    helpMessage: string;
    helpThumbnail: string;
    highlight: boolean;
    identifier: string;
    value: any;
    hooks: null | any;
}
export declare const InspectorEditor: React.FC<Props>;
export {};
