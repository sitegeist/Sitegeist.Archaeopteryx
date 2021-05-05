import * as React from 'react';

import {Process, LinkType, ILink, useEditorTransactions, useEditorValue} from '../../../domain';

interface Props {
    value: null | {
        protocol: 'http' | 'https'
        urlWithoutProtocol: string
    }
}

export const Web = new class extends LinkType<Props> {
    public readonly id = 'Sitegeist.Archaeopteryx:Web';

    public readonly isSuitableFor = (link: ILink) => {
        const isHttp = link.href.startsWith('http://');
        const isHttps = link.href.startsWith('https://');

        return isHttp || isHttps;
    }

    public readonly useResolvedProps = (link?: ILink) => {
        if (link === undefined) {
            return Process.success({value: null});
        }

        const matches = link.href.match(/^(https?):\/\/(.*)$/);
        if (matches) {
            const [, protocol, urlWithoutProtocol] = matches;

            return Process.success({
                value: {
                    protocol: protocol as 'http' | 'https',
                    urlWithoutProtocol
                }
            });
        }

        return Process.error(
            this.error(`Cannot handle href "${link.href}".`)
        );
    }

    public readonly getStaticIcon = () => (
        <div>ICON</div>
    );

    public readonly getIcon = () => (
        <div>ICON</div>
    );

    public readonly getStaticTitle = () => {
        return 'Web Link';
    }

    public readonly getTitle = (props: Props) => {
        if (props.value === null) {
            return this.getStaticTitle();
        }

        const isSecure = props.value.protocol === 'https';

        if (isSecure) {
            return 'Web Link (secure)';
        } else {
            return 'Web Link (not secure)';
        }
    }

    public readonly getLoadingPreview = () => (
        <div>{this.getStaticTitle()}</div>
    );

    public readonly getPreview = (props: Props) => (
        <div>{this.getTitle(props)}</div>
    );

    public readonly getLoadingEditor = () => (
        <div>{this.getStaticTitle()}</div>
    );

    public readonly getEditor = () => {
        const {value} = useEditorValue();
        const {update} = useEditorTransactions();
        const onChange = React.useCallback(
            (ev: React.SyntheticEvent) =>
                update({href: (ev.target as HTMLInputElement).value}),
            [update]
        );

        return (
            <input type="text" value={value?.href ?? ''} onChange={onChange}/>
        );
    };
}
