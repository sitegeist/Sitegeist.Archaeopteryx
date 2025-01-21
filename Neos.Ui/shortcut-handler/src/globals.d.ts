declare module '@neos-project/neos-ui-redux-store';
declare class NeosEditor {
    keystrokes: EditingKeystrokeHandler;
    execute(command: string, ...args: any[]): void;
    neos: {
        editorOptions: {
            linking?: {
                anchor?: boolean
                title?: boolean
                relNofollow?: boolean
                targetBlank?: boolean
                startingPoint?: string
                'Sitegeist.Archaeopteryx'?: {
                    linkTypes?: {
                        [key: string]: object
                    }
                }
            }
        }
    };
    editing: {
        view: {
            focus(): void;
        }
    }
}
declare class EditingKeystrokeHandler {
    set(keystroke: string | Array<string | number>, callback: EditingKeystrokeCallback, options: object = {}): void
}
declare function EditingKeystrokeCallback(_: any, cancel: () => void): void
