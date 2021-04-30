import * as React from 'react';
import { ILink } from './Link';
export interface ILinkTypeProps {
    link?: ILink;
}
export declare abstract class LinkType {
    abstract id: string;
    abstract isSuitableFor: (props: ILinkTypeProps) => boolean;
    abstract getIcon: React.FC<ILinkTypeProps>;
    abstract getTitle: (props: ILinkTypeProps) => string;
    abstract getPreview: React.FC<ILinkTypeProps>;
    abstract getEditor: React.FC<ILinkTypeProps>;
}
export declare function useLinkTypes(): LinkType[];
export declare function useLinkTypeForHref(href: string): null | LinkType;
