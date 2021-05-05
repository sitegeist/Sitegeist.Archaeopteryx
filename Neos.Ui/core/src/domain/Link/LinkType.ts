import * as React from 'react';

import {useGlobalRegistry} from '@sitegeist/archaeopteryx-neos-bridge';

import {IProcess} from '../Process';

import {ILink} from './Link';

export abstract class LinkType<P = any> {
    public abstract id: string;
    public abstract isSuitableFor: (link: ILink) => boolean;
    public abstract useResolvedProps: (link?: ILink) => IProcess<P>;
    public abstract getStaticIcon: React.FC;
    public abstract getIcon: React.FC<P>;
    public abstract getStaticTitle: () => string;
    public abstract getTitle: (props: P) => string;
    public abstract getLoadingPreview: React.FC<{link?: ILink}>;
    public abstract getPreview: React.FC<P>;
    public abstract getLoadingEditor: React.FC<{link?: ILink}>;
    public abstract getEditor: React.FC<P>;

    public readonly error = (message: string) => {
        return new Error(`[${this.id}]: ${message}`);
    }
}

export function useLinkTypes(): LinkType[] {
    const globalRegistry = useGlobalRegistry();
    return globalRegistry.get('@sitegeist/archaeopteryx/link-types')?.getAllAsList() ?? [];
}

export function useLinkTypeForHref(href: null | string): null | LinkType {
    const linkTypes = useLinkTypes();
    const result = React.useMemo(() => {
        if (href === null) {
            return null;
        }

        for (const linkType of [...linkTypes].reverse()) {
            if (linkType.isSuitableFor({href})) {
                return linkType;
            }
        }

        return null;
    }, [linkTypes, href]);

    return result;
}