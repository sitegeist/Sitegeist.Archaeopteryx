import * as React from 'react';

import styled from "styled-components";
import { parsePhoneNumber} from 'libphonenumber-js/max'

import {IconButton} from '@neos-project/react-ui-components';
import { ErrorBoundary } from '@sitegeist/archaeopteryx-error-handling';
import { useLinkTypeForHref } from '@sitegeist/archaeopteryx-core/src/domain';

const PreviewContainer = styled.div`
    position: absolute;
    top: 105%;
    left: 0;
    z-index: 10;
    width: 420px;
    display: grid;
    grid-template-columns: 1fr 40px;
    justify-content: stretch;
    border: 1px solid #3f3f3f;
    background: #323232;
`;

const StyledIconButton = styled(IconButton)`
    height: 100%;
`;

const getModelByLinkType = (linkType: string, cursorLink: string) => {
    if(linkType === 'Sitegeist.Archaeopteryx:Node') {
        return {nodeId: cursorLink.startsWith('node://')
            ? cursorLink.slice('node://'.length)
            : undefined};
    }

    if(linkType === 'Sitegeist.Archaeopteryx:PhoneNumber') {
        const {nationalNumber, countryCallingCode} = parsePhoneNumber(cursorLink.replace('tel:', ''));

        if(!nationalNumber || !countryCallingCode) return
        return {phoneNumber: nationalNumber, countryCallingCode: `+${countryCallingCode}`}
    }

    if(linkType === 'Sitegeist.Archaeopteryx:Asset') {
        return {identifier: cursorLink.startsWith('asset://')
            ? cursorLink.slice('asset://'.length)
            : undefined};
    }

    if(linkType === 'Sitegeist.Archaeopteryx:Web') {
        const match = cursorLink.match(/^(https?):\/\/(.+)$/i);
        if (match) {
            const [, protocol, urlWithoutProtocol] = match;
            return {protocol, urlWithoutProtocol};
        }
    }

    if(linkType === 'Sitegeist.Archaeopteryx:MailTo') {
        return {recipient: cursorLink.startsWith('mailto:')
            ? cursorLink.slice('mailto:'.length).replace('?', '')
            : undefined};
    }

    if(linkType === 'Sitegeist.Archaeopteryx:CustomLink') {
        return {customLink: cursorLink};
    }

    return
}

type LinkButtonPreviewProps = {
    cursorLink?: string;
    onClick: () => void;
}

export const LinkButtonPreview = ({ cursorLink, onClick }: LinkButtonPreviewProps) => {

    const [show, setShow] = React.useState(true)

    const linkType = useLinkTypeForHref(cursorLink ?? '');

    const handleClick = () => {
        setShow(false)
        onClick()
    }

    React.useEffect(() => {
        setShow(true)
    }, [cursorLink])

    if(!cursorLink || !linkType || !show) return null;
    const model = getModelByLinkType(linkType.id, cursorLink);


    return (
        <PreviewContainer>
            <ErrorBoundary>
                <linkType.Preview
                    model={model}
                    options={{}}
                    link={{href: cursorLink}}
                />
            </ErrorBoundary>
            <StyledIconButton icon="pen" onClick={handleClick}/>
        </PreviewContainer>
    );
};
