import * as React from 'react';
import { useNeos } from '../acl';

export interface ILinkEditor<P> extends React.FC<P> {
    fromHref: (href: string) => React.ReactNode
}

export function useLinkEditors(): ILinkEditor<any>[] {
    const neosContext = useNeos();
    if (neosContext) {
        throw new Error('useLinkEditors is not implemented yet!');
    }

    return [];
}

export function useLinkEditorForHref(href: string): null | {
    component: ILinkEditor<any>,
    editor: React.ReactNode
} {
    const components = useLinkEditors();
    const result = React.useMemo(() => {
        for (const component of components) {
            const editor = component.fromHref(href)
            if (editor) {
                return {component, editor};
            }
        }

        return null;
    }, [components, href]);

    return result;
}