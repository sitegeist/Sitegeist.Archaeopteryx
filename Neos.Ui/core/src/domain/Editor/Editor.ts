import * as React from 'react';
import {ActionType, getType} from 'typesafe-actions';
import {makeSubject, pipe, scan, subscribe} from 'wonka';

import * as actions from './EditorAction';

export interface IEditorState {
    isOpen: boolean
    value: {
        persistent: null | string
        transient: null | string
    }
}

type IEditorResult =
    | {change: true, value: null | string}
    | {change: false}
;

const initialState: IEditorState = {
    isOpen: false,
    value: {
        persistent: null,
        transient: null
    }
};

export function editorReducer(
    state: IEditorState = initialState,
    action: ActionType<typeof actions>
): IEditorState {
    switch (action.type) {
        case getType(actions.EditorWasOpened):
            return {
                isOpen: true,
                value: {
                    transient: action.payload,
                    persistent: action.payload
                }
            };
        case getType(actions.EditorWasDismissed):
            return {
                isOpen: false,
                value: {
                    transient: null,
                    persistent: null
                }
            };
        case getType(actions.UriWasUpdated):
            return {
                isOpen: true,
                value: {
                    ...state.value,
                    transient: action.payload
                }
            };
        case getType(actions.UriWasCleared):
            return {
                isOpen: true,
                value: {
                    ...state.value,
                    transient: null
                }
            };
        case getType(actions.UpdatedUriWasApplied):
            return {
                isOpen: false,
                value: {
                    transient: null,
                    persistent: null
                }
            };
        default:
            return state;
    }
}

export function createEditor() {
    const {
        source: actions$,
        next: dispatch
    } = makeSubject<ActionType<typeof actions>>();
    const state$ = pipe(
        actions$,
        scan(editorReducer, initialState)
    );

    const open = (uri: null | string) => dispatch(actions.EditorWasOpened(uri));
    const dismiss = () => dispatch(actions.EditorWasDismissed());
    const update = (updatedUri: string) =>
        dispatch(actions.UriWasUpdated(updatedUri));
    const clear = () => dispatch(actions.UriWasCleared());
    const apply = (updatedUri: null | string) =>
        dispatch(actions.UpdatedUriWasApplied(updatedUri));
    const editLink = (uri: null | string) => new Promise<IEditorResult>(
        resolve => {
            open(uri);

            pipe(actions$, subscribe(action => {
                switch (action.type) {
                    case getType(actions.EditorWasDismissed):
                        return resolve({change: false});
                    case getType(actions.UpdatedUriWasApplied):
                        return resolve({change: true, value: action.payload});
                    default:
                        return;
                }
            }));
        }
    );

    return {
        state$,
        tx: {dismiss, update, clear, apply, editLink},
        initialState
    };
}

export const EditorContext = React.createContext(createEditor());

export function useEditorState() {
    const {state$, initialState} = React.useContext(EditorContext);
    const [state, setState] = React.useState(initialState);

    React.useEffect(() => {
        const subscription = pipe(state$, subscribe(state => {
            setState(state);
        }));

        return () => subscription.unsubscribe();
    }, [state$, initialState]);

    return state;
}

export function useEditorValue() {
    const {value: {persistent, transient}} = useEditorState();
    const isDirty = persistent !== transient;

    return {value: transient, isDirty};
}

export function useEditorTransaction() {
    const {tx} = React.useContext(EditorContext);
    return tx;
}