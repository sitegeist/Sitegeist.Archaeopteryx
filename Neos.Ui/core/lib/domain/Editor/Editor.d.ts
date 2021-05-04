import * as React from 'react';
import { ActionType } from 'typesafe-actions';
import { ILink } from '../Link';
import * as actions from './EditorAction';
export interface IEditorState {
    isOpen: boolean;
    value: {
        persistent: null | ILink;
        transient: null | ILink;
    };
}
declare type IEditorResult = {
    change: true;
    value: null | ILink;
} | {
    change: false;
};
export declare function editorReducer(state: IEditorState | undefined, action: ActionType<typeof actions>): IEditorState;
export declare function createEditor(): {
    state$: import("rxjs").Observable<IEditorState>;
    tx: {
        dismiss: () => void;
        update: (value: Partial<ILink>) => void;
        clear: () => void;
        apply: (value: null | ILink) => void;
        editLink: (link: null | ILink) => Promise<IEditorResult>;
    };
    initialState: IEditorState;
};
export declare type IEditor = ReturnType<typeof createEditor>;
export declare const EditorContext: React.Context<{
    state$: import("rxjs").Observable<IEditorState>;
    tx: {
        dismiss: () => void;
        update: (value: Partial<ILink>) => void;
        clear: () => void;
        apply: (value: null | ILink) => void;
        editLink: (link: null | ILink) => Promise<IEditorResult>;
    };
    initialState: IEditorState;
}>;
export declare function useEditorState(): IEditorState;
export declare function useEditorValue(): {
    value: ILink | null;
    isDirty: boolean;
};
export declare function useEditorTransactions(): {
    dismiss: () => void;
    update: (value: Partial<ILink>) => void;
    clear: () => void;
    apply: (value: ILink | null) => void;
    editLink: (link: ILink | null) => Promise<IEditorResult>;
};
export {};
