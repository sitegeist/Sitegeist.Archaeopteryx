import { ILink } from '../Link';
export declare const EditorWasOpened: (value: ILink | null) => import("typesafe-actions").PayloadAction<"http://sitegeist.de/Sitegeist.Archaeopteryx/EditorWasOpened", ILink | null>;
export declare const EditorWasDismissed: import("typesafe-actions").EmptyActionCreator<"http://sitegeist.de/Sitegeist.Archaeopteryx/EditorWasDismissed">;
export declare const ValueWasUpdated: (value: Partial<ILink>) => import("typesafe-actions").PayloadAction<"http://sitegeist.de/Sitegeist.Archaeopteryx/ValueWasUpdated", Partial<ILink>>;
export declare const ValueWasCleared: import("typesafe-actions").EmptyActionCreator<"http://sitegeist.de/Sitegeist.Archaeopteryx/ValueWasCleared">;
export declare const ValueWasApplied: (value: ILink | null) => import("typesafe-actions").PayloadAction<"http://sitegeist.de/Sitegeist.Archaeopteryx/ValueWasApplied", ILink | null>;
