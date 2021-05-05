import * as React from 'react';
import { IProcess } from '../Process';
import { ILink } from './Link';
export declare abstract class LinkType<P = any> {
    abstract id: string;
    abstract isSuitableFor: (link: ILink) => boolean;
    abstract useResolvedProps: (link?: ILink) => IProcess<P>;
    abstract getStaticIcon: React.FC;
    abstract getIcon: React.FC<P>;
    abstract getStaticTitle: () => string;
    abstract getTitle: (props: P) => string;
    abstract getLoadingPreview: React.FC<{
        link?: ILink;
    }>;
    abstract getPreview: React.FC<P>;
    abstract getLoadingEditor: React.FC<{
        link?: ILink;
    }>;
    abstract getEditor: React.FC<P>;
    readonly error: (message: string) => Error;
}
export declare function useLinkTypes(): LinkType[];
export declare function useLinkTypeForHref(href: null | string): null | LinkType;
