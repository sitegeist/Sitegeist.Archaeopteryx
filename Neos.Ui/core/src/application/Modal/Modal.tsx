import * as React from 'react';
import {Dialog, Button} from '@neos-project/react-ui-components';
import {Form, Field} from 'react-final-form';

import {ILinkOptions, LinkType, useEditorState, useEditorTransactions, useLinkTypes} from '../../domain';

export const Modal: React.FC = () => {
    const {isOpen, value} = useEditorState();
    const {dismiss, update, apply} = useEditorTransactions();
    const linkTypes = useLinkTypes();
    const [showSettings, setShowSettings] = React.useState(false);
    const [activeLinkType, setActiveLinkType] = React.useState<null | LinkType>(linkTypes[0]);
    const {getEditor: Editor} = activeLinkType ?? {};

    React.useEffect(() => {
        setActiveLinkType(
            linkTypes.find(
                linkType => value.persistent && linkType.isSuitableFor({
                    link: value.persistent
                })
            ) ?? linkTypes[0]
        );
    }, [value.persistent]);

    return (
        <Dialog
            title="Sitegeist.Archaeopteryx"
            isOpen={isOpen}
            onRequestClose={dismiss}
            style="jumbo"
        >
            {linkTypes.map(linkType => {
                const {getIcon: Icon, id} = linkType;

                return (
                    <Button
                        isActive={linkType.id === activeLinkType?.id}
                        key={id}
                        onClick={() => {
                            setActiveLinkType(linkType);
                            setShowSettings(false);
                        }}
                    >
                        <Icon/>
                    </Button>
                );
            })}

            <Button
                isActive={showSettings}
                onClick={() => {
                    setActiveLinkType(null);
                    setShowSettings(true);
                }}
            >
                SETTINGS
            </Button>

            <div>
                {Editor ? (<Editor/>) : null}
                {showSettings ? (
                    <Form<ILinkOptions> onSubmit={values => update({options: values})}>
                        {({handleSubmit}) => (
                            <form onSubmit={handleSubmit}>
                                <Field<string>
                                    name="anchor"
                                    initialValue={value.transient?.options?.anchor}
                                    >
                                    {({input}) => (
                                        <label>
                                            Anchor:
                                            <input type="text" {...input}/>
                                        </label>
                                    )}
                                </Field>
                                <Field<string>
                                    name="title"
                                    initialValue={value.transient?.options?.title}
                                    >
                                    {({input}) => (
                                        <label>
                                            Title:
                                            <input type="text" {...input}/>
                                        </label>
                                    )}
                                </Field>
                                <Field<string>
                                    type="checkbox"
                                    name="targetBlank"
                                    initialValue={value.transient?.options?.targetBlank ? 'true' : ''}
                                    >
                                    {({input}) => (
                                        <label>
                                            Open in new Window:
                                            <input
                                                style={{
                                                    appearance: 'checkbox',
                                                    backgroundColor: 'white',
                                                }}
                                                type="checkbox"
                                                {...input}
                                            />
                                        </label>
                                    )}
                                </Field>
                                <Field<string>
                                    type="checkbox"
                                    name="relNoFollow"
                                    initialValue={value.transient?.options?.relNoFollow ? 'true' : ''}
                                    >
                                    {({input}) => (
                                        <label>
                                            No Follow:
                                            <input
                                                style={{
                                                    appearance: 'checkbox',
                                                    backgroundColor: 'white',
                                                }}
                                                type="checkbox"
                                                {...input}
                                            />
                                        </label>
                                    )}
                                </Field>

                                <button type="submit">Apply</button>
                            </form>
                        )}
                    </Form>
                ): null}
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