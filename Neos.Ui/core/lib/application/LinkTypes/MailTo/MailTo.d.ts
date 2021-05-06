/// <reference types="react" />
import { ILink } from '../../../domain';
interface Props {
    value: null | {
        recipient: string;
        subject?: string;
        cc?: string;
        bcc?: string;
        body?: string;
    };
}
export declare const MailTo: {
    readonly id: "Sitegeist.Archaeopteryx:MailTo";
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
        result: {
            value: null;
        };
    } | {
        busy: false;
        error: null;
        result: {
            value: {
                recipient: string;
                subject: string | undefined;
                cc: string | undefined;
                bcc: string | undefined;
                body: string | undefined;
            };
        };
    };
    readonly convertPropsToLink: (props: Props) => {
        href: string;
    } | null;
    readonly getStaticIcon: () => JSX.Element;
    readonly getIcon: () => JSX.Element;
    readonly getStaticTitle: () => string;
    readonly getTitle: () => string;
    readonly getLoadingPreview: () => JSX.Element;
    readonly getPreview: (props: Props) => JSX.Element;
    readonly getLoadingEditor: () => JSX.Element;
    readonly getEditor: (props: Props) => JSX.Element;
    readonly error: (message: string) => Error;
};
export {};
