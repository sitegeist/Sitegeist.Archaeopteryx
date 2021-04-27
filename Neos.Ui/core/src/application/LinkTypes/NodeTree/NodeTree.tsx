import * as React from 'react';

import {LinkType, ILinkTypeProps, useEditorTransactions, useEditorValue} from '../../../domain';
import {NodeTreeAdapter} from './NodeTreeAdapter';

export const NodeTree = new class extends LinkType {
    public readonly id = 'Sitegeist.Archaeopteryx:NodeTree';

    public readonly isSuitableFor = (props: ILinkTypeProps) => {
        return Boolean(props.link?.uri.startsWith('node://'));
    }

    public readonly getIcon = () => (
        <div>NODE TREE</div>
    );

    public readonly getTitle = () => 'Node Tree';

    public readonly getPreview = () => (
        <div>NODE TREE PREVIEW</div>
    );

    public readonly getEditor = () => {
        const {value} = useEditorValue();
        const {update} = useEditorTransactions();
        const onChange = React.useCallback(
            (ev: React.SyntheticEvent) =>
                update((ev.target as HTMLInputElement).value),
            [update]
        );

        return (
            <NodeTreeAdapter/>
        );
    };
}
