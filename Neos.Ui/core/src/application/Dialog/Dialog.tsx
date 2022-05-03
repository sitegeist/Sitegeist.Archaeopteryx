import * as React from 'react';
import {Form, useForm} from 'react-final-form';
import {useKey} from 'react-use';

import {Button} from '@neos-project/react-ui-components';

import {useI18n, useSelector} from '@sitegeist/archaeopteryx-neos-bridge';
import {ErrorBoundary} from '@sitegeist/archaeopteryx-error-handling';

import {Field} from '../../framework';
import {ILink, ILinkOptions, useEditorState, useEditorTransactions, useLinkTypes, useLinkTypeForHref} from '../../domain';
import {Layout, Form as StyledForm, Modal, Tabs, Deletable} from '../../presentation';

import {LinkEditor} from './LinkEditor';
import {Settings} from './Settings';

export const Dialog: React.FC = () => {
    const i18n = useI18n();
    const linkTypes = useLinkTypes();
    const isAuthenticated = useSelector(state => !state.system?.authenticationTimeout);
    const {dismiss, apply, unset} = useEditorTransactions();
    const {isOpen, initialValue} = useEditorState();
    const [valueWasDeleted, setValueWasDeleted] = React.useState(false);
    const handleSubmit = React.useCallback((values: any) => {
        const linkType = linkTypes.find(linkType => linkType.id === values.linkTypeId);

        if (linkType) {
            const props = values.linkTypeProps?.[linkType.id.split('.').join('_')];

            if (props) {
                const link = {
                    ...linkType.convertModelToLink(props),
                    options: values.options
                        ? (Object.keys(values.options as ILinkOptions) as (keyof ILinkOptions)[])
                            .filter(key => linkType.supportedLinkOptions.includes(key))
                            .reduce((obj: ILinkOptions, key) => {
                                obj[key] = values.options[key];
                                return obj;
                            }, {} as ILinkOptions)
                        : {}
                };
                apply(link);
                setValueWasDeleted(false);
            }
        } else if(valueWasDeleted) {
            unset();
            setValueWasDeleted(false);
        }
    }, [linkTypes, valueWasDeleted]);

    useKey('Escape', dismiss);

    if (isOpen && isAuthenticated) {
        return (
            <Modal
                renderTitle={() => (
                    <div>{i18n('Sitegeist.Archaeopteryx:Main:dialog.title')}</div>
                )}
                renderBody={() => (
                    <Form<ILinkOptions> onSubmit={handleSubmit}>
                        {({handleSubmit, valid, dirty, values}) => (
                            <ErrorBoundary>
                                <StyledForm
                                    renderBody={() => initialValue === null || valueWasDeleted ? (
                                        <DialogWithEmptyValue
                                            valid={valid}
                                            onDelete={() => setValueWasDeleted(true)}
                                        />
                                    ) : (
                                        <DialogWithValue
                                            value={initialValue}
                                            onDelete={() => setValueWasDeleted(true)}
                                        />
                                    )}
                                    renderActions={() => (
                                        <>
                                            <Button onClick={dismiss}>
                                                {i18n('Sitegeist.Archaeopteryx:Main:dialog.action.cancel')}
                                            </Button>
                                            {(!valid || !dirty) && valueWasDeleted ? (
                                                <Button
                                                    style="success"
                                                    type="button"
                                                    onClick={unset}
                                                >
                                                    {i18n('Sitegeist.Archaeopteryx:Main:dialog.action.apply')}
                                                </Button>
                                            ) : (
                                                <Button
                                                    style="success"
                                                    type="submit"
                                                    disabled={!valid || !dirty}
                                                >
                                                    {i18n('Sitegeist.Archaeopteryx:Main:dialog.action.apply')}
                                                </Button>
                                            )}
                                        </>
                                    )}
                                    onSubmit={handleSubmit}
                                />
                            </ErrorBoundary>
                        )}
                    </Form>
                )}
            />
        )
    }

    if (valueWasDeleted) {
        setValueWasDeleted(false);
    }

    return null;
};

