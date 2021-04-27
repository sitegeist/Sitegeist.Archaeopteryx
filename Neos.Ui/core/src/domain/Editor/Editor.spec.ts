import {Subscription} from 'rxjs';
import {createEditor, IEditorState} from './Editor';

describe('Editor', () => {
    const {state$, tx: {editLink, dismiss, update, clear, apply}} = createEditor();
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
        editLink('http://example.com').then(result => {
            expect(state.isOpen).toBe(false);
            expect(result.change).toBe(true);
            expect((result as any).value).toBe('http://example.com/new-link');
            process.nextTick(done);
        });

        process.nextTick(() => {
            expect(state.isOpen).toBe(true);
            expect(state.value.transient).toBe('http://example.com');
            expect(state.value.persistent).toBe('http://example.com');

            update('http://example.com/new-link');

            expect(state.value.transient).toBe('http://example.com/new-link');

            apply(state.value.transient);

            expect(state.value.transient).toBe(null);
            expect(state.value.persistent).toBe(null);
        });
    });

    it('clears links', done => {
        editLink('http://example.com/').then(result => {
            expect(state.isOpen).toBe(false);
            expect(result.change).toBe(true);
            expect((result as any).value).toBe(null);
            process.nextTick(done);
        });

        process.nextTick(() => {
            expect(state.isOpen).toBe(true);
            expect(state.value.transient).toBe('http://example.com/');
            expect(state.value.persistent).toBe('http://example.com/');

            clear();

            expect(state.value.transient).toBe(null);

            apply(state.value.transient);

            expect(state.value.transient).toBe(null);
            expect(state.value.persistent).toBe(null);
        });
    });

    it('can be dismissed', done => {
        editLink('http://example.com').then(result => {
            expect(state.isOpen).toBe(false);
            expect(result.change).toBe(false);
            process.nextTick(done);
        });

        process.nextTick(() => {
            expect(state.isOpen).toBe(true);
            expect(state.value.transient).toBe('http://example.com');
            expect(state.value.persistent).toBe('http://example.com');

            update('http://example.com/new-link');

            expect(state.value.transient).toBe('http://example.com/new-link');

            dismiss();

            expect(state.value.transient).toBe(null);
            expect(state.value.persistent).toBe(null);
        });
    });
});