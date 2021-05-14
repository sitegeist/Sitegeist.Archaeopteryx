import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled, {keyframes} from 'styled-components';

const overlayAppear = keyframes`
    from {
        opacity: 0;
    }
`;

const modalAppear = keyframes`
    from {
        opacity: 0;
        transform: translateX(-50%) translateY(-50%) scale(.94);
    }
`;

const StyledOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, .9);
    animation: ${overlayAppear} .5s ease-in-out;
    z-index: 4;
`;

const StyledModal = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%) scale(1);
    background: #1a1a1a;
    box-shadow: 0 20px 40px rgba(0, 0, 0, .4);
    opacity: 1;
    animation: ${modalAppear} .5s ease-in-out;
    border: 2px solid #3f3f3f;
`;

const StyledDialogTitle = styled.div`
    font-size: 20px;
    line-height: 1.2;
    padding: 16px;
    padding-right: 40px;
`

export const Modal: React.FC<{
    renderTitle(): React.ReactNode
    renderBody(): React.ReactNode
}> = props => ReactDOM.createPortal(
    <StyledOverlay data-ignore_click_outside="true">
        <StyledModal>
            <StyledDialogTitle>
                {props.renderTitle()}
            </StyledDialogTitle>

            {props.renderBody()}
        </StyledModal>
    </StyledOverlay>,
    document.body
);