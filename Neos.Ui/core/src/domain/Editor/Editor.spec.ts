import {Subscription} from 'rxjs';
import {createEditor, IEditorState} from './Editor';

describe('Editor', () => {
    const {state$, tx: {editLink, dismiss, update, unset, reset, apply}} = createEditor();
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

    it('updates links', done => {
        editLink({href: 'http://example.com'}).then(result => {
            expect(state.isOpen).toBe(false);
            expect(result.change).toBe(true);
            expect((result as any).value).toStrictEqual({href: 'http://example.com/new-link'});
            process.nextTick(done);
        });

        process.nextTick(() => {
            expect(state.isOpen).toBe(true);
            expect(state.value.persistent).toStrictEqual({href: 'http://example.com'});
            expect(state.value.transient).toStrictEqual({href: 'http://example.com'});

            update({href: 'http://example.com/new-link'});
            expect(state.value.persistent).toStrictEqual({href: 'http://example.com'});
            expect(state.value.transient).toStrictEqual({href: 'http://example.com/new-link'});

            apply(state.value.transient);
            expect(state.value.transient).toStrictEqual(null);
            expect(state.value.persistent).toStrictEqual(null);
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
            expect(state.value.persistent).toStrictEqual({href: 'http://example.com/'});
            expect(state.value.transient).toStrictEqual({href: 'http://example.com/'});

            unset();
            expect(state.value.persistent).toStrictEqual({href: 'http://example.com/'});
            expect(state.value.transient).toStrictEqual(null);

            apply(state.value.transient);
            expect(state.value.transient).toStrictEqual(null);
            expect(state.value.persistent).toStrictEqual(null);
        });
    });

    it('resets links', done => {
        editLink({href: 'http://example.com/'}).then(result => {
            expect(state.isOpen).toBe(false);
            expect(result.change).toBe(true);
            expect((result as any).value).toStrictEqual({href: 'http://example.com/'});
            process.nextTick(done);
        });

        process.nextTick(() => {
            expect(state.isOpen).toBe(true);
            expect(state.value.persistent).toStrictEqual({href: 'http://example.com/'});
            expect(state.value.transient).toStrictEqual({href: 'http://example.com/'});

            update({href: 'http://example.com/new-link'});
            expect(state.value.persistent).toStrictEqual({href: 'http://example.com/'});
            expect(state.value.transient).toStrictEqual({href: 'http://example.com/new-link'});

            reset();
            expect(state.value.persistent).toStrictEqual({href: 'http://example.com/'});
            expect(state.value.transient).toStrictEqual({href: 'http://example.com/'});

            apply(state.value.transient);
            expect(state.value.persistent).toStrictEqual(null);
            expect(state.value.transient).toStrictEqual(null);
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
            expect(state.value.persistent).toStrictEqual({href: 'http://example.com'});
            expect(state.value.transient).toStrictEqual({href: 'http://example.com'});

            update({href: 'http://example.com/new-link'});
            expect(state.value.persistent).toStrictEqual({href: 'http://example.com'});
            expect(state.value.transient).toStrictEqual({href: 'http://example.com/new-link'});

            dismiss();
            expect(state.value.persistent).toStrictEqual(null);
            expect(state.value.transient).toStrictEqual(null);
        });
    });
});
