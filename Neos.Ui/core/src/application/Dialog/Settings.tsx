import * as React from 'react';
import {Field} from 'react-final-form';

import {TextInput, CheckBox} from '@neos-project/react-ui-components';

import {Grid} from '../../presentation';

interface Props {
    initialValue?: {
        anchor?: string
        title?: string
        targetBlank?: boolean
        relNoFollow?: boolean
    }
}

export const Settings: React.FC<Props> = props => {
    return (
        <Grid>
            <Field<string>
                name="options.anchor"
                initialValue={props.initialValue?.anchor}
                >
                {({input}) => (
                    <label>
                        Anchor:
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
                        Title:
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
                        Open in new Window
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
                        No Follow
                    </label>
                )}
            </Field>
        </Grid>
    );
}