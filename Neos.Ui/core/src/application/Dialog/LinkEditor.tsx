import * as React from 'react';
import {ILink, LinkType, FieldGroup} from '../../domain';

function useLastNonNull<V>(value: null | V) {
    const valueRef = React.useRef(value);

    if (value !== null) {
        valueRef.current = value;
    }

    return valueRef.current;
}

export const LinkEditor: React.FC<{
    link: null | ILink;
    linkType: LinkType;
}> = props => {
    const { busy, error, result } = props.linkType.useResolvedProps(props.link ?? undefined);
    const editorProps = useLastNonNull(result);
    const { getEditor: Editor, getLoadingEditor: LoadingEditor } = props.linkType;

    if (error) {
        throw error;
    } else if (busy && !editorProps) {
        return (<LoadingEditor link={props.link ?? undefined} />);
    } else {
        return (
            <FieldGroup prefix={`linkTypeProps.${props.linkType.id.split('.').join('_')}`}>
                <Editor {...editorProps} />
            </FieldGroup>
        );
    }
};
