"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.FolderColumnView = void 0;
var DrawerMenu_js_1 = require("./nav/DrawerMenu.js");
var theme_js_1 = require("./theme.js");
var mithril_1 = require("mithril");
var LanguageViewModel_js_1 = require("../misc/LanguageViewModel.js");
var AriaUtils_js_1 = require("./AriaUtils.js");
var FolderColumnHeaderButton_js_1 = require("./base/buttons/FolderColumnHeaderButton.js");
var FolderColumnView = /** @class */ (function () {
    function FolderColumnView() {
        var _this = this;
        this.wsState = 0 /* WsConnectionState.connecting */;
        Promise.resolve().then(function () { return require("../api/main/MainLocator.js"); }).then(function (_a) {
            var locator = _a.locator;
            return __awaiter(_this, void 0, void 0, function () {
                var worker;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, locator.initialized];
                        case 1:
                            _b.sent();
                            worker = locator.worker;
                            this.wsState = worker.wsConnection()();
                            worker.wsConnection().map(function (state) {
                                _this.wsState = state;
                                mithril_1["default"].redraw();
                            });
                            mithril_1["default"].redraw();
                            return [2 /*return*/];
                    }
                });
            });
        });
    }
    FolderColumnView.prototype.view = function (_a) {
        var _this = this;
        var attrs = _a.attrs;
        return (0, mithril_1["default"])(".flex.height-100p", [
            (0, mithril_1["default"])(DrawerMenu_js_1.DrawerMenu, {
                openNewWindow: function () { return __awaiter(_this, void 0, void 0, function () {
                    var locator;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../api/main/MainLocator.js"); })];
                            case 1:
                                locator = (_a.sent()).locator;
                                return [2 /*return*/, locator.desktopSystemFacade.openNewWindow()];
                        }
                    });
                }); }
            }),
            (0, mithril_1["default"])(".folder-column.flex-grow.overflow-x-hidden.flex.col" + (0, AriaUtils_js_1.landmarkAttrs)("navigation" /* AriaLandmarks.Navigation */, LanguageViewModel_js_1.lang.getMaybeLazy(attrs.ariaLabel)), [
                this.renderMainButton(attrs),
                (0, mithril_1["default"])(".scroll.overflow-x-hidden.flex.col.flex-grow", {
                    onscroll: function (e) {
                        var target = e.target;
                        if (attrs.button == null || target.scrollTop === 0) {
                            target.style.borderTop = "";
                        }
                        else {
                            target.style.borderTop = "1px solid ".concat(theme_js_1.theme.content_border);
                        }
                    }
                }, attrs.content),
            ]),
        ]);
    };
    FolderColumnView.prototype.renderMainButton = function (attrs) {
        return attrs.button
            ? (0, mithril_1["default"])(".mlr-l.mt.mb", (0, mithril_1["default"])(FolderColumnHeaderButton_js_1.FolderColumnHeaderButton, {
                label: attrs.button.label,
                click: attrs.button.click
            }))
            : null;
    };
    return FolderColumnView;
}());
exports.FolderColumnView = FolderColumnView;
