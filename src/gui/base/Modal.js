"use strict";
exports.__esModule = true;
exports.modal = void 0;
var mithril_1 = require("mithril");
var Animations_1 = require("./../animation/Animations");
var theme_1 = require("../theme");
var KeyManager_1 = require("../../misc/KeyManager");
var WindowFacade_1 = require("../../misc/WindowFacade");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Env_1 = require("../../api/common/Env");
(0, Env_1.assertMainOrNodeBoot)();
var Modal = /** @class */ (function () {
    function Modal() {
        var _this = this;
        this.currentKey = 0;
        this.components = [];
        this.visible = false;
        this._uniqueComponent = null;
        this._closingComponents = [];
        // modal should never get removed, so not saving unsubscriber
        WindowFacade_1.windowFacade.addHistoryEventListener(function (e) { return _this._popState(e); });
        this.view = function () {
            return (0, mithril_1["default"])("#modal.fill-absolute", {
                oncreate: function (_) {
                    // const lastComponent = last(this.components)
                    // if (lastComponent) {
                    // 	lastComponent.component.backgroundClick(e)
                    // }
                },
                style: {
                    "z-index": 300 /* LayerType.Modal */,
                    display: _this.visible ? "" : "none"
                }
            }, _this.components.map(function (wrapper, i, array) {
                return (0, mithril_1["default"])(".layer.fill-absolute", {
                    key: wrapper.key,
                    oncreate: function (vnode) {
                        // do not set visible=true already in display() because it leads to modal staying open in a second window in Chrome
                        // because onbeforeremove is not called in that case to set visible=false. this is probably an optimization in Chrome to reduce
                        // UI updates if the window is not visible. setting visible=true here is fine because this code is not even called then
                        _this.visible = true;
                        mithril_1["default"].redraw();
                        if (wrapper.needsBg)
                            _this.addAnimation(vnode.dom, true);
                    },
                    onclick: function (event) {
                        var element = event.currentTarget;
                        // This layer div has a single child, the modal component
                        var child = element.firstElementChild;
                        // child shouldn't be null but maybe the user click fast idk
                        if (child) {
                            var childRect = child.getBoundingClientRect();
                            if (!(0, tutanota_utils_1.insideRect)(event, childRect)) {
                                wrapper.component.backgroundClick(event);
                            }
                        }
                    },
                    style: {
                        zIndex: 300 /* LayerType.Modal */ + 1 + i
                    },
                    onbeforeremove: function (vnode) {
                        if (wrapper.needsBg) {
                            _this._closingComponents.push(wrapper.component);
                            return Promise.all([
                                _this.addAnimation(vnode.dom, false).then(function () {
                                    (0, tutanota_utils_1.remove)(_this._closingComponents, wrapper.component);
                                    if (_this.components.length === 0 && _this._closingComponents.length === 0) {
                                        _this.visible = false;
                                    }
                                }),
                                wrapper.component.hideAnimation(),
                            ]).then(function () {
                                mithril_1["default"].redraw();
                            });
                        }
                        else {
                            if (_this.components.length === 0 && _this._closingComponents.length === 0) {
                                _this.visible = false;
                            }
                            return wrapper.component.hideAnimation().then(function () { return mithril_1["default"].redraw(); });
                        }
                    }
                }, (0, mithril_1["default"])(wrapper.component));
            }));
        };
    }
    Modal.prototype.display = function (component, needsBg) {
        if (needsBg === void 0) { needsBg = true; }
        if (this.components.length > 0) {
            KeyManager_1.keyManager.unregisterModalShortcuts(this.components[this.components.length - 1].component.shortcuts());
        }
        var existingIndex = this.components.findIndex(function (shownComponent) { return shownComponent.component === component; });
        if (existingIndex !== -1) {
            console.warn("Attempting to display the same modal component multiple times!");
            this.components.splice(existingIndex, 1);
        }
        this.components.push({
            key: this.currentKey++,
            component: component,
            needsBg: needsBg
        });
        mithril_1["default"].redraw();
        KeyManager_1.keyManager.registerModalShortcuts(component.shortcuts());
    };
    /**
     * notify components that a history state was popped. The Component Stack is notified from the top and the first
     * Component to return false will stop underlying components from receiving the notification.
     * Components that return true are expected to remove themselves from the Modal stack, eg dropdowns.
     * @param e: the DOM Event
     * @private
     */
    Modal.prototype._popState = function (e) {
        console.log("modal popstate");
        var len = this.components.length;
        if (len === 0) {
            console.log("no modals");
            return true; // no modals to close
        }
        // get the keys because we're going to modify the component stack during iteration
        var keys = this.components.map(function (c) { return c.key; });
        for (var i = len - 1; i >= 0; i--) {
            var component = this._getComponentByKey(keys[i]);
            if (!component) {
                console.log("component went AWOL, continuing");
                continue;
            }
            if (!component.popState(e)) {
                console.log("component handled popstate");
                return false;
            }
        }
        return true;
    };
    /**
     * used for modal components that should only be opened once
     * multiple calls will be ignored if the first component is still visible
     * @param component
     */
    Modal.prototype.displayUnique = function (component, needsBg) {
        if (needsBg === void 0) { needsBg = true; }
        if (this._uniqueComponent) {
            return;
        }
        this.display(component, needsBg);
        this._uniqueComponent = component;
    };
    Modal.prototype._getComponentByKey = function (key) {
        var _a;
        var entry = this.components.find(function (c) { return c.key === key; });
        return (_a = entry === null || entry === void 0 ? void 0 : entry.component) !== null && _a !== void 0 ? _a : null;
    };
    Modal.prototype.remove = function (component) {
        var componentIndex = this.components.findIndex(function (wrapper) { return wrapper.component === component; });
        if (componentIndex === -1) {
            console.log("can't remove non existing component from modal");
            return;
        }
        var componentIsLastComponent = componentIndex === this.components.length - 1;
        if (componentIsLastComponent) {
            KeyManager_1.keyManager.unregisterModalShortcuts(component.shortcuts());
        }
        this.components.splice(componentIndex, 1);
        if (this._uniqueComponent === component) {
            this._uniqueComponent = null;
        }
        mithril_1["default"].redraw();
        if (this.components.length > 0 && componentIsLastComponent) {
            // the removed component was the last component, so we can now register the shortcuts of the now last component
            KeyManager_1.keyManager.registerModalShortcuts(this.components[this.components.length - 1].component.shortcuts());
        }
    };
    /**
     * adds an animation to the topmost component
     */
    Modal.prototype.addAnimation = function (domLayer, fadein) {
        var start = 0;
        var end = 0.5;
        return Animations_1.animations.add(domLayer, (0, Animations_1.alpha)("backgroundColor" /* AlphaEnum.BackgroundColor */, theme_1.theme.modal_bg, fadein ? start : end, fadein ? end : start));
    };
    return Modal;
}());
exports.modal = new Modal();
