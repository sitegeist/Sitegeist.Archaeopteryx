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
        editLink({ href: 'http://example.com' }).then(function (result) {
            var _a;
            expect(state.isOpen).toBe(false);
            expect(result.change).toBe(true);
            expect((_a = result.value) === null || _a === void 0 ? void 0 : _a.href).toBe('http://example.com/new-link');
            process.nextTick(done);
        });
        process.nextTick(function () {
            var _a, _b, _c;
            expect(state.isOpen).toBe(true);
            expect((_a = state.value.transient) === null || _a === void 0 ? void 0 : _a.href).toBe('http://example.com');
            expect((_b = state.value.persistent) === null || _b === void 0 ? void 0 : _b.href).toBe('http://example.com');
            update({ href: 'http://example.com/new-link' });
            expect((_c = state.value.transient) === null || _c === void 0 ? void 0 : _c.href).toBe('http://example.com/new-link');
            apply(state.value.transient);
            expect(state.value.transient).toBe(null);
            expect(state.value.persistent).toBe(null);
        });
    });
    it('clears links', function (done) {
        editLink({ href: 'http://example.com/' }).then(function (result) {
            expect(state.isOpen).toBe(false);
            expect(result.change).toBe(true);
            expect(result.value).toBe(null);
            process.nextTick(done);
        });
        process.nextTick(function () {
            var _a, _b;
            expect(state.isOpen).toBe(true);
            expect((_a = state.value.transient) === null || _a === void 0 ? void 0 : _a.href).toBe('http://example.com/');
            expect((_b = state.value.persistent) === null || _b === void 0 ? void 0 : _b.href).toBe('http://example.com/');
            clear();
            expect(state.value.transient).toBe(null);
            apply(state.value.transient);
            expect(state.value.transient).toBe(null);
            expect(state.value.persistent).toBe(null);
        });
    });
    it('can be dismissed', function (done) {
        editLink({ href: 'http://example.com' }).then(function (result) {
            expect(state.isOpen).toBe(false);
            expect(result.change).toBe(false);
            process.nextTick(done);
        });
        process.nextTick(function () {
            var _a, _b, _c;
            expect(state.isOpen).toBe(true);
            expect((_a = state.value.transient) === null || _a === void 0 ? void 0 : _a.href).toBe('http://example.com');
            expect((_b = state.value.persistent) === null || _b === void 0 ? void 0 : _b.href).toBe('http://example.com');
            update({ href: 'http://example.com/new-link' });
            expect((_c = state.value.transient) === null || _c === void 0 ? void 0 : _c.href).toBe('http://example.com/new-link');
            dismiss();
            expect(state.value.transient).toBe(null);
            expect(state.value.persistent).toBe(null);
        });
    });
});
//# sourceMappingURL=Editor.spec.js.map