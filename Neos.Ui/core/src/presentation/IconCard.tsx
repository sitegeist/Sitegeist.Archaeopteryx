import * as React from 'react';
import styled, {css} from 'styled-components';

import {Icon} from '@neos-project/react-ui-components';

const Container = styled.div`
    display: grid;
    grid-gap: 8px;
    grid-template-columns: 20px 1fr;
    grid-template-rows: repeat(2, 1fr);
    background-color: #141414;
    padding: 8px 16px;
`;

const IconWrapper = styled.span`
    display: flex;
    justify-content: center;
    align-items: center;
    grid-column: 1 / span 1;
    grid-row: 1 / span ${(props: {span: number}) => props.span};
`;

const baseFontStyle = css`
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 1;
`;

const Title = styled.span`
    ${baseFontStyle}
    grid-column: 2 / span 1;
    grid-row: 1 / span ${(props: {span: number}) => props.span};
    font-size: 14px;
    color: #FFF;
`;

const SubTitle = styled.span`
    ${baseFontStyle}
    font-size: 12px;
    color: #999;
    grid-column: 1 / span 2;
    grid-row: 2 / span 1;
`;

interface Props {
    icon: string;
    title: string;
    subTitle?: string;
}

export const IconCard: React.FC<Props> = props => {
    return (
        <Container>
            <IconWrapper span={props.subTitle ? 1 : 2}>
                <Icon icon={props.icon}/>
            </IconWrapper>
            <Title span={props.subTitle ? 1 : 2}>
                {props.title}
            </Title>
            <SubTitle>
                {props.subTitle}
            </SubTitle>
        </Container>
    );
}