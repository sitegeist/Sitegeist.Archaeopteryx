/// <reference types="react" />
import { ILink } from '../../../domain';
interface Props {
    value: null | {
        protocol: 'http' | 'https';
        urlWithoutProtocol: string;
    };
}
export declare const Web: {
    readonly id: "Sitegeist.Archaeopteryx:Web";
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
    readonly getStaticIcon: () => JSX.Element;
    readonly getIcon: () => JSX.Element;
    readonly getStaticTitle: () => string;
    readonly getTitle: (props: Props) => string;
    readonly getLoadingPreview: () => JSX.Element;
    readonly getPreview: (props: Props) => JSX.Element;
    readonly getLoadingEditor: () => JSX.Element;
    readonly getEditor: () => JSX.Element;
    readonly error: (message: string) => Error;
};
export {};
