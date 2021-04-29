/// <reference types="react" />
import { ILinkTypeProps } from '../../../domain';
export declare const MailTo: {
    readonly id: "Sitegeist.Archaeopteryx:MailTo";
    readonly isSuitableFor: (props: ILinkTypeProps) => boolean;
    readonly getIcon: () => JSX.Element;
    readonly getTitle: () => string;
    readonly getPreview: (props: ILinkTypeProps) => JSX.Element;
    readonly getEditor: () => JSX.Element;
};
