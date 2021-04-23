import * as React from 'react';
import {useNeos} from '../acl';

export abstract class LinkType {
    public abstract isSatisfiedBy: (props: ILinkTypeProps) => boolean;
    public abstract getIcon: React.FC<ILinkTypeProps>;
    public abstract getTitle: (props: ILinkTypeProps) => string;
    public abstract getPreview: React.FC<ILinkTypeProps>;
    public abstract getEditor: React.FC<ILinkTypeProps>;
}

export interface ILinkType {
    Icon: ILinkTypeIcon
    Title: ILinkTypeTitle
    Preview: ILinkTypePreview
    Editor: ILinkTypeEditor
    isSatisfiedBy: ILinkTypeIsSatisfiedBy
}

export interface ILinkTypeProps {
    uri: string
}

export type ILinkTypeIcon = React.ComponentType<ILinkTypeProps>

export interface ILinkTypeTitle {
    (props: ILinkTypeProps): string
}

export type ILinkTypePreview = React.ComponentType<ILinkTypeProps>

export type ILinkTypeEditor = React.ComponentType<ILinkTypeProps>

export interface ILinkTypeIsSatisfiedBy {
    (props: ILinkTypeProps): boolean
}

export function useLinkTypes(): ILinkType[] {
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

export function useLinkTypeForUri(uri: string): null | ILinkType {
    const linkTypes = useLinkTypes();
    const result = React.useMemo(() => {
        for (const linkType of linkTypes) {
            if (linkType.isSatisfiedBy({ uri })) {
                return linkType;
            }
        }

        return null;
    }, [linkTypes, uri]);

    return result;
}