import * as React from 'react';
import { useEffect, useRef } from 'react';

import {useGlobalRegistry} from '@sitegeist/archaeopteryx-neos-bridge';
import styled from 'styled-components';

interface Props {
    assetIdentifier: null | string
    onSelectAsset: (assetIdentifier: string) => void
}

const Container = styled.div`
    width: calc(-80px - 64px + 100vw);
    max-width: 1260px;

    & > div {
        padding: 0;
    }

    & > iframe {
        width: calc(100vw - 160px);
        max-width: 100%;
        height: calc(100vh - 580px);
        position: relative;
    }
`;

export const MediaBrowser: React.FC<Props> = props => {
    const globalRegistry = useGlobalRegistry();
    const containerRef = useRef<HTMLDivElement>(null);
    const selectionRef = useRef<HTMLElement>(null);

    const secondaryEditorsRegistry = globalRegistry?.get('inspector')?.get('secondaryEditors') as {
        get: (identifier: string) => {
            component: React.ComponentType<any>
        }
    };
    const { component: MediaSelectionScreenComponent } = secondaryEditorsRegistry?.get('Neos.Neos/Inspector/Secondary/Editors/MediaSelectionScreen');

    // The standard MediaBrowser of Neos uses an iframe and requires some styles to be applied to the iframe content
    const iframe = (containerRef.current?.querySelector('& > iframe') as HTMLIFrameElement);

    useEffect(() => {
        iframe?.addEventListener('load', (ev) => {
            const iframe = (ev.target as HTMLIFrameElement).contentDocument;
            if (iframe) {
                iframe.body.style.overflowX = 'hidden';
                iframe.body.style.padding = '0';
                iframe.querySelector('form > .neos-footer')?.remove();
                iframe.querySelectorAll('input, select, textarea')?.forEach(input => {
                    (input as HTMLInputElement).readOnly = true;
                });
            }
        });
    }, [iframe]);

    return (
        <Container ref={containerRef}>
            <MediaSelectionScreenComponent
                ref={selectionRef}
                assetIdentifier={props.assetIdentifier}
                onComplete={props.onSelectAsset}
                constraints={{ mediaTypes: [] }}
            />
        </Container>
    );
};
