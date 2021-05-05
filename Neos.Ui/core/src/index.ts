export {registerLinkTypes, registerModal} from './application';

export type {IEditor} from './domain';
export {
    LinkType,
    useLinkTypeForHref,
    createEditor,
    EditorContext,
    useEditorState,
    useEditorValue,
    useEditorTransactions
} from './domain';