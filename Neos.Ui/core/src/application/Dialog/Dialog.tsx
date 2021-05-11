import * as React from 'react';
import {Form, useForm} from 'react-final-form';
import {useKey} from 'react-use';

import {Button} from '@neos-project/react-ui-components';

import {useI18n} from '@sitegeist/archaeopteryx-neos-bridge';

import {ILink, ILinkOptions, useEditorState, useEditorTransactions, useLinkTypes, useLinkTypeForHref, Field, ILinkType} from '../../domain';
import {Form as StyledForm, Modal, Tabs, Deletable} from '../../presentation';

import {LinkEditor} from './LinkEditor';
import {Settings} from './Settings';

export const Dialog: React.FC = () => {
    const i18n = useI18n();
    const linkTypes = useLinkTypes();
    const {dismiss, apply} = useEditorTransactions();
    const {isOpen, value} = useEditorState();
    const handleSubmit = React.useCallback((values: any) => {
        const linkType = linkTypes.find(linkType => linkType.id === values.linkTypeId);
        if (linkType) {
            const props = values.linkTypeProps?.[linkType.id.split('.').join('_')];

            if (props) {
                const link = {
                    ...linkType.convertModelToLink(props),
                    options: values.options
                };
                apply(link);
            }
        }
    }, [linkTypes]);

    useKey('Escape', dismiss);

    if (isOpen) {
        return (
            <Modal
                renderTitle={() => (
                    <div>{i18n('Sitegeist.Archaeopteryx:Main:dialog.title')}</div>
                )}
                renderBody={() => (
                    <Form<ILinkOptions> onSubmit={handleSubmit}>
                        {({handleSubmit, valid, dirty}) => (
                            <StyledForm
                                renderBody={() => value.transient === null ? (
                                    <DialogWithEmptyValue />
                                ) : (
                                    <DialogWithValue
                                        value={value.transient!}
                                    />
                                )}
                                renderActions={() => (
                                    <>
                                        <Button onClick={dismiss}>
                                            {i18n('Sitegeist.Archaeopteryx:Main:dialog.action.cancel')}
                                        </Button>
                                        <Button
                                            style="success"
                                            type="submit"
                                            disabled={!valid || !dirty}
                                        >
                                            {i18n('Sitegeist.Archaeopteryx:Main:dialog.action.apply')}
                                        </Button>
                                    </>
                                )}
                                onSubmit={handleSubmit}
                            />
                        )}
                    </Form>
                )}
            />
        )
    }

    return null;
};

const DialogWithEmptyValue: React.FC = () => {
    const linkTypes = useLinkTypes();
    const {enableOptions, editorOptions} = useEditorState();

    return (
        <Field name="linkTypeId" initialValue={linkTypes[0].id}>{({input}) => (
            <Tabs
                lazy
                from={linkTypes}
                activeItemKey={input.value}
                getKey={linkType => linkType.id}
                renderHeader={({id, TabHeader}) => (
                    <TabHeader
                        options={editorOptions[id] as any ?? {}}
                    />
                )}
                renderPanel={linkType => (
                    <div style={{ display: 'grid', gap: '16px' }}>
                        <LinkEditor
                            key={linkType.id}
                            link={null}
                            linkType={linkType}
                        />

                        {enableOptions && linkType.enableLinkOptionsWhenPossible ? (
                            <Settings/>
                        ) : null}
                    </div>
                )}
                onSwitchTab={input.onChange}
            />
        )}</Field>
    );
}

const DialogWithValue: React.FC<{
    value: ILink
}> = props => {
    const form = useForm();
    const {unset} = useEditorTransactions();
    const {enableOptions, editorOptions} = useEditorState();
    const linkType = useLinkTypeForHref(props.value.href)!;
    const {result} = linkType.useResolvedModel(props.value);
    const {Preview} = linkType;
    const state = form.getState();
    const model = state.valid
        ? state.values.linkTypeProps?.[linkType.id.split('.').join('_')]
        : result;

    console.log(editorOptions);

    return (
        <Field name="linkTypeId" initialValue={linkType.id}>{() => (
            <Tabs
                lazy
                from={[linkType]}
                activeItemKey={linkType.id}
                getKey={linkType => linkType.id}
                renderHeader={({id, TabHeader}) => (
                    <TabHeader
                        options={editorOptions[id] as any ?? {}}
                    />
                )}
                renderPanel={linkType => (
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {model ? (
                            <Deletable
                                onDelete={() => {
                                    unset();
                                    form.change('linkTypeProps', null);
                                }}
                            >
                                <Preview
                                    model={model}
                                    options={editorOptions[linkType.id] as any ?? {}}
                                    link={props.value}
                                />
                            </Deletable>
                        ) : null}

                        <LinkEditor
                            key={linkType.id}
                            link={props.value}
                            linkType={linkType}
                        />

                        {enableOptions && linkType.enableLinkOptionsWhenPossible ? (
                            <Settings initialValue={props.value.options}/>
                        ) : null}
                    </div>
                )}
            />
        )}</Field>
    );
}
