import * as React from 'react';
import {Dialog, Button} from '@neos-project/react-ui-components';
import {useEditorState, useEditorTransaction} from '../../domain';

export const Modal: React.FC = () => {
    const {isOpen} = useEditorState();
    const {dismiss} = useEditorTransaction()

    return (
        <Dialog title="Sitegeist.Archaeopteryx" isOpen={isOpen}>
            Hello World!

            <Button onClick={dismiss}>Click here!</Button>
        </Dialog>
    );
};