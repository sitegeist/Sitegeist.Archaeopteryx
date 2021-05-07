import * as React from 'react';
import {Dialog as NeosDialog, Button} from '@neos-project/react-ui-components';
import {Form, useForm} from 'react-final-form';

import {ILink, ILinkOptions, useEditorState, useEditorTransactions, useLinkTypes, useLinkTypeForHref, Field, ILinkType} from '../../domain';
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
                const link = linkType.convertModelToLink(props);
                apply(link);
            }
        }
    }, [linkTypes]);

    return (
        <NeosDialog
            title="Sitegeist.Archaeopteryx"
            isOpen={isOpen}
            style="jumbo"
            onRequestClose={() => {}}
        >
            <Form<ILinkOptions> onSubmit={handleSubmit}>
                {({handleSubmit, valid, dirty}) => (
                    <form onSubmit={handleSubmit}>
                        {value.transient === null ? (
                            <DialogWithEmptyValue/>
                        ) : (
                            <DialogWithValue
                                value={value.transient!}
                            />
                        )}

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
                    </form>
                )}
            </Form>
        </NeosDialog>
    );
};

const DialogWithEmptyValue: React.FC = () => {
    const linkTypes = useLinkTypes();

    return (
        <Field name="linkTypeId" initialValue={linkTypes[0].id}>{({input}) => (
            <div>
                {linkTypes.map(({id, StaticIcon}) => (
                    <Button
                        isActive={id === input.value}
                        key={id}
                        onClick={() => input.onChange(id)}
                    >
                        <StaticIcon/>
                    </Button>
                ))}

                <div>
                    <LinkEditor
                        key={input.value}
                        link={null}
                        linkType={linkTypes.find(linkType => linkType.id === input.value)!}
                    />
                </div>
            </div>
        )}</Field>
    );
}

const DialogWithValue: React.FC<{
    value: ILink
}> = props => {
    const form = useForm();
    const {unset} = useEditorTransactions();
    const linkType = useLinkTypeForHref(props.value.href)!;
    const [showSettings, setShowSettings] = React.useState(false);

    return (
        <Field name="linkTypeId" initialValue={linkType.id}>{() => (
            <div>
                <Button
                    isActive={!showSettings}
                    onClick={() => setShowSettings(false)}
                >
                    <LinkTypeIcon
                        linkType={linkType}
                        link={props.value}
                    />
                </Button>
                <Button
                    isActive={showSettings}
                    onClick={() => setShowSettings(true)}
                >
                    SETTINGS
                </Button>

                <div>
                    <Button
                        onClick={() => {
                            unset();
                            form.change('linkTypeProps', null);
                        }}
                    >
                        Delete
                    </Button>
                </div>

                <div>
                    <div hidden={!showSettings}>
                        <Settings initialValue={props.value.options}/>
                    </div>
                    <div hidden={showSettings}>
                        <LinkEditor
                            key={linkType.id}
                            link={props.value}
                            linkType={linkType}
                        />
                    </div>
                </div>
            </div>
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