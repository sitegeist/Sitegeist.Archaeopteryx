import * as React from 'react';
import {useNeos} from '../acl';
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
    const neosContext = useNeos();
    if (neosContext) {
        const {globalRegistry} = neosContext;
        const linkTypesRegistry = globalRegistry.get('@sitegeist/archaeopteryx/link-types');
        if (linkTypesRegistry) {
            return linkTypesRegistry.getAllAsList();
        }
    }

    return [];
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