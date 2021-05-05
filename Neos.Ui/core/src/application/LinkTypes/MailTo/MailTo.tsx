import * as React from 'react';
import {Form, Field} from 'react-final-form';

import {LinkType, ILink, useEditorTransactions, Process} from '../../../domain';

interface IMailToLink {
    recipient: string
    subject?: string
    cc?: string
    bcc?: string
    body?: string
}

function convert(mailToLink: IMailToLink): string {
    const url = new URL(`mailto:${mailToLink.recipient}`);

    if (mailToLink.subject) {
        url.searchParams.set('subject', mailToLink.subject)
    }

    if (mailToLink.cc) {
        url.searchParams.set('cc', mailToLink.cc)
    }

    if (mailToLink.bcc) {
        url.searchParams.set('bcc', mailToLink.bcc)
    }

    if (mailToLink.body) {
        url.searchParams.set('body', mailToLink.body)
    }

    return url.toString();
}

interface Props {
    value: null | IMailToLink
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
        const {update} = useEditorTransactions();
        const handleSubmit = React.useCallback((value: IMailToLink) => {
            update({href: convert(value)});
        }, []);

        return (
            <Form initialValues={props.value} onSubmit={handleSubmit}>
                {({handleSubmit}) => (
                    <form onSubmit={handleSubmit}>
                        <Field<string>
                            name="recipient"
                            validate={value => {
                                if (!value) {
                                    return 'recipient is required';
                                }
                            }}
                            >
                            {({input, meta}) => (
                                <div>
                                    <label>
                                        Recipient:
                                        <input type="text" {...input}/>
                                    </label>
                                    {meta.error}
                                </div>
                            )}
                        </Field>
                        <Field<string> name="cc">
                            {({input, meta}) => (
                                <div>
                                    <label>
                                        CC:
                                        <input type="text" {...input}/>
                                    </label>
                                    {meta.error}
                                </div>
                            )}
                        </Field>
                        <Field<string> name="bcc">
                            {({input, meta}) => (
                                <div>
                                    <label>
                                        BCC:
                                        <input type="text" {...input}/>
                                    </label>
                                    {meta.error}
                                </div>
                            )}
                        </Field>
                        <Field<string> name="body">
                            {({input, meta}) => (
                                <div>
                                    <label>
                                        Body:
                                        <textarea {...input}/>
                                    </label>
                                    {meta.error}
                                </div>
                            )}
                        </Field>
                        <button type="submit">Apply</button>
                    </form>
                )}
            </Form>
        );
    };
}
