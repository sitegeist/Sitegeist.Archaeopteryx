import * as React from 'react';
import { ActionType } from 'typesafe-actions';
import * as actions from './EditorAction';
export interface IEditorState {
    isOpen: boolean;
    value: {
        persistent: null | string;
        transient: null | string;
    };
}
declare type IEditorResult = {
    change: true;
    value: null | string;
} | {
    change: false;
};
export declare function editorReducer(state: IEditorState | undefined, action: ActionType<typeof actions>): IEditorState;
export declare function createEditor(): {
    state$: import("wonka").Source<IEditorState>;
    tx: {
        dismiss: () => void;
        update: (updatedUri: string) => void;
        clear: () => void;
        apply: (updatedUri: null | string) => void;
        editLink: (uri: null | string) => Promise<IEditorResult>;
    };
    initialState: IEditorState;
};
export declare const EditorContext: React.Context<{
    state$: import("wonka").Source<IEditorState>;
    tx: {
        dismiss: () => void;
        update: (updatedUri: string) => void;
        clear: () => void;
        apply: (updatedUri: null | string) => void;
        editLink: (uri: null | string) => Promise<IEditorResult>;
    };
    initialState: IEditorState;
}>;
export declare function useEditorState(): IEditorState;
export declare function useEditorValue(): {
    value: string | null;
    isDirty: boolean;
};
export declare function useEditorTransaction(): {
    dismiss: () => void;
    update: (updatedUri: string) => void;
    clear: () => void;
    apply: (updatedUri: string | null) => void;
    editLink: (uri: string | null) => Promise<IEditorResult>;
};
export {};
