/// <reference types="react" />
import { ILinkTypeProps } from '../../../domain';
export declare const Node: {
    readonly id: "Sitegeist.Archaeopteryx:NodeTree";
    readonly isSuitableFor: (props: ILinkTypeProps) => boolean;
    readonly getIcon: () => JSX.Element;
    readonly getTitle: () => string;
    readonly getPreview: () => JSX.Element;
    readonly getEditor: () => JSX.Element;
};
