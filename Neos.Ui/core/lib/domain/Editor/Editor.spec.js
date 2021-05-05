"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Editor_1 = require("./Editor");
describe('Editor', function () {
    var _a = Editor_1.createEditor(), state$ = _a.state$, _b = _a.tx, editLink = _b.editLink, dismiss = _b.dismiss, update = _b.update, unset = _b.unset, reset = _b.reset, apply = _b.apply;
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
        editLink({ href: 'http://example.com' }).then(function (result) {
            expect(state.isOpen).toBe(false);
            expect(result.change).toBe(true);
            expect(result.value).toStrictEqual({ href: 'http://example.com/new-link' });
            process.nextTick(done);
        });
        process.nextTick(function () {
            expect(state.isOpen).toBe(true);
            expect(state.value.persistent).toStrictEqual({ href: 'http://example.com' });
            expect(state.value.transient).toStrictEqual({ href: 'http://example.com' });
            update({ href: 'http://example.com/new-link' });
            expect(state.value.persistent).toStrictEqual({ href: 'http://example.com' });
            expect(state.value.transient).toStrictEqual({ href: 'http://example.com/new-link' });
            apply(state.value.transient);
            expect(state.value.transient).toStrictEqual(null);
            expect(state.value.persistent).toStrictEqual(null);
        });
    });
    it('unsets links', function (done) {
        editLink({ href: 'http://example.com/' }).then(function (result) {
            expect(state.isOpen).toBe(false);
            expect(result.change).toBe(true);
            expect(result.value).toBe(null);
            process.nextTick(done);
        });
        process.nextTick(function () {
            expect(state.isOpen).toBe(true);
            expect(state.value.persistent).toStrictEqual({ href: 'http://example.com/' });
            expect(state.value.transient).toStrictEqual({ href: 'http://example.com/' });
            unset();
            expect(state.value.persistent).toStrictEqual({ href: 'http://example.com/' });
            expect(state.value.transient).toStrictEqual(null);
            apply(state.value.transient);
            expect(state.value.transient).toStrictEqual(null);
            expect(state.value.persistent).toStrictEqual(null);
        });
    });
    it('resets links', function (done) {
        editLink({ href: 'http://example.com/' }).then(function (result) {
            expect(state.isOpen).toBe(false);
            expect(result.change).toBe(true);
            expect(result.value).toStrictEqual({ href: 'http://example.com/' });
            process.nextTick(done);
        });
        process.nextTick(function () {
            expect(state.isOpen).toBe(true);
            expect(state.value.persistent).toStrictEqual({ href: 'http://example.com/' });
            expect(state.value.transient).toStrictEqual({ href: 'http://example.com/' });
            update({ href: 'http://example.com/new-link' });
            expect(state.value.persistent).toStrictEqual({ href: 'http://example.com/' });
            expect(state.value.transient).toStrictEqual({ href: 'http://example.com/new-link' });
            reset();
            expect(state.value.persistent).toStrictEqual({ href: 'http://example.com/' });
            expect(state.value.transient).toStrictEqual({ href: 'http://example.com/' });
            apply(state.value.transient);
            expect(state.value.persistent).toStrictEqual(null);
            expect(state.value.transient).toStrictEqual(null);
        });
    });
    it('can be dismissed', function (done) {
        editLink({ href: 'http://example.com' }).then(function (result) {
            expect(state.isOpen).toBe(false);
            expect(result.change).toBe(false);
            process.nextTick(done);
        });
        process.nextTick(function () {
            expect(state.isOpen).toBe(true);
            expect(state.value.persistent).toStrictEqual({ href: 'http://example.com' });
            expect(state.value.transient).toStrictEqual({ href: 'http://example.com' });
            update({ href: 'http://example.com/new-link' });
            expect(state.value.persistent).toStrictEqual({ href: 'http://example.com' });
            expect(state.value.transient).toStrictEqual({ href: 'http://example.com/new-link' });
            dismiss();
            expect(state.value.persistent).toStrictEqual(null);
            expect(state.value.transient).toStrictEqual(null);
        });
    });
});
//# sourceMappingURL=Editor.spec.js.map