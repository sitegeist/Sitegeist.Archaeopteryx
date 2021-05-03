import * as React from 'react';

import {useGlobalRegistry} from '@sitegeist/archaeopteryx-neos-bridge';

import {ILink} from './Link';

export interface ILinkTypeProps {
    link?: ILink
}

export abstract class LinkType {
    public abstract id: string;
    public abstract isSuitableFor: (props: ILinkTypeProps) => boolean;
    public abstract getIcon: React.FC<ILinkTypeProps>;
    public abstract getTitle: (props: ILinkTypeProps) => string;
    public abstract getPreview: React.FC<ILinkTypeProps>;
    public abstract getEditor: React.FC<ILinkTypeProps>;
}

export function useLinkTypes(): LinkType[] {
    const globalRegistry = useGlobalRegistry();
    return globalRegistry?.get('@sitegeist/archaeopteryx/link-types')?.getAllAsList() ?? [];
}

export function useLinkTypeForHref(href: string): null | LinkType {
    const linkTypes = useLinkTypes();
    const result = React.useMemo(() => {
        for (const linkType of linkTypes) {
            if (linkType.isSuitableFor({link: {href}})) {
                return linkType;
            }
        }

        return null;
    }, [linkTypes, href]);

    return result;
}