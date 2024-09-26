import {INeosContextProperties} from "@sitegeist/archaeopteryx-neos-bridge";
import {IEditor} from "@sitegeist/archaeopteryx-core";
import {SynchronousRegistry} from "@neos-project/neos-ui-extensibility";
import {ILinkOptions} from "@sitegeist/archaeopteryx-core/lib/domain";

export const executeCommand = (editor: NeosEditor, command: string, argument: any, reFocusEditor = true) => {
    editor.execute(command, argument);
    if (reFocusEditor) {
        editor.editing.view.focus();
    }
};
export function registerShortcutHandler (
    neosContextProperties: INeosContextProperties,
    editor: IEditor
): void {
    const {globalRegistry, store} = neosContextProperties;
    const ckeditor5Registry = globalRegistry.get('ckEditor5');
    if (!ckeditor5Registry) {
        console.warn('[Sitegeist.Archaeopteryx]: Could not find ckeditor5 registry.');
        console.warn('[Sitegeist.Archaeopteryx]: Skipping registration of keyboard shortcut...');
        return;
    }

    const ckeditor5Configuration = ckeditor5Registry.get<SynchronousRegistry<any>>('config')
    if (!ckeditor5Registry) {
        console.warn('[Sitegeist.Archaeopteryx]: Could not find ckeditor5 config registry.');
        console.warn('[Sitegeist.Archaeopteryx]: Skipping registration of keyboard shortcut...');
        return;
    }

    ckeditor5Configuration.set('keystrokes', (ckEditorConfiguration: { plugins: ((ckEditorInstance: NeosEditor) => void)[]; }) => {
        ckEditorConfiguration.plugins.push((ckEditorInstance) => {
            ckEditorInstance.keystrokes.set('Ctrl+k', async (_: any, cancel: () => void) => {
                // Cancel keystroke event
                cancel();

                const inlineEditorOptions = ckEditorInstance.neos.editorOptions;
                const editorOptions = {
                    ...inlineEditorOptions?.linking?.['Sitegeist.Archaeopteryx'],
                    linkTypes: {
                        ...inlineEditorOptions?.linking?.['Sitegeist.Archaeopteryx']?.linkTypes
                    }
                };

                if (inlineEditorOptions?.linking?.startingPoint) {
                    editorOptions.linkTypes['Sitegeist.Archaeopteryx:Node'] = {
                        ...editorOptions.linkTypes['Sitegeist.Archaeopteryx:Node'],
                        startingPoint:
                            (editorOptions.linkTypes['Sitegeist.Archaeopteryx:Node'] as any).startingPoint
                            ?? inlineEditorOptions.linking.startingPoint
                    };
                }

                const formattingUnderCursor = store.getState()?.ui?.contentCanvas?.formattingUnderCursor
                const link = (() => {
                    if (formattingUnderCursor?.link) {
                        const [href, anchor] = formattingUnderCursor.link.split('#');
                        return {
                            href,
                            options: {
                                anchor,
                                title: formattingUnderCursor.linkTitle,
                                targetBlank: formattingUnderCursor.linkTargetBlank,
                                relNofollow: formattingUnderCursor.linkRelNofollow
                            }
                        };
                    }

                    return null;
                })();
                const enabledLinkOptions = (() => {
                    const enabledLinkOptions: (keyof ILinkOptions)[] = [];

                    if (ckEditorInstance?.neos?.editorOptions?.linking?.anchor) {
                        enabledLinkOptions.push('anchor');
                    }

                    if (ckEditorInstance?.neos?.editorOptions?.linking?.title) {
                        enabledLinkOptions.push('title');
                    }

                    if (ckEditorInstance?.neos?.editorOptions?.linking?.relNofollow) {
                        enabledLinkOptions.push('relNofollow');
                    }

                    if (ckEditorInstance?.neos?.editorOptions?.linking?.targetBlank) {
                        enabledLinkOptions.push('targetBlank');
                    }

                    return enabledLinkOptions;
                })();

                const result = await editor.tx.editLink(link, enabledLinkOptions, editorOptions);

                if (result.change) {
                    if (result.value === null) {
                        executeCommand(ckEditorInstance, 'linkTitle', false, false);
                        executeCommand(ckEditorInstance, 'linkRelNofollow', false, false);
                        executeCommand(ckEditorInstance, 'linkTargetBlank', false, false);
                        executeCommand(ckEditorInstance, 'unlink', undefined, true);
                    } else {
                        executeCommand(ckEditorInstance, 'linkTitle', result.value.options?.title || false, false);
                        executeCommand(ckEditorInstance, 'linkTargetBlank', result.value.options?.targetBlank ?? false, false);
                        executeCommand(ckEditorInstance, 'linkRelNofollow', result.value.options?.relNofollow ?? false, false);

                        if (result.value.options?.anchor) {
                            executeCommand(ckEditorInstance, 'link', `${result.value.href}#${result.value.options?.anchor}`, true);
                        } else {
                            executeCommand(ckEditorInstance, 'link', result.value.href, true);
                        }
                    }
                } else {
                    executeCommand(ckEditorInstance, 'undo', undefined, true);
                    executeCommand(ckEditorInstance, 'redo', undefined, true);
                }
            })
        });
        return ckEditorConfiguration;
    })
}
