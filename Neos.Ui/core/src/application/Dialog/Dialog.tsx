import * as React from 'react';
import {Dialog as NeosDialog, Button} from '@neos-project/react-ui-components';
import {Form, Field} from 'react-final-form';

import {ILink, ILinkOptions, LinkType, useEditorState, useEditorTransactions, useLinkTypes, useLinkTypeForHref} from '../../domain';

export const Dialog: React.FC = () => {
    const {isOpen, value} = useEditorState();

    let contents = null;
    if (isOpen) {
        if (value.transient) {
            contents = (
                <DialogWithValue
                    value={value.transient}
                />
            );
        } else {
            contents = (
                <DialogWithEmptyValue/>
            );
        }

        return (
            <NeosDialog
                title="Sitegeist.Archaeopteryx"
                isOpen={isOpen}
                style="jumbo"
                onRequestClose={() => {}}
            >
                {contents}
            </NeosDialog>
        );
    }

    return null;
};

const DialogWithEmptyValue: React.FC = () => {
    const {dismiss} = useEditorTransactions();
    const linkTypes = useLinkTypes();
    const [activeLinkType, setActiveLinkType] = React.useState<null | LinkType>(linkTypes[0]);

    return (
        <>
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
                        key={activeLinkType.id}
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
        </>
    );
}

const DialogWithValue: React.FC<{
    value: ILink
}> = props => {
    const {dismiss, update, unset, apply} = useEditorTransactions();
    const linkType = useLinkTypeForHref(props.value.href)!;
    const [showSettings, setShowSettings] = React.useState(false);

    return (
        <>
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
                <Button onClick={unset}>
                    Delete
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
                ) : (
                    <LinkEditor
                        key={linkType.id}
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
        </>
    );
}

function useLastNonNull<V>(value: null | V) {
    const valueRef = React.useRef(value);

    if (value !== null) {
        valueRef.current = value;
    }

    return valueRef.current;
}

const LinkEditor: React.FC<{
    link: null | ILink
    linkType: LinkType
}> = props => {
    const {busy, error, result} = props.linkType.useResolvedProps(props.link ?? undefined);
    const editorProps = useLastNonNull(result);
    const {getEditor: Editor, getLoadingEditor: LoadingEditor} = props.linkType;



    if (error) {
        throw error;
    } else if (busy && !editorProps) {
        return (<LoadingEditor link={props.link ?? undefined}/>);
    } else {
        return (<Editor {...editorProps}/>);
    }
}