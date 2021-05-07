import styled from 'styled-components';

export const CardTitle = styled.span`
    display: flex;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 1;
    grid-column: 2 / span 1;
    grid-row: 1 / span ${(props: { span: number; }) => props.span};
    font-size: 14px;
    color: #FFF;
`;
