import {createAction} from 'typesafe-actions';

export const EditorWasOpened = createAction(
    'http://sitegeist.de/Sitegeist.Archaeopteryx/EditorWasOpened',
    (uri: null | string) => uri
)();

export const EditorWasDismissed = createAction(
    'http://sitegeist.de/Sitegeist.Archaeopteryx/EditorWasDismissed'
)();

export const UriWasUpdated = createAction(
    'http://sitegeist.de/Sitegeist.Archaeopteryx/UriWasUpdated',
    (updatedUri: string) => updatedUri
)();

export const UriWasCleared = createAction(
    'http://sitegeist.de/Sitegeist.Archaeopteryx/UriWasCleared'
)();

export const UpdatedUriWasApplied = createAction(
    'http://sitegeist.de/Sitegeist.Archaeopteryx/UpdatedUriWasApplied',
    (updatedUri: null | string) => updatedUri
)();
