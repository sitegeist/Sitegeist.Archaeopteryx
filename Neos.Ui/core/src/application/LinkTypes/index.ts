import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility';
import {IGlobalRegistry} from '@sitegeist/archaeopteryx-neos-bridge';

import {WebLink} from './WebLink';
import {NodeTree} from './NodeTree';
import {Asset} from './Asset';
import {MailTo} from './MailTo';

export function registerLinkTypes(globalRegistry: IGlobalRegistry): void {
    const linkTypeRegistry = new SynchronousRegistry(`
        # Sitegeist.Archaeopteryx LinkType Registry
    `);

    linkTypeRegistry.set(WebLink.id, WebLink);
    linkTypeRegistry.set(NodeTree.id, NodeTree);
    linkTypeRegistry.set(Asset.id, Asset);
    linkTypeRegistry.set(MailTo.id, MailTo);

    globalRegistry.set('@sitegeist/archaeopteryx/link-types', linkTypeRegistry);
}