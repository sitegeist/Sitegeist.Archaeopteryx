import * as React from 'react';
import {Form, Field} from 'react-final-form';

import {LinkType, ILinkTypeProps, useEditorTransactions, useEditorValue} from '../../../domain';

interface IMailToLink {
    recipient: string
    subject?: string
    cc?: string
    bcc?: string
    body?: string
}

function useResolvedValue(): null | IMailToLink {
    const {value} = useEditorValue();
    if (value && value.startsWith('mailto:')) {
        const url = new URL(value);

        return {
            recipient: url.pathname,
            subject: url.searchParams.get('subject') ?? undefined,
            cc: url.searchParams.get('cc') ?? undefined,
            bcc: url.searchParams.get('bcc') ?? undefined,
            body: url.searchParams.get('body') ?? undefined
        };
    }

    return null;
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

export const MailTo = new class extends LinkType {
    public readonly id = 'Sitegeist.Archaeopteryx:MailTo';

    public readonly isSuitableFor = (props: ILinkTypeProps) => {
        return Boolean(props.link?.uri.startsWith('mailto:'));
    }

    public readonly getIcon = () => (
        <div>MAILTO</div>
    );

    public readonly getTitle = () => 'MAILTO'

    public readonly getPreview = (props: ILinkTypeProps) => (
        <div>MAILTO PREVIEW</div>
    );

    public readonly getEditor = () => {
        const resolvedValue = useResolvedValue();
        const {update} = useEditorTransactions();
        const handleSubmit = React.useCallback((values: IMailToLink) => {
            update(convert(values));
        }, []);

        return (
            <Form initialValues={resolvedValue} onSubmit={handleSubmit}>
                {({handleSubmit, ...rest }) => (
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
