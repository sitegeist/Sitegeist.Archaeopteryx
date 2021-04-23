import * as React from 'react';

import {ILinkType, ILinkTypeEditor, ILinkTypeIcon, ILinkTypeIsSatisfiedBy, ILinkTypePreview, ILinkTypeTitle} from '../../../domain';

interface Props {
    uri: string
    isSecure: boolean
}

const Icon: ILinkTypeIcon = () => <div>ICON</div>;
const Title: ILinkTypeTitle = props =>
    `WebLink ${props.uri.startsWith('https://') ? '(secure)' : '(not secure)'}`;
const Preview: ILinkTypePreview = () => <div>PREVIEW</div>;
const Editor: ILinkTypeEditor = () => <div>EDITOR</div>;
const isSatisfiedBy: ILinkTypeIsSatisfiedBy = ({uri}) => {
    const isHttp = uri.startsWith('http://');
    const isHttps = uri.startsWith('https://');

    return isHttp || isHttps;
};

export const WebLink: ILinkType = {
    Icon,
    Title,
    Preview,
    Editor,
    isSatisfiedBy
};