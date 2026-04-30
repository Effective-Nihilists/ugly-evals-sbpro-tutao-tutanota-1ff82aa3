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
exports.ContactAggregateEditor = void 0;
var TextField_js_1 = require("../gui/base/TextField.js");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var mithril_1 = require("mithril");
var Animations_1 = require("../gui/animation/Animations");
var Dropdown_js_1 = require("../gui/base/Dropdown.js");
var IconButton_js_1 = require("../gui/base/IconButton.js");
var ContactAggregateEditor = /** @class */ (function () {
    function ContactAggregateEditor() {
    }
    ContactAggregateEditor.prototype.oncreate = function (vnode) {
        var animate = typeof vnode.attrs.animateCreate === "boolean" ? vnode.attrs.animateCreate : true;
        if (animate)
            this.animate(vnode.dom, true);
    };
    ContactAggregateEditor.prototype.onbeforeremove = function (vnode) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.animate(vnode.dom, false)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContactAggregateEditor.prototype.view = function (vnode) {
        var _this = this;
        var attrs = vnode.attrs;
        return (0, mithril_1["default"])(".flex.items-center.child-grow", [
            (0, mithril_1["default"])(TextField_js_1.TextField, {
                value: attrs.value,
                label: function () { return attrs.label; },
                type: attrs.fieldType,
                helpLabel: function () { return LanguageViewModel_1.lang.get(attrs.helpLabel); },
                injectionsRight: function () { return _this._moreButtonFor(attrs); },
                oninput: function (value) { return attrs.onUpdate(value); }
            }),
            this._cancelButtonFor(attrs)
        ]);
    };
    ContactAggregateEditor.prototype._doesAllowCancel = function (attrs) {
        return typeof attrs.allowCancel === "boolean" ? attrs.allowCancel : true;
    };
    ContactAggregateEditor.prototype._cancelButtonFor = function (attrs) {
        if (this._doesAllowCancel(attrs)) {
            return (0, mithril_1["default"])(IconButton_js_1.IconButton, {
                title: "remove_action",
                click: function () { return attrs.cancelAction(); },
                icon: "Cancel" /* Icons.Cancel */
            });
        }
        else {
            // placeholder so that the text field does not jump around
            return (0, mithril_1["default"])(".icon-button");
        }
    };
    ContactAggregateEditor.prototype._moreButtonFor = function (attrs) {
        return (0, mithril_1["default"])(IconButton_js_1.IconButton, (0, Dropdown_js_1.attachDropdown)({
            mainButtonAttrs: {
                title: "more_label",
                icon: "Expand" /* BootIcons.Expand */,
                size: 1 /* ButtonSize.Compact */
            },
            childAttrs: function () {
                return attrs.typeLabels.map(function (_a) {
                    var key = _a[0], value = _a[1];
                    return {
                        label: value,
                        click: function () { return attrs.onTypeSelected(key); }
                    };
                });
            }
        }));
    };
    ContactAggregateEditor.prototype.animate = function (domElement, fadein) {
        var childHeight = domElement.offsetHeight;
        if (fadein) {
            domElement.style.opacity = "0";
        }
        var opacityP = Animations_1.animations.add(domElement, fadein
            ? (0, Animations_1.opacity)(0, 1, true)
            : (0, Animations_1.opacity)(1, 0, true));
        var heightP = Animations_1.animations.add(domElement, fadein ? (0, Animations_1.height)(0, childHeight) : (0, Animations_1.height)(childHeight, 0));
        heightP.then(function () {
            domElement.style.height = "";
        });
        return Promise.all([opacityP, heightP]);
    };
    return ContactAggregateEditor;
}());
exports.ContactAggregateEditor = ContactAggregateEditor;
