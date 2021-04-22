import * as React from 'react';

interface Props {
}

export const InspectorEditor: React.FC<Props> = props => {
    return (
        <pre>{JSON.stringify(props, null, 2)}</pre>
    );
};