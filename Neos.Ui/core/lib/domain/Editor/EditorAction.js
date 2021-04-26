"use strict";
exports.__esModule = true;
exports.UpdatedUriWasApplied = exports.UriWasCleared = exports.UriWasUpdated = exports.EditorWasDismissed = exports.EditorWasOpened = void 0;
var typesafe_actions_1 = require("typesafe-actions");
exports.EditorWasOpened = typesafe_actions_1.createAction('http://sitegeist.de/Sitegeist.Archaeopteryx/EditorWasOpened', function (uri) { return uri; })();
exports.EditorWasDismissed = typesafe_actions_1.createAction('http://sitegeist.de/Sitegeist.Archaeopteryx/EditorWasDismissed')();
exports.UriWasUpdated = typesafe_actions_1.createAction('http://sitegeist.de/Sitegeist.Archaeopteryx/UriWasUpdated', function (updatedUri) { return updatedUri; })();
exports.UriWasCleared = typesafe_actions_1.createAction('http://sitegeist.de/Sitegeist.Archaeopteryx/UriWasCleared')();
exports.UpdatedUriWasApplied = typesafe_actions_1.createAction('http://sitegeist.de/Sitegeist.Archaeopteryx/UpdatedUriWasApplied', function (updatedUri) { return updatedUri; })();
//# sourceMappingURL=EditorAction.js.map