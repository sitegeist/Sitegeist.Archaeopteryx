/// <reference types="react" />
import { ILink } from '../../../domain';
interface Props {
    assetIdentifier: null | string;
}
export declare const Asset: {
    readonly id: "Sitegeist.Archaeopteryx:Asset";
    readonly isSuitableFor: (link: ILink) => boolean;
    readonly useResolvedProps: (link?: ILink | undefined) => {
        busy: true;
        error: null;
        result: null;
    } | {
        busy: false;
        error: Error;
        result: null;
    } | {
        busy: false;
        error: null;
        result: any;
    };
    readonly convertPropsToLink: (props: Props) => {
        href: string;
    } | null;
    readonly getStaticIcon: () => JSX.Element;
    readonly getIcon: () => JSX.Element;
    readonly getStaticTitle: () => string;
    readonly getTitle: () => string;
    readonly getLoadingPreview: () => JSX.Element;
    readonly getPreview: () => JSX.Element;
    readonly getLoadingEditor: () => JSX.Element;
    readonly getEditor: (props: Props) => JSX.Element;
    readonly error: (message: string) => Error;
};
export {};
