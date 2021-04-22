import * as React from 'react';

import { ILinkEditor } from '../../domain';

interface Props {
    href: string
    isSecure: boolean
}

export const WebLinkEditor: ILinkEditor<Props> = props => {
    return (
        <pre>{JSON.stringify(props, null, 2)}</pre>
    );
}

WebLinkEditor.fromHref = href => {
    if (href.startsWith('http://')) {
        return (
            <WebLinkEditor href={href} isSecure={false}/>
        );
    }

    if (href.startsWith('https://')) {
        return (
            <WebLinkEditor href={href} isSecure/>
        );
    }

    return null;
}