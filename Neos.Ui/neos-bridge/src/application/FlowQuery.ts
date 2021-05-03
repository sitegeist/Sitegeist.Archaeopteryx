import {FlowQuery} from '../domain/Backend';
import {ContextPath} from '../domain/ContentRepository/ContextPath';

import backend from '@neos-project/neos-ui-backend-connector';

export function q(context: ContextPath | ContextPath[]): FlowQuery {
    const {q} = backend.get();
    return new FlowQuery(q(
        Array.isArray(context)
            ? context.map(cp => cp.toString())
            : context.toString()
    ));
}