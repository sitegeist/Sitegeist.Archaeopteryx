import * as React from 'react';
import {Dialog, Button} from '@neos-project/react-ui-components';
import {Form, Field} from 'react-final-form';

import {ILink, ILinkOptions, LinkType, useEditorState, useEditorTransactions, useLinkTypes, useLinkTypeForHref} from '../../domain';

export const Modal: React.FC = () => {
    const {isOpen, value} = useEditorState();

    if (isOpen) {
        if (value.persistent) {
            return (
                <DialogWithValue
                    value={value.transient ?? value.persistent}
                />
            );
        } else {
            return (
                <DialogWithEmptyValue/>
            );
        }
    }

    return null;
};

const DialogWithEmptyValue: React.FC = () => {
    const {dismiss} = useEditorTransactions();
    const linkTypes = useLinkTypes();
    const [activeLinkType, setActiveLinkType] = React.useState<null | LinkType>(linkTypes[0]);

    return (
        <Dialog
            title="Sitegeist.Archaeopteryx"
            isOpen={true}
            style="jumbo"
        >
            {linkTypes.map(linkType => (
                <Button
                    key={linkType.id}
                    onClick={() => setActiveLinkType(linkType)}
                >
                    <linkType.getStaticIcon/>
                </Button>
            ))}

            <div>
                {activeLinkType ? (
                    <LinkEditor
                        link={null}
                        linkType={activeLinkType}
                    />
                ) : null}
            </div>

            <Button onClick={dismiss}>
                Cancel
            </Button>
            <Button disabled>
                Apply
            </Button>
        </Dialog>
    );
}

const DialogWithValue: React.FC<{
    value: ILink
}> = props => {
    const {dismiss, update, apply, clear} = useEditorTransactions();
    const linkType = useLinkTypeForHref(props.value.href)!;
    const [showSettings, setShowSettings] = React.useState(false);

    return (
        <Dialog
            title="Sitegeist.Archaeopteryx"
            isOpen={true}
            style="jumbo"
        >
            <Button
                isActive={!showSettings}
                onClick={() => setShowSettings(false)}
            >
                <linkType.getIcon/>
            </Button>
            <Button
                isActive={showSettings}
                onClick={() => setShowSettings(true)}
            >
                SETTINGS
            </Button>

            <div>
                <Button onClick={clear}>
                    Reset
                </Button>
            </div>

            <div>
                {showSettings ? (
                    <Form<ILinkOptions> onSubmit={values => update({options: values})}>
                        {({handleSubmit}) => (
                            <form onSubmit={handleSubmit}>
                                <Field<string>
                                    name="anchor"
                                    initialValue={props.value.options?.anchor}
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
                                    initialValue={props.value.options?.title}
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
                                    initialValue={props.value.options?.targetBlank ? 'true' : ''}
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
                                    initialValue={props.value.options?.relNoFollow ? 'true' : ''}
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
                ): (
                    <LinkEditor
                        link={props.value}
                        linkType={linkType}
                    />
                )}
            </div>

            <Button onClick={dismiss}>
                Click here!
            </Button>
            <Button onClick={() => apply(props.value)}>
                Apply
            </Button>
        </Dialog>
    );
}

const LinkEditor: React.FC<{
    link: null | ILink
    linkType: LinkType
}> = props => {
    const {busy, error, result: editorProps} = props.linkType.useResolvedProps(props.link ?? undefined);
    const {getEditor: Editor, getLoadingEditor: LoadingEditor} = props.linkType;

    if (error) {
        throw error;
    } else if (busy) {
        return (<LoadingEditor link={props.link ?? undefined}/>);
    } else {
        return (<Editor {...editorProps}/>);
    }
}