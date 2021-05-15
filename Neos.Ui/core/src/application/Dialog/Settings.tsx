import * as React from 'react';
import {Field} from 'react-final-form';

import {TextInput, CheckBox} from '@neos-project/react-ui-components';

import {Layout} from '../../presentation';
import {useI18n} from '@sitegeist/archaeopteryx-neos-bridge';

interface Props {
    initialValue?: {
        anchor?: string
        title?: string
        targetBlank?: boolean
        relNoFollow?: boolean
    }
}

export const Settings: React.FC<Props> = props => {
    const i18n = useI18n();

    return (
        <Layout.Columns>
            <Field<string>
                name="options.anchor"
                initialValue={props.initialValue?.anchor}
                >
                {({input}) => (
                    <label>
                        {i18n('Sitegeist.Archaeopteryx:Main:options.label.anchor')}:
                        <TextInput type="text" {...input}/>
                    </label>
                )}
            </Field>
            <Field<string>
                name="options.title"
                initialValue={props.initialValue?.title}
                >
                {({input}) => (
                    <label>
                        {i18n('Sitegeist.Archaeopteryx:Main:options.label.title')}:
                        <TextInput type="text" {...input}/>
                    </label>
                )}
            </Field>
            <Field<boolean>
                type="checkbox"
                name="options.targetBlank"
                initialValue={Boolean(props.initialValue?.targetBlank)}
                >
                {({input}) => (
                    <label>
                        <CheckBox onChange={input.onChange} isChecked={input.checked}/>
                        {i18n('Sitegeist.Archaeopteryx:Main:options.label.targetBlank')}
                    </label>
                )}
            </Field>
            <Field<boolean>
                type="checkbox"
                name="options.relNoFollow"
                initialValue={Boolean(props.initialValue?.relNoFollow)}
                >
                {({input}) => (
                    <label>
                        <CheckBox onChange={input.onChange} isChecked={input.checked}/>
                        {i18n('Sitegeist.Archaeopteryx:Main:options.label.noFollow')}
                    </label>
                )}
            </Field>
        </Layout.Columns>
    );
}