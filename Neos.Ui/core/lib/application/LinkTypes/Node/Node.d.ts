/// <reference types="react" />
import { INodePartialForTree } from '@sitegeist/archaeopteryx-neos-bridge';
import { Process, ILink } from '../../../domain';
interface Props {
    node: null | INodePartialForTree;
}
export declare const Node: {
    readonly id: "Sitegeist.Archaeopteryx:Node";
    readonly isSuitableFor: (link: ILink) => boolean;
    readonly useResolvedProps: (link?: ILink | undefined) => Process.IProcess<Props>;
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
