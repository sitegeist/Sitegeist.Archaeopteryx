import * as React from 'react';
import {Field} from 'react-final-form';

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
        <div>
            <Field<string>
                name="anchor"
                initialValue={props.initialValue?.anchor}
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
                initialValue={props.initialValue?.title}
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
                initialValue={props.initialValue?.targetBlank ? 'true' : ''}
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
                initialValue={props.initialValue?.relNoFollow ? 'true' : ''}
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
        </div>
    );
}