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
exports.overlay = exports.displayOverlay = void 0;
var mithril_1 = require("mithril");
var Animations_1 = require("../animation/Animations");
var Easing_1 = require("../animation/Easing");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Env_1 = require("../../api/common/Env");
(0, Env_1.assertMainOrNodeBoot)();
var overlays = [];
var key = 0;
function displayOverlay(position, component, createAnimation, closeAnimation, shadowClass) {
    var _this = this;
    if (shadowClass === void 0) { shadowClass = "dropdown-shadow"; }
    var newAttrs = {
        position: position,
        component: component,
        createAnimation: createAnimation,
        closeAnimation: closeAnimation,
        shadowClass: shadowClass
    };
    var pair = [newAttrs, null, key++];
    overlays.push(pair);
    return function () { return __awaiter(_this, void 0, void 0, function () {
        var dom, animation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dom = pair[1];
                    animation = newAttrs.closeAnimation && dom
                        ? Animations_1.animations.add(dom, newAttrs.closeAnimation(dom), {
                            duration: 100,
                            easing: Easing_1.ease["in"]
                        })
                        : Promise.resolve();
                    return [4 /*yield*/, animation];
                case 1:
                    _a.sent();
                    if ((0, tutanota_utils_1.remove)(overlays, pair)) {
                        mithril_1["default"].redraw();
                    }
                    return [2 /*return*/];
            }
        });
    }); };
}
exports.displayOverlay = displayOverlay;
exports.overlay = {
    view: function () {
        return (0, mithril_1["default"])(
        // we want the overlays to position relative to the overlay parent
        // the overlay parent also should fill the root
        "#overlay.fill-absolute", {
            style: {
                display: overlays.length > 0 ? "" : "none",
                "margin-top": "env(safe-area-inset-top)",
                // we would need to change this if we wanted something to appear from the side
                "margin-left": "env(safe-area-inset-left)",
                "margin-right": "env(safe-area-inset-right)"
            },
            "aria-hidden": overlays.length === 0
        }, overlays.map(function (overlayAttrs) {
            var attrs = overlayAttrs[0], dom = overlayAttrs[1], key = overlayAttrs[2];
            var position = attrs.position();
            return (0, mithril_1["default"])(".abs.elevated-bg." + attrs.shadowClass, {
                key: key,
                style: {
                    width: position.width,
                    top: position.top,
                    bottom: position.bottom,
                    right: position.right,
                    left: position.left,
                    height: position.height,
                    "z-index": position.zIndex != null ? position.zIndex : 400 /* LayerType.Overlay */
                },
                oncreate: function (vnode) {
                    var dom = vnode.dom;
                    overlayAttrs[1] = dom;
                    if (attrs.createAnimation) {
                        Animations_1.animations.add(dom, attrs.createAnimation(dom));
                    }
                },
                onremove: function () {
                    overlayAttrs[1] = null;
                }
            }, (0, mithril_1["default"])(attrs.component));
        }));
    }
};
