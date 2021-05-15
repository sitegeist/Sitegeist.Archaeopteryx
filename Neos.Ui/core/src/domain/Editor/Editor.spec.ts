import {Subscription} from 'rxjs';
import {createEditor, IEditorState} from './Editor';

describe('Editor', () => {
    const {state$, tx: {editLink, dismiss, unset, apply}} = createEditor();
    let state: IEditorState;
    let subscription: Subscription;

    beforeEach(() => {
        subscription = state$.subscribe(latest => {
            state = latest;
        });
    });

    afterEach(() => {
        subscription.unsubscribe();
    });

    it('applies links', done => {
        editLink({href: 'http://example.com/'}).then(result => {
            expect(state.isOpen).toBe(false);
            expect(result.change).toBe(true);
            expect((result as any).value).toStrictEqual({href: 'https://example.com/'});
            process.nextTick(done);
        });

        process.nextTick(() => {
            expect(state.isOpen).toBe(true);
            expect(state.initialValue).toStrictEqual({href: 'http://example.com/'});

            apply({href: 'https://example.com/'});
        });
    });

    it('unsets links', done => {
        editLink({href: 'http://example.com/'}).then(result => {
            expect(state.isOpen).toBe(false);
            expect(result.change).toBe(true);
            expect((result as any).value).toBe(null);
            process.nextTick(done);
        });

        process.nextTick(() => {
            expect(state.isOpen).toBe(true);
            expect(state.initialValue).toStrictEqual({href: 'http://example.com/'});

            unset();
        });
    });

    it('can be dismissed', done => {
        editLink({href: 'http://example.com'}).then(result => {
            expect(state.isOpen).toBe(false);
            expect(result.change).toBe(false);
            process.nextTick(done);
        });

        process.nextTick(() => {
            expect(state.isOpen).toBe(true);
            expect(state.initialValue).toStrictEqual({href: 'http://example.com'});

            dismiss();
        });
    });
});
