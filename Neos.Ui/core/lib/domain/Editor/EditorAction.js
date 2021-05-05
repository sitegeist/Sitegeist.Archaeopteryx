"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueWasApplied = exports.ValueWasReset = exports.ValueWasUnset = exports.ValueWasUpdated = exports.EditorWasDismissed = exports.EditorWasOpened = void 0;
var typesafe_actions_1 = require("typesafe-actions");
exports.EditorWasOpened = typesafe_actions_1.createAction('http://sitegeist.de/Sitegeist.Archaeopteryx/EditorWasOpened', function (value) { return value; })();
exports.EditorWasDismissed = typesafe_actions_1.createAction('http://sitegeist.de/Sitegeist.Archaeopteryx/EditorWasDismissed')();
exports.ValueWasUpdated = typesafe_actions_1.createAction('http://sitegeist.de/Sitegeist.Archaeopteryx/ValueWasUpdated', function (value) { return value; })();
exports.ValueWasUnset = typesafe_actions_1.createAction('http://sitegeist.de/Sitegeist.Archaeopteryx/ValueWasUnset')();
exports.ValueWasReset = typesafe_actions_1.createAction('http://sitegeist.de/Sitegeist.Archaeopteryx/ValueWasReset')();
exports.ValueWasApplied = typesafe_actions_1.createAction('http://sitegeist.de/Sitegeist.Archaeopteryx/ValueWasApplied', function (value) { return value; })();
//# sourceMappingURL=EditorAction.js.map