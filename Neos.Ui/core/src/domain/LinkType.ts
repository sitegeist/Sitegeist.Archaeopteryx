import * as React from 'react';
import {useNeos} from '../acl';

export interface ILink {
    uri: string
}

export interface ILinkTypeProps {
    link?: ILink
}

export abstract class LinkType {
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

export function useLinkTypeForUri(uri: string): null | LinkType {
    const linkTypes = useLinkTypes();
    const result = React.useMemo(() => {
        for (const linkType of linkTypes) {
            if (linkType.isSuitableFor({link: {uri}})) {
                return linkType;
            }
        }

        return null;
    }, [linkTypes, uri]);

    return result;
}