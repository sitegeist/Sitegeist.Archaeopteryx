import * as React from 'react';
import { FieldProps, FieldRenderProps } from 'react-final-form';
export declare function Field<FieldValue = any, RP extends FieldRenderProps<FieldValue, T> = FieldRenderProps<FieldValue, HTMLElement>, T extends HTMLElement = HTMLElement>(props: FieldProps<FieldValue, RP, T>): React.ReactElement;
export declare const FieldGroup: React.FC<{
    prefix: string;
}>;
