import * as React from 'react';
import styled from 'styled-components';

import {TextInput, Icon, IconButton} from '@neos-project/react-ui-components';

const SearchIcon = styled(Icon)`
    position: absolute;
    top: 50%;
    left: 21px;
    transform: translate(-50%, -50%);
`;

const ClearIcon = styled(IconButton)`
    position: absolute;
    top: 0;
    right: 0;
    color: #000;
`;

const StyledTextInput = styled(TextInput)`
    padding-left: 42px;

    &:focus {
        background: #3f3f3f;
        color: #fff;
    }
`;

const SearchInputContainer = styled.div`
    position: relative;
`;

interface Props {
    value: string
    onChange: (value: string) => void
    onClear: () => void
}

export const SearchInput: React.FC<Props> = props => {
    return (
        <SearchInputContainer>
            <SearchIcon icon="search"/>
            <StyledTextInput
                type="search"
                value={props.value}
                placeholder={'Search'}
                onChange={props.onChange}
            />
            {props.value && (
                <ClearIcon
                    icon="times"
                    onClick={props.onClear}
                />
            )}
        </SearchInputContainer>
    )
};