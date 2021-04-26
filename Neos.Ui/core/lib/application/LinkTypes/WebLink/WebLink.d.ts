/// <reference types="react" />
import { ILinkTypeProps } from '../../../domain';
export declare const WebLink: {
    readonly isSuitableFor: (props: ILinkTypeProps) => boolean;
    readonly getIcon: () => JSX.Element;
    readonly getTitle: (props: ILinkTypeProps) => "Web Link (secure)" | "Web Link (not secure)" | "Web Link";
    readonly getPreview: (props: ILinkTypeProps) => JSX.Element;
    readonly getEditor: () => JSX.Element;
};