const DialogWithEmptyValue: React.FC<{
    valid: boolean
    onDelete: () => void
}> = props => {
    const form = useForm();
    const linkTypes = useLinkTypes();
    const {enabledLinkOptions, editorOptions} = useEditorState();
    const filteredLinkTypes = linkTypes.filter(linkType => editorOptions.linkTypes?.[linkType.id] && Object.keys(editorOptions.linkTypes?.[linkType.id]).includes('enabled') ? editorOptions.linkTypes?.[linkType.id].enabled : true);

    return (
        <Field name="linkTypeId" initialValue={linkTypes[0].id}>{({input}) => (
            <Tabs
                lazy
                from={filteredLinkTypes}
                activeItemKey={input.value}
                getKey={linkType => linkType.id}
                renderHeader={({id, TabHeader}) => (
                    <TabHeader
                        options={editorOptions.linkTypes?.[id] as any ?? {}}
                    />
                )}
                renderPanel={linkType => {
                    const {Preview} = linkType;
                    const model = form.getState().values.linkTypeProps?.[linkType.id.split('.').join('_')];

                    return (
                        <Layout.Stack>
                            {props.valid && model ? (
                                <Deletable
                                    onDelete={() => {
                                        props.onDelete();
                                        form.change('linkTypeProps', null);
                                    }}
                                >
                                    <ErrorBoundary>
                                        <Preview
                                            model={form.getState().values.linkTypeProps?.[linkType.id.split('.').join('_')]}
                                            options={editorOptions.linkTypes?.[linkType.id] as any ?? {}}
                                            link={{href: ''}}
                                        />
                                    </ErrorBoundary>
                                </Deletable>
                            ) : null}

                            <LinkEditor
                                key={linkType.id}
                                link={null}
                                linkType={linkType}
                            />

                            {enabledLinkOptions.length && linkType.supportedLinkOptions.length ? (
                                <Settings
                                    enabledLinkOptions={enabledLinkOptions.filter(
                                        option => linkType.supportedLinkOptions.includes(option)
                                    )}
                                />
                            ) : null}
                        </Layout.Stack>
                    )
                }}
                onSwitchTab={input.onChange}
            />
        )}</Field>
    );
}

const DialogWithValue: React.FC<{
    value: ILink
    onDelete: () => void
}> = props => {
    const form = useForm();
    const {enabledLinkOptions, editorOptions} = useEditorState();
    const linkType = useLinkTypeForHref(props.value.href)!;
    const {result} = linkType.useResolvedModel(props.value);
    const {Preview} = linkType;
    const state = form.getState();
    const model = (state.valid
        ? state.values.linkTypeProps?.[linkType.id.split('.').join('_')]
        : result) ?? result;

    return (
        <Field name="linkTypeId" initialValue={linkType.id}>{() => (
            <Tabs
                lazy
                from={[linkType]}
                activeItemKey={linkType.id}
                getKey={linkType => linkType.id}
                renderHeader={({id, TabHeader}) => (
                    <TabHeader
                        options={editorOptions.linkTypes?.[id] as any ?? {}}
                    />
                )}
                renderPanel={linkType => (
                    <Layout.Stack>
                        {model ? (
                            <Deletable
                                onDelete={() => {
                                    props.onDelete();
                                    form.change('linkTypeProps', null);
                                }}
                            >
                                <ErrorBoundary>
                                    <Preview
                                        model={model}
                                        options={editorOptions.linkTypes?.[linkType.id] as any ?? {}}
                                        link={props.value}
                                    />
                                </ErrorBoundary>
                            </Deletable>
                        ) : null}

                        <LinkEditor
                            key={linkType.id}
                            link={props.value}
                            linkType={linkType}
                        />

                        {enabledLinkOptions.length && linkType.supportedLinkOptions.length ? (
                            <Settings
                                initialValue={props.value.options}
                                enabledLinkOptions={enabledLinkOptions.filter(
                                    option => linkType.supportedLinkOptions.includes(option)
                                )}
                            />
                        ) : null}
                    </Layout.Stack>
                )}
            />
        )}</Field>
    );
}
