import * as React from 'react';
import {Form, useForm} from 'react-final-form';
import {useKey} from 'react-use';

import {Button} from '@neos-project/react-ui-components';

import {ILink, ILinkOptions, useEditorState, useEditorTransactions, useLinkTypes, useLinkTypeForHref, Field, ILinkType} from '../../domain';
import {Form as StyledForm, Modal, Tabs, Deletable} from '../../presentation';

import {LinkEditor} from './LinkEditor';
import {Settings} from './Settings';

export const Dialog: React.FC = () => {
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
                    <div>Sitegeist.Archaeopteryx</div>
                )}
                renderBody={() => (
                    <Form<ILinkOptions> onSubmit={handleSubmit}>
                        {({handleSubmit, valid, dirty}) => (
                            <StyledForm
                                renderBody={() => value.transient === null ? (
                                    <DialogWithEmptyValue/>
                                ) : (
                                    <DialogWithValue
                                        value={value.transient!}
                                    />
                                )}
                                renderActions={() => (
                                    <>
                                        <Button onClick={dismiss}>
                                            Cancel
                                        </Button>
                                        <Button
                                            style="success"
                                            type="submit"
                                            disabled={!valid || !dirty}
                                        >
                                            Apply
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

    return (
        <Field name="linkTypeId" initialValue={linkTypes[0].id}>{({input}) => (
            <Tabs
                lazy
                from={linkTypes}
                activeItemKey={input.value}
                getKey={linkType => linkType.id}
                renderHeader={({StaticIcon}) => (<StaticIcon/>)}
                renderPanel={linkType => (
                    <div style={{ display: 'grid', gap: '16px' }}>
                        <LinkEditor
                            key={linkType.id}
                            link={null}
                            linkType={linkType}
                        />

                        <Settings/>
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
    const linkType = useLinkTypeForHref(props.value.href)!;
    const {result} = linkType.useResolvedModel(props.value);
    const {Preview} = linkType;
    const state = form.getState();
    const model = state.valid
        ? state.values.linkTypeProps?.[linkType.id.split('.').join('_')]
        : result;

    return (
        <Field name="linkTypeId" initialValue={linkType.id}>{() => (
            <Tabs
                lazy
                from={[linkType]}
                activeItemKey={linkType.id}
                getKey={linkType => linkType.id}
                renderHeader={({StaticIcon}) => (<StaticIcon/>)}
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
                                    link={props.value}
                                />
                            </Deletable>
                        ) : null}

                        <LinkEditor
                            key={linkType.id}
                            link={props.value}
                            linkType={linkType}
                        />

                        <Settings initialValue={props.value.options}/>
                    </div>
                )}
            />
        )}</Field>
    );
}


function useLastNonNull<V>(value: null | V) {
    const valueRef = React.useRef(value);

    if (value !== null) {
        valueRef.current = value;
    }

    return valueRef.current;
}

const LinkTypeIcon: React.FC<{
    link: ILink
    linkType: ILinkType
}> = props => {
    const {StaticIcon, Icon} = props.linkType
    const {result} = props.linkType.useResolvedModel(props.link);
    const model = useLastNonNull(result);

    if (model) {
        return (
            <Icon
                model={model}
                link={props.link}
            />
        );
    } else {
        return (
            <StaticIcon
                link={props.link}
            />
        );
    }
}