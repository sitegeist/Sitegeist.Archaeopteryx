import * as React from 'react';
interface Props {
    value: string;
    onChange: (value: string) => void;
    onClear: () => void;
}
export declare const SearchInput: React.FC<Props>;
export {};
