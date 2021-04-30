import * as React from 'react';
import {ActionType, getType} from 'typesafe-actions';
import {Subject} from 'rxjs';
import {scan, shareReplay} from 'rxjs/operators';

import {ILink} from '../Link';
import * as actions from './EditorAction';

export interface IEditorState {
    isOpen: boolean
    value: {
        persistent: null | ILink
        transient: null | ILink
    }
}

type IEditorResult =
    | {change: true, value: null | ILink}
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
        case getType(actions.ValueWasUpdated): {
            const href = action.payload.href ?? state.value.transient?.href;
            if (href) {
                return {
                    isOpen: true,
                    value: {
                        ...state.value,
                        transient: {
                            href,
                            ...state.value.transient,
                            ...action.payload
                        }
                    }
                };
            } else {
                console.warn('[Sitegeist.Archaeopteryx]: Attempted value update without href');
                return state;
            }
        }
        case getType(actions.ValueWasCleared):
            return {
                isOpen: true,
                value: {
                    ...state.value,
                    transient: null
                }
            };
        case getType(actions.ValueWasApplied):
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
    const actions$ = new Subject<ActionType<typeof actions>>();
    const dispatch = (action: ActionType<typeof actions>) => actions$.next(action);
    const state$ = actions$.pipe(
        scan(editorReducer, initialState),
        shareReplay(1)
    );

    const open = (value: null | ILink) => dispatch(actions.EditorWasOpened(value));
    const dismiss = () => dispatch(actions.EditorWasDismissed());
    const update = (value: Partial<ILink>) => dispatch(actions.ValueWasUpdated(value));
    const clear = () => dispatch(actions.ValueWasCleared());
    const apply = (value: null | ILink) => dispatch(actions.ValueWasApplied(value));
    const editLink = (link: null | ILink) => new Promise<IEditorResult>(
        resolve => {
            open(link);

            actions$.subscribe(action => {
                switch (action.type) {
                    case getType(actions.EditorWasDismissed):
                        return resolve({change: false});
                    case getType(actions.ValueWasApplied):
                        return resolve({change: true, value: action.payload});
                    default:
                        return;
                }
            });
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
        const subscription = state$.subscribe(setState);
        return () => subscription.unsubscribe();
    }, [state$, initialState]);

    return state;
}

export function useEditorValue() {
    const {value: {persistent, transient}} = useEditorState();
    const isDirty = persistent !== transient;

    return {value: transient, isDirty};
}

export function useEditorTransactions() {
    const {tx} = React.useContext(EditorContext);
    return tx;
}