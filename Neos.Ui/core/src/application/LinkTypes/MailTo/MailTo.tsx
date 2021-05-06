import * as React from 'react';

import {LinkType, ILink, Process, Field} from '../../../domain';

interface Props {
    value: null | {
        recipient: string
        subject?: string
        cc?: string
        bcc?: string
        body?: string
    }
}

export const MailTo = new class extends LinkType<Props> {
    public readonly id = 'Sitegeist.Archaeopteryx:MailTo';

    public readonly isSuitableFor = (link: ILink) =>
        link.href.startsWith('mailto:');

    public readonly useResolvedProps = (link?: ILink) => {
        if (link === undefined) {
            return Process.success({value: null});
        }

        const url = new URL(link.href);

        return Process.success({
            value: {
                recipient: url.pathname,
                subject: url.searchParams.get('subject') ?? undefined,
                cc: url.searchParams.get('cc') ?? undefined,
                bcc: url.searchParams.get('bcc') ?? undefined,
                body: url.searchParams.get('body') ?? undefined
            }
        });
    };

    public readonly convertPropsToLink = (props: Props) => {
        if (props.value === null) {
            return null;
        }

        const url = new URL(`mailto:${props.value.recipient}`);

        if (props.value.subject) {
            url.searchParams.set('subject', props.value.subject)
        }

        if (props.value.cc) {
            url.searchParams.set('cc', props.value.cc)
        }

        if (props.value.bcc) {
            url.searchParams.set('bcc', props.value.bcc)
        }

        if (props.value.body) {
            url.searchParams.set('body', props.value.body)
        }

        return {href: url.toString()};
    };

    public readonly getStaticIcon = () => (
        <div>MAILTO</div>
    );

    public readonly getIcon = () => (
        <div>MAILTO</div>
    );

    public readonly getStaticTitle = () => 'MAILTO'

    public readonly getTitle = () => 'MAILTO'

    public readonly getLoadingPreview = () => (
        <div>MAILTO PREVIEW</div>
    );

    public readonly getPreview = (props: Props) => (
        <div>MAILTO PREVIEW</div>
    );

    public readonly getLoadingEditor = () => (
        <div>MAILTO EDITOR</div>
    );

    public readonly getEditor = (props: Props) => {
        return (
            <div>
                <Field<string>
                    name="value.recipient"
                    initialValue={props.value?.recipient}
                    validate={value => {
                        if (!value) {
                            return 'recipient is required';
                        }
                    }}
                >{({input, meta}) => (
                        <div>
                            <label>
                                Recipient:
                                <input type="text" {...input}/>
                            </label>
                            {meta.error}
                        </div>
                )}</Field>
                <Field<string>
                    name="value.cc"
                    initialValue={props.value?.cc}
                >{({input, meta}) => (
                    <div>
                        <label>
                            CC:
                            <input type="text" {...input}/>
                        </label>
                        {meta.error}
                    </div>
                )}</Field>
                <Field<string>
                    name="value.bcc"
                    initialValue={props.value?.bcc}
                >{({input, meta}) => (
                    <div>
                        <label>
                            BCC:
                            <input type="text" {...input}/>
                        </label>
                        {meta.error}
                    </div>
                )}</Field>
                <Field<string>
                    name="value.body"
                    initialValue={props.value?.body}
                >{({input, meta}) => (
                    <div>
                        <label>
                            Body:
                            <textarea {...input}/>
                        </label>
                        {meta.error}
                    </div>
                )}</Field>
            </div>
        );
    };
}
