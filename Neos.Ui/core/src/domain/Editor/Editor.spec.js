"use strict";
exports.__esModule = true;
var Editor_1 = require("./Editor");
describe('Editor', function () {
    var _a = Editor_1.createEditor(), state$ = _a.state$, _b = _a.tx, editLink = _b.editLink, dismiss = _b.dismiss, update = _b.update, clear = _b.clear, apply = _b.apply;
    var state;
    var subscription;
    beforeEach(function () {
        subscription = state$.subscribe(function (latest) {
            state = latest;
        });
    });
    afterEach(function () {
        subscription.unsubscribe();
    });
    it('updates links', function (done) {
        editLink('http://example.com').then(function (result) {
            expect(state.isOpen).toBe(false);
            expect(result.change).toBe(true);
            expect(result.value).toBe('http://example.com/new-link');
            process.nextTick(done);
        });
        process.nextTick(function () {
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
    it('clears links', function (done) {
        editLink('http://example.com/').then(function (result) {
            expect(state.isOpen).toBe(false);
            expect(result.change).toBe(true);
            expect(result.value).toBe(null);
            process.nextTick(done);
        });
        process.nextTick(function () {
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
    it('can be dismissed', function (done) {
        editLink('http://example.com').then(function (result) {
            expect(state.isOpen).toBe(false);
            expect(result.change).toBe(false);
            process.nextTick(done);
        });
        process.nextTick(function () {
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
//# sourceMappingURL=Editor.spec.js.map