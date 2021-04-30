/// <reference types="react" />
import { ILinkTypeProps } from '../../../domain';
export declare const Asset: {
    readonly id: "Sitegeist.Archaeopteryx:Asset";
    readonly isSuitableFor: (props: ILinkTypeProps) => boolean;
    readonly getIcon: () => JSX.Element;
    readonly getTitle: () => string;
    readonly getPreview: () => JSX.Element;
    readonly getEditor: () => JSX.Element;
};
