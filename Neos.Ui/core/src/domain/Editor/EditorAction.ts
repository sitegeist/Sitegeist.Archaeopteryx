import {createAction} from 'typesafe-actions';

import {ILink, ILinkOptions} from '../Link';

export const EditorWasOpened = createAction(
    'http://sitegeist.de/Sitegeist.Archaeopteryx/EditorWasOpened',
    (
        initialValue: null | ILink,
        enabledLinkOptions: (keyof ILinkOptions)[],
        editorOptions: Record<string, unknown> = {}
    ) => ({initialValue, enabledLinkOptions, editorOptions})
)();

export const EditorWasDismissed = createAction(
    'http://sitegeist.de/Sitegeist.Archaeopteryx/EditorWasDismissed'
)();

export const ValueWasUnset = createAction(
    'http://sitegeist.de/Sitegeist.Archaeopteryx/ValueWasUnset'
)();

export const ValueWasApplied = createAction(
    'http://sitegeist.de/Sitegeist.Archaeopteryx/ValueWasApplied',
    (value: ILink) => value
)();
