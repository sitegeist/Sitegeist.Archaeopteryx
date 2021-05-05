import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility';
import {IGlobalRegistry} from '@sitegeist/archaeopteryx-neos-bridge';

import {WebLink} from './WebLink';
import {Node} from './Node';
import {Asset} from './Asset';
import {MailTo} from './MailTo';

export function registerLinkTypes(globalRegistry: IGlobalRegistry): void {
    const linkTypeRegistry = new SynchronousRegistry(`
        # Sitegeist.Archaeopteryx LinkType Registry
    `);

    linkTypeRegistry.set(WebLink.id, WebLink);
    linkTypeRegistry.set(Node.id, Node);
    linkTypeRegistry.set(Asset.id, Asset);
    linkTypeRegistry.set(MailTo.id, MailTo);

    globalRegistry.set('@sitegeist/archaeopteryx/link-types', linkTypeRegistry);
}