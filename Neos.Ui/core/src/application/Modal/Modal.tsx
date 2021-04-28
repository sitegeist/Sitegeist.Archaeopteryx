import * as React from 'react';
import {Dialog, Button} from '@neos-project/react-ui-components';
import {useEditorState, useEditorTransactions, useLinkTypes} from '../../domain';

export const Modal: React.FC = () => {
    const {isOpen, value} = useEditorState();
    const {dismiss, apply} = useEditorTransactions();
    const linkTypes = useLinkTypes();
    const [activeLinkType, setActiveLinkType] = React.useState(linkTypes[0]);
    const {getEditor: Editor} = activeLinkType;

    React.useEffect(() => {
        setActiveLinkType(
            linkTypes.find(
                linkType => value.persistent && linkType.isSuitableFor({
                    link: {uri: value.persistent}
                })
            ) ?? linkTypes[0]
        );
    }, [value.persistent]);

    return (
        <Dialog
            title="Sitegeist.Archaeopteryx"
            isOpen={isOpen}
            onRequestClose={dismiss}
        >
            {linkTypes.map(linkType => {
                const {getIcon: Icon, id} = linkType;

                return (
                    <Button
                        isActive={linkType.id === activeLinkType.id}
                        key={id}
                        onClick={() => setActiveLinkType(linkType)}
                    >
                        <Icon/>
                    </Button>
                );
            })}

            <div>
                <Editor/>
            </div>

            <Button onClick={dismiss}>
                Click here!
            </Button>
            <Button onClick={() => apply(value.transient)}>
                Apply
            </Button>
        </Dialog>
    );
};