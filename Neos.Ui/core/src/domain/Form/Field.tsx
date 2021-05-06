import * as React from 'react';
import {Field as FinalFormField, FieldProps, FieldRenderProps} from 'react-final-form';

const FieldGroupContext = React.createContext<null | string>(null);

export function Field<
    FieldValue = any,
    RP extends FieldRenderProps<FieldValue, T> = FieldRenderProps<
        FieldValue,
        HTMLElement
    >,
    T extends HTMLElement = HTMLElement
>(props: FieldProps<FieldValue, RP, T>): React.ReactElement {
    const groupPrefix = React.useContext(FieldGroupContext);
    const name = groupPrefix !== null
        ? `${groupPrefix}.${props.name}`
        : props.name;

    return (<FinalFormField<FieldValue, RP, T> {...props} name={name}/>);
};

export const FieldGroup: React.FC<{
    prefix: string
}> = props => {
    return (
        <FieldGroupContext.Provider value={props.prefix}>
            {props.children}
        </FieldGroupContext.Provider>
    );
};