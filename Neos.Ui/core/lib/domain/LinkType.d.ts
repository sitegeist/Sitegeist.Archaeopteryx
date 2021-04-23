import * as React from 'react';
export declare abstract class LinkType {
    abstract isSatisfiedBy: (props: ILinkTypeProps) => boolean;
    abstract getIcon: React.FC<ILinkTypeProps>;
    abstract getTitle: (props: ILinkTypeProps) => string;
    abstract getPreview: React.FC<ILinkTypeProps>;
    abstract getEditor: React.FC<ILinkTypeProps>;
}
export interface ILinkType {
    Icon: ILinkTypeIcon;
    Title: ILinkTypeTitle;
    Preview: ILinkTypePreview;
    Editor: ILinkTypeEditor;
    isSatisfiedBy: ILinkTypeIsSatisfiedBy;
}
export interface ILinkTypeProps {
    uri: string;
}
export declare type ILinkTypeIcon = React.ComponentType<ILinkTypeProps>;
export interface ILinkTypeTitle {
    (props: ILinkTypeProps): string;
}
export declare type ILinkTypePreview = React.ComponentType<ILinkTypeProps>;
export declare type ILinkTypeEditor = React.ComponentType<ILinkTypeProps>;
export interface ILinkTypeIsSatisfiedBy {
    (props: ILinkTypeProps): boolean;
}
export declare function useLinkTypes(): ILinkType[];
export declare function useLinkTypeForUri(uri: string): null | ILinkType;
