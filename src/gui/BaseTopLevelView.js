"use strict";
exports.__esModule = true;
exports.BaseTopLevelView = void 0;
/**
 * Base (utility) class for top-level components. Will handle URL updates for you automatically and will only call {@link onNewUrl} when necessary.
 */
var BaseTopLevelView = /** @class */ (function () {
    function BaseTopLevelView() {
        this.lastPath = "";
    }
    BaseTopLevelView.prototype.oncreate = function (_a) {
        var attrs = _a.attrs;
        this.lastPath = attrs.requestedPath;
        this.onNewUrl(attrs.args, attrs.requestedPath);
    };
    BaseTopLevelView.prototype.onupdate = function (_a) {
        var attrs = _a.attrs;
        // onupdate() is called on every re-render but we don't want to call onNewUrl all the time
        if (this.lastPath !== attrs.requestedPath) {
            this.lastPath = attrs.requestedPath;
            this.onNewUrl(attrs.args, attrs.requestedPath);
        }
    };
    return BaseTopLevelView;
}());
exports.BaseTopLevelView = BaseTopLevelView;
