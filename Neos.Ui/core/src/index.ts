export {registerLinkTypes, registerDialog} from './application';

export type {IEditor, ILinkType} from './domain';
export {
    makeLinkType,
    useLinkTypeForHref,
    createEditor,
    EditorContext,
    useEditorState,
    useEditorValue,
    useEditorTransactions
} from './domain';