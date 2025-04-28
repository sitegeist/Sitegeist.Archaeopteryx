import * as React from 'react';
import {FallbackProps, ErrorBoundary as ReactErrorBoundary} from 'react-error-boundary';
import {VError} from '@sitegeist/archaeopteryx-error-handling';

import {Alert, Trace} from '../presentation';

const ErrorFallback: React.FC<FallbackProps> = props => {
    const isDev = Boolean(document.querySelector('[data-env^="Development"]'));

    return (
        <Alert title={`${props.error.name}`}>
            <div>
                {props.error.message}
            </div>
            {props.error instanceof VError ? (
                <RecursiveCauseChain error={props.error} level={0}/>
            ) : null}
            {isDev ? (
                <Trace title="Stacktrace">
                    {props.error.stack}
                </Trace>
            ) : null}
        </Alert>
    );
}

const RecursiveCauseChain: React.FC<{
    error: undefined | Error
    level: number
}> = props => props.error ? (
    <Trace title={`Cause: ${props.error.name}`}>
        {props.error.message}
        {props.error instanceof VError && props.level < 10 ? (
            <RecursiveCauseChain error={props.error.cause()} level={props.level + 1}/>
        ) : null}
    </Trace>
) : null;

function logError(error: Error, info: { componentStack: string }) {
    console.warn(`[Sitegeist.Archaeopteryx::${error.name}]: An error occurred.`);
    console.error(`[Sitegeist.Archaeopteryx::${error.name}]: `, error);
    console.error(`[Sitegeist.Archaeopteryx::${error.name}]: Component Stack:`, info.componentStack);
}

export const ErrorBoundary: React.FC = props => (
    <ReactErrorBoundary fallbackRender={ErrorFallback} onError={logError}>
        {props.children}
    </ReactErrorBoundary>
);
