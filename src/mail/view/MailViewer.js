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
exports.createMailViewerViewModel = exports.MailViewer = void 0;
var size_1 = require("../../gui/size");
var mithril_1 = require("mithril");
var stream_1 = require("mithril/stream");
var WindowFacade_1 = require("../../misc/WindowFacade");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var Env_1 = require("../../api/common/Env");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var MailUtils_1 = require("../model/MailUtils");
var ColumnEmptyMessageBox_1 = require("../../gui/base/ColumnEmptyMessageBox");
var KeyManager_1 = require("../../misc/KeyManager");
var LoginController_1 = require("../../api/main/LoginController");
var Icon_1 = require("../../gui/base/Icon");
var theme_1 = require("../../gui/theme");
var ClientDetector_1 = require("../../misc/ClientDetector");
var styles_1 = require("../../gui/styles");
var Dropdown_js_1 = require("../../gui/base/Dropdown.js");
var RouteChange_1 = require("../../misc/RouteChange");
var MailGuiUtils_1 = require("./MailGuiUtils");
var MainLocator_1 = require("../../api/main/MainLocator");
var GuiUtils_1 = require("../../gui/base/GuiUtils");
var ClipboardUtils_1 = require("../../misc/ClipboardUtils");
var MailViewerViewModel_1 = require("./MailViewerViewModel");
var EntityUtils_1 = require("../../api/common/utils/EntityUtils");
var TypeRefs_js_1 = require("../../api/entities/sys/TypeRefs.js");
var UserError_1 = require("../../api/main/UserError");
var ErrorHandlerImpl_1 = require("../../misc/ErrorHandlerImpl");
var Animations_1 = require("../../gui/animation/Animations");
var Easing_1 = require("../../gui/animation/Easing");
var NavFunctions_1 = require("../../gui/nav/NavFunctions");
var CancelledError_1 = require("../../api/common/error/CancelledError");
var ProgrammingError_js_1 = require("../../api/common/error/ProgrammingError.js");
var MailViewerHeader_js_1 = require("./MailViewerHeader.js");
var MailViewerUtils_js_1 = require("./MailViewerUtils.js");
(0, Env_1.assertMainOrNode)();
var SCROLL_FACTOR = 4 / 5;
var DOUBLE_TAP_TIME_MS = 350;
/**
 * The MailViewer displays a mail. The mail body is loaded asynchronously.
 *
 * The viewer has a longer lifecycle than viewModel so we need to be careful about the state.
 */
var MailViewer = /** @class */ (function () {
    function MailViewer(vnode) {
        var _this = this;
        /** it is set after we measured mail body element */
        this.bodyLineHeight = null;
        this.isScaling = true;
        this.lastBodyTouchEndTime = 0;
        this.lastTouchStart = {
            x: 0,
            y: 0,
            time: Date.now()
        };
        /**
         * Delay the display of the progress spinner in main body view for a short time to suppress it when we are switching between cached emails
         * and we are just sanitizing
         */
        this.delayProgressSpinner = true;
        this.scrollAnimation = null;
        this.scrollDom = null;
        this.domBodyDeferred = (0, tutanota_utils_1.defer)();
        this.domBody = null;
        this.shadowDomRoot = null;
        this.currentlyRenderedMailBody = null;
        this.lastContentBlockingStatus = null;
        this.loadAllListener = (0, stream_1["default"])();
        this.setViewModel(vnode.attrs.viewModel);
        this.resizeListener = function () { return _this.domBodyDeferred.promise.then(function (dom) { return _this.updateLineHeight(dom); }); };
        this.shortcuts = this.setupShortcuts(vnode.attrs);
    }
    MailViewer.prototype.oncreate = function () {
        KeyManager_1.keyManager.registerShortcuts(this.shortcuts);
        WindowFacade_1.windowFacade.addResizeListener(this.resizeListener);
    };
    MailViewer.prototype.onremove = function () {
        WindowFacade_1.windowFacade.removeResizeListener(this.resizeListener);
        this.clearDomBody();
        KeyManager_1.keyManager.unregisterShortcuts(this.shortcuts);
    };
    MailViewer.prototype.setViewModel = function (viewModel) {
        var _this = this;
        // Figuring out whether we have a new email assigned.
        var oldViewModel = this.viewModel;
        this.viewModel = viewModel;
        if (this.viewModel !== oldViewModel) {
            this.loadAllListener.end(true);
            this.loadAllListener = this.viewModel.loadCompleteNotification.map(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // streams are pretty much synchronous, so we could be in the middle of a redraw here and mithril does not just schedule another redraw, it
                        // will error out so before calling m.redraw.sync() we want to make sure that we are not inside a redraw by just scheduling a microtask with
                        // this simple await.
                        return [4 /*yield*/, Promise.resolve()
                            // Wait for mail body to be redrawn before replacing images
                        ];
                        case 1:
                            // streams are pretty much synchronous, so we could be in the middle of a redraw here and mithril does not just schedule another redraw, it
                            // will error out so before calling m.redraw.sync() we want to make sure that we are not inside a redraw by just scheduling a microtask with
                            // this simple await.
                            _a.sent();
                            // Wait for mail body to be redrawn before replacing images
                            mithril_1["default"].redraw.sync();
                            return [4 /*yield*/, this.replaceInlineImages()];
                        case 2:
                            _a.sent();
                            mithril_1["default"].redraw();
                            return [2 /*return*/];
                    }
                });
            }); });
            // Reset scaling status if it's a new email.
            this.isScaling = true;
            this.lastContentBlockingStatus = null;
            this.viewModel.loadAll();
            this.delayProgressSpinner = true;
            setTimeout(function () {
                _this.delayProgressSpinner = false;
                mithril_1["default"].redraw();
            }, 50);
        }
    };
    MailViewer.prototype.view = function (vnode) {
        var _this = this;
        this.handleContentBlockingOnRender();
        var scrollingHeader = styles_1.styles.isSingleColumnLayout();
        return [
            (0, mithril_1["default"])("#mail-viewer.fill-absolute" + (scrollingHeader ? ".scroll-no-overlay.overflow-x-hidden" : ".flex.flex-column"), [
                this.renderMailHeader(),
                (0, mithril_1["default"])(".flex-grow.mlr-safe-inset.scroll-x.plr-l.pb-floating.pt" +
                    (scrollingHeader ? "" : ".scroll-no-overlay") +
                    (this.viewModel.isContrastFixNeeded() ? ".bg-white.content-black" : " "), {
                    oncreate: function (vnode) {
                        _this.scrollDom = vnode.dom;
                    }
                }, this.renderMailBodySection()),
            ]),
        ];
    };
    MailViewer.prototype.handleContentBlockingOnRender = function () {
        var _this = this;
        if (this.lastContentBlockingStatus != null && this.viewModel.getContentBlockingStatus() != this.lastContentBlockingStatus) {
            Promise.resolve().then(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // Wait for new mail body to be rendered before replacing images. Probably not necessary anymore as we already schedule it after the render
                            // but better be safe.
                            mithril_1["default"].redraw.sync();
                            return [4 /*yield*/, this.replaceInlineImages()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        this.lastContentBlockingStatus = this.viewModel.getContentBlockingStatus();
    };
    MailViewer.prototype.renderMailHeader = function () {
        return (0, mithril_1["default"])(MailViewerHeader_js_1.MailViewerHeader, {
            viewModel: this.viewModel,
            createMailAddressContextButtons: this.createMailAddressContextButtons.bind(this)
        });
    };
    MailViewer.prototype.onbeforeupdate = function (vnode) {
        // Setting viewModel here to have viewModel that we will use for render already and be able to make a decision
        // about skipping rendering
        this.setViewModel(vnode.attrs.viewModel);
        // We skip rendering progress indicator when switching between emails.
        // However if we already loaded the mail then we can just render it.
        var shouldSkipRender = this.viewModel.isLoading() && this.delayProgressSpinner;
        return !shouldSkipRender;
    };
    MailViewer.prototype.renderMailBodySection = function () {
        if (this.viewModel.didErrorsOccur()) {
            return (0, mithril_1["default"])(ColumnEmptyMessageBox_1["default"], {
                message: "corrupted_msg",
                icon: "Warning" /* Icons.Warning */,
                color: theme_1.theme.content_message_bg
            });
        }
        var sanitizedMailBody = this.viewModel.getSanitizedMailBody();
        // Do not render progress spinner or mail body while we are animating.
        if (this.viewModel.shouldDelayRendering()) {
            return null;
        }
        else if (sanitizedMailBody != null) {
            return this.renderMailBody(sanitizedMailBody);
        }
        else if (this.viewModel.isLoading()) {
            return this.renderLoadingIcon();
        }
        else {
            // The body failed to load, just show blank body because there is a banner
            return null;
        }
    };
    MailViewer.prototype.renderMailBody = function (sanitizedMailBody) {
        var _this = this;
        return (0, mithril_1["default"])("#mail-body", {
            // key to avoid mithril reusing the dom element when it should switch the rendering the loading spinner
            key: "mailBody",
            oncreate: function (vnode) {
                var dom = vnode.dom;
                _this.setDomBody(dom);
                _this.updateLineHeight(dom);
                _this.rescale(false);
                _this.renderShadowMailBody(sanitizedMailBody);
            },
            onupdate: function (vnode) {
                var dom = vnode.dom;
                _this.setDomBody(dom);
                // Only measure and update line height once.
                // BUT we need to do in from onupdate too if we swap mailViewer but mithril does not realize
                // that it's a different vnode so oncreate might not be called.
                if (!_this.bodyLineHeight) {
                    _this.updateLineHeight(vnode.dom);
                }
                _this.rescale(false);
                if (_this.currentlyRenderedMailBody !== sanitizedMailBody)
                    _this.renderShadowMailBody(sanitizedMailBody);
            },
            onbeforeremove: function () {
                // Clear dom body in case there will be a new one, we want promise to be up-to-date
                _this.clearDomBody();
            },
            onsubmit: function (event) {
                // use the default confirm dialog here because the submit can not be done async
                if (!confirm(LanguageViewModel_1.lang.get("reallySubmitContent_msg"))) {
                    event.preventDefault();
                }
            },
            style: {
                "line-height": this.bodyLineHeight ? this.bodyLineHeight.toString() : size_1.size.line_height,
                "transform-origin": "top left"
            }
        });
    };
    /**
     * manually wrap and style a mail body to display correctly inside a shadow root
     * @param sanitizedMailBody the mail body to display
     * @private
     */
    MailViewer.prototype.renderShadowMailBody = function (sanitizedMailBody) {
        var _this = this;
        assertNonNull(this.shadowDomRoot);
        while (this.shadowDomRoot.firstChild) {
            this.shadowDomRoot.firstChild.remove();
        }
        var wrapNode = document.createElement("div");
        wrapNode.className = "selectable touch-callout break-word-links" + (ClientDetector_1.client.isMobileDevice() ? " break-pre" : "");
        wrapNode.style.lineHeight = String(this.bodyLineHeight ? this.bodyLineHeight.toString() : size_1.size.line_height);
        wrapNode.style.transformOrigin = "top left";
        wrapNode.appendChild(sanitizedMailBody.cloneNode(true));
        if (ClientDetector_1.client.isMobileDevice()) {
            wrapNode.addEventListener("touchstart", function (event) {
                var touch = event.touches[0];
                _this.lastTouchStart.x = touch.clientX;
                _this.lastTouchStart.y = touch.clientY;
                _this.lastTouchStart.time = Date.now();
            });
            wrapNode.addEventListener("touchend", function (event) {
                var _a, _b, _c;
                var href = (_c = (_b = (_a = event.target) === null || _a === void 0 ? void 0 : _a.closest("a")) === null || _b === void 0 ? void 0 : _b.getAttribute("href")) !== null && _c !== void 0 ? _c : null;
                _this.handleDoubleTap(event, function (e) { return _this.handleAnchorClick(e, href, true); }, function () { return _this.rescale(true); });
            });
        }
        else {
            wrapNode.addEventListener("click", function (event) {
                var _a, _b, _c;
                var href = (_c = (_b = (_a = event.target) === null || _a === void 0 ? void 0 : _a.closest("a")) === null || _b === void 0 ? void 0 : _b.getAttribute("href")) !== null && _c !== void 0 ? _c : null;
                _this.handleAnchorClick(event, href, false);
            });
        }
        this.shadowDomRoot.appendChild(styles_1.styles.getStyleSheetElement("main"));
        this.shadowDomRoot.appendChild(wrapNode);
        this.currentlyRenderedMailBody = sanitizedMailBody;
    };
    MailViewer.prototype.clearDomBody = function () {
        this.domBodyDeferred = (0, tutanota_utils_1.defer)();
        this.domBody = null;
        this.shadowDomRoot = null;
    };
    MailViewer.prototype.setDomBody = function (dom) {
        if (dom !== this.domBody || this.shadowDomRoot == null) {
            // If the dom element hasn't been created anew in onupdate
            // then trying to create a new shadow root on the same node will cause an error
            this.shadowDomRoot = dom.attachShadow({ mode: "open" });
            // Allow forms inside of mail bodies to be filled out without resulting in keystrokes being interpreted as shortcuts
            this.shadowDomRoot.getRootNode().addEventListener("keydown", function (event) { return event.stopPropagation(); });
        }
        this.domBodyDeferred.resolve(dom);
        this.domBody = dom;
    };
    MailViewer.prototype.renderLoadingIcon = function () {
        return (0, mithril_1["default"])(".progress-panel.flex-v-center.items-center", {
            key: "loadingIcon",
            style: {
                height: "200px"
            }
        }, [(0, Icon_1.progressIcon)(), (0, mithril_1["default"])("small", LanguageViewModel_1.lang.get("loading_msg"))]);
    };
    MailViewer.prototype.replaceInlineImages = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loadedInlineImages, domBody;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.viewModel.getLoadedInlineImages()];
                    case 1:
                        loadedInlineImages = _a.sent();
                        return [4 /*yield*/, this.domBodyDeferred.promise];
                    case 2:
                        domBody = _a.sent();
                        (0, MailGuiUtils_1.replaceCidsWithInlineImages)(domBody, loadedInlineImages, function (cid, event) {
                            var inlineAttachment = _this.viewModel.getAttachments().find(function (attachment) { return attachment.cid === cid; });
                            if (inlineAttachment) {
                                var coords = (0, GuiUtils_1.getCoordsOfMouseOrTouchEvent)(event);
                                (0, Dropdown_js_1.showDropdownAtPosition)([
                                    {
                                        label: "download_action",
                                        click: function () { return _this.viewModel.downloadAndOpenAttachment(inlineAttachment, false); }
                                    },
                                    {
                                        label: "open_action",
                                        click: function () { return _this.viewModel.downloadAndOpenAttachment(inlineAttachment, true); }
                                    },
                                ], coords.x, coords.y);
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    MailViewer.prototype.rescale = function (animate) {
        var child = this.domBody;
        if (!ClientDetector_1.client.isMobileDevice() || !child) {
            return;
        }
        var containerWidth = child.offsetWidth;
        if (!this.isScaling || containerWidth > child.scrollWidth) {
            child.style.transform = "";
            child.style.marginBottom = "";
        }
        else {
            var width = child.scrollWidth;
            var scale = containerWidth / width;
            var heightDiff = child.scrollHeight - child.scrollHeight * scale;
            child.style.transform = "scale(".concat(scale, ")");
            child.style.marginBottom = "".concat(-heightDiff, "px");
        }
        child.style.transition = animate ? "transform 200ms ease-in-out" : "";
        // ios 15 bug: transformOrigin magically disappears so we ensure that it's always set
        child.style.transformOrigin = "top left";
    };
    MailViewer.prototype.setupShortcuts = function (attrs) {
        var _this = this;
        var userController = LoginController_1.logins.getUserController();
        var shortcuts = [
            {
                key: TutanotaConstants_1.Keys.E,
                enabled: function () { return _this.viewModel.isDraftMail(); },
                exec: function () {
                    (0, MailViewerUtils_js_1.editDraft)(_this.viewModel);
                },
                help: "editMail_action"
            },
            {
                key: TutanotaConstants_1.Keys.H,
                enabled: function () { return !_this.viewModel.isDraftMail(); },
                exec: function () {
                    (0, MailViewerUtils_js_1.showHeaderDialog)(_this.viewModel.getHeaders());
                },
                help: "showHeaders_action"
            },
            {
                key: TutanotaConstants_1.Keys.R,
                exec: function () {
                    _this.viewModel.reply(false);
                },
                enabled: function () { return !_this.viewModel.isDraftMail(); },
                help: "reply_action"
            },
            {
                key: TutanotaConstants_1.Keys.R,
                shift: true,
                exec: function () {
                    _this.viewModel.reply(true);
                },
                enabled: function () { return !_this.viewModel.isDraftMail(); },
                help: "replyAll_action"
            },
            {
                key: TutanotaConstants_1.Keys.PAGE_UP,
                exec: function () { return _this.scrollUp(); },
                help: "scrollUp_action"
            },
            {
                key: TutanotaConstants_1.Keys.PAGE_DOWN,
                exec: function () { return _this.scrollDown(); },
                help: "scrollDown_action"
            },
            {
                key: TutanotaConstants_1.Keys.HOME,
                exec: function () { return _this.scrollToTop(); },
                help: "scrollToTop_action"
            },
            {
                key: TutanotaConstants_1.Keys.END,
                exec: function () { return _this.scrollToBottom(); },
                help: "scrollToBottom_action"
            },
        ];
        if (userController.isInternalUser()) {
            shortcuts.push({
                key: TutanotaConstants_1.Keys.F,
                shift: true,
                enabled: function () { return !_this.viewModel.isDraftMail(); },
                exec: function () {
                    _this.viewModel.forward()["catch"]((0, tutanota_utils_1.ofClass)(UserError_1.UserError, ErrorHandlerImpl_1.showUserError));
                },
                help: "forward_action"
            });
        }
        return shortcuts;
    };
    MailViewer.prototype.updateLineHeight = function (dom) {
        var width = dom.offsetWidth;
        if (width > 900) {
            this.bodyLineHeight = size_1.size.line_height_l;
        }
        else if (width > 600) {
            this.bodyLineHeight = size_1.size.line_height_m;
        }
        else {
            this.bodyLineHeight = size_1.size.line_height;
        }
        dom.style.lineHeight = String(this.bodyLineHeight);
    };
    MailViewer.prototype.createMailAddressContextButtons = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var mailAddress, defaultInboxRuleField, _a, createContact, buttons, contact_1, rule_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mailAddress = args.mailAddress, defaultInboxRuleField = args.defaultInboxRuleField, _a = args.createContact, createContact = _a === void 0 ? true : _a;
                        buttons = [];
                        buttons.push({
                            label: "copy_action",
                            click: function () { return (0, ClipboardUtils_1.copyToClipboard)(mailAddress.address); }
                        });
                        if (!LoginController_1.logins.getUserController().isInternalUser()) return [3 /*break*/, 3];
                        if (!(createContact && !LoginController_1.logins.isEnabled(TutanotaConstants_1.FeatureType.DisableContacts) && LoginController_1.logins.isFullyLoggedIn())) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.viewModel.contactModel.searchForContact(mailAddress.address)];
                    case 1:
                        contact_1 = _b.sent();
                        if (contact_1) {
                            buttons.push({
                                label: "showContact_action",
                                click: function () {
                                    RouteChange_1.navButtonRoutes.contactsUrl = "/contact/".concat((0, tutanota_utils_1.neverNull)(contact_1)._id[0], "/").concat((0, tutanota_utils_1.neverNull)(contact_1)._id[1]);
                                    mithril_1["default"].route.set(RouteChange_1.navButtonRoutes.contactsUrl + location.hash);
                                }
                            });
                        }
                        else {
                            buttons.push({
                                label: "createContact_action",
                                click: function () {
                                    _this.viewModel.contactModel.contactListId().then(function (contactListId) {
                                        Promise.resolve().then(function () { return require("../../contacts/ContactEditor"); }).then(function (_a) {
                                            var ContactEditor = _a.ContactEditor;
                                            var contact = (0, MailUtils_1.createNewContact)(LoginController_1.logins.getUserController().user, mailAddress.address, mailAddress.name);
                                            new ContactEditor(_this.viewModel.entityClient, contact, contactListId !== null && contactListId !== void 0 ? contactListId : undefined).show();
                                        });
                                    });
                                }
                            });
                        }
                        _b.label = 2;
                    case 2:
                        if (defaultInboxRuleField && !LoginController_1.logins.isEnabled(TutanotaConstants_1.FeatureType.InternalCommunication)) {
                            rule_1 = (0, MailUtils_1.getExistingRuleForType)(LoginController_1.logins.getUserController().props, mailAddress.address.trim().toLowerCase(), defaultInboxRuleField);
                            buttons.push({
                                label: rule_1 ? "editInboxRule_action" : "addInboxRule_action",
                                click: function () { return __awaiter(_this, void 0, void 0, function () {
                                    var mailboxDetails, _a, show, createInboxRuleTemplate, newRule;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0: return [4 /*yield*/, this.viewModel.mailModel.getMailboxDetailsForMail(this.viewModel.mail)];
                                            case 1:
                                                mailboxDetails = _b.sent();
                                                return [4 /*yield*/, Promise.resolve().then(function () { return require("../../settings/AddInboxRuleDialog"); })];
                                            case 2:
                                                _a = _b.sent(), show = _a.show, createInboxRuleTemplate = _a.createInboxRuleTemplate;
                                                newRule = rule_1 !== null && rule_1 !== void 0 ? rule_1 : createInboxRuleTemplate(defaultInboxRuleField, mailAddress.address.trim().toLowerCase());
                                                show(mailboxDetails, newRule);
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }
                            });
                        }
                        if (this.viewModel.canCreateSpamRule()) {
                            buttons.push({
                                label: "addSpamRule_action",
                                click: function () { return _this.addSpamRule(defaultInboxRuleField, mailAddress.address); }
                            });
                        }
                        _b.label = 3;
                    case 3: return [2 /*return*/, buttons];
                }
            });
        });
    };
    MailViewer.prototype.handleDoubleTap = function (e, singleClickAction, doubleClickAction) {
        var _this = this;
        var lastClick = this.lastBodyTouchEndTime;
        var now = Date.now();
        var touch = e.changedTouches[0];
        // If there are no touches or it's not cancellable event (e.g. scroll) or more than certain time has passed or finger moved too
        // much then do nothing
        if (!touch ||
            !e.cancelable ||
            Date.now() - this.lastTouchStart.time > DOUBLE_TAP_TIME_MS ||
            touch.clientX - this.lastTouchStart.x > 40 ||
            touch.clientY - this.lastTouchStart.y > 40) {
            return;
        }
        e.preventDefault();
        if (now - lastClick < DOUBLE_TAP_TIME_MS) {
            this.isScaling = !this.isScaling;
            this.lastBodyTouchEndTime = 0;
            doubleClickAction(e);
        }
        else {
            setTimeout(function () {
                if (_this.lastBodyTouchEndTime === now) {
                    singleClickAction(e);
                }
            }, DOUBLE_TAP_TIME_MS);
        }
        this.lastBodyTouchEndTime = now;
    };
    MailViewer.prototype.setContentBlockingStatus = function (status) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.viewModel.setContentBlockingStatus(status)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MailViewer.prototype.addSpamRule = function (defaultInboxRuleField, address) {
        var folder = this.viewModel.mailModel.getMailFolder((0, EntityUtils_1.getListId)(this.viewModel.mail));
        var spamRuleType = folder && folder.folderType === TutanotaConstants_1.MailFolderType.SPAM ? TutanotaConstants_1.SpamRuleType.WHITELIST : TutanotaConstants_1.SpamRuleType.BLACKLIST;
        var spamRuleField;
        switch (defaultInboxRuleField) {
            case "1" /* InboxRuleType.RECIPIENT_TO_EQUALS */:
                spamRuleField = "1" /* SpamRuleFieldType.TO */;
                break;
            case "2" /* InboxRuleType.RECIPIENT_CC_EQUALS */:
                spamRuleField = "2" /* SpamRuleFieldType.CC */;
                break;
            case "3" /* InboxRuleType.RECIPIENT_BCC_EQUALS */:
                spamRuleField = "3" /* SpamRuleFieldType.BCC */;
                break;
            default:
                spamRuleField = "0" /* SpamRuleFieldType.FROM */;
                break;
        }
        Promise.resolve().then(function () { return require("../../settings/AddSpamRuleDialog"); }).then(function (_a) {
            var showAddSpamRuleDialog = _a.showAddSpamRuleDialog;
            showAddSpamRuleDialog((0, TypeRefs_js_1.createEmailSenderListElement)({
                value: address.trim().toLowerCase(),
                type: spamRuleType,
                field: spamRuleField
            }));
        });
    };
    MailViewer.prototype.scrollUp = function () {
        this.scrollIfDomBody(function (dom) {
            var current = dom.scrollTop;
            var toScroll = dom.clientHeight * SCROLL_FACTOR;
            return (0, Animations_1.scroll)(current, Math.max(0, current - toScroll));
        });
    };
    MailViewer.prototype.scrollDown = function () {
        this.scrollIfDomBody(function (dom) {
            var current = dom.scrollTop;
            var toScroll = dom.clientHeight * SCROLL_FACTOR;
            return (0, Animations_1.scroll)(current, Math.min(dom.scrollHeight - dom.offsetHeight, dom.scrollTop + toScroll));
        });
    };
    MailViewer.prototype.scrollToTop = function () {
        this.scrollIfDomBody(function (dom) {
            return (0, Animations_1.scroll)(dom.scrollTop, 0);
        });
    };
    MailViewer.prototype.scrollToBottom = function () {
        this.scrollIfDomBody(function (dom) {
            var end = dom.scrollHeight - dom.offsetHeight;
            return (0, Animations_1.scroll)(dom.scrollTop, end);
        });
    };
    MailViewer.prototype.scrollIfDomBody = function (cb) {
        var _this = this;
        if (this.scrollDom) {
            var dom = this.scrollDom;
            if (!this.scrollAnimation) {
                this.scrollAnimation = Animations_1.animations
                    .add(dom, cb(dom), {
                    easing: Easing_1.ease.inOut
                })
                    .then(function () {
                    _this.scrollAnimation = null;
                });
            }
        }
    };
    MailViewer.prototype.handleAnchorClick = function (event, href, shouldDispatchSyntheticClick) {
        if (href) {
            if (href.startsWith("mailto:")) {
                event.preventDefault();
                if ((0, NavFunctions_1.isNewMailActionAvailable)()) {
                    // disable new mails for external users.
                    Promise.resolve().then(function () { return require("../editor/MailEditor"); }).then(function (_a) {
                        var newMailtoUrlMailEditor = _a.newMailtoUrlMailEditor;
                        newMailtoUrlMailEditor(href, !LoginController_1.logins.getUserController().props.defaultUnconfidential)
                            .then(function (editor) { return editor.show(); })["catch"]((0, tutanota_utils_1.ofClass)(CancelledError_1.CancelledError, tutanota_utils_1.noOp));
                    });
                }
            }
            else if (isSettingsLink(href, this.viewModel.mail)) {
                // Navigate to the settings menu if they are linked within an email.
                var newRoute = href.substring(href.indexOf("/settings/"));
                mithril_1["default"].route.set(newRoute);
                event.preventDefault();
            }
            else if (shouldDispatchSyntheticClick) {
                var syntheticTag = document.createElement("a");
                syntheticTag.setAttribute("href", href);
                syntheticTag.setAttribute("target", "_blank");
                syntheticTag.setAttribute("rel", "noopener noreferrer");
                var newClickEvent = new MouseEvent("click");
                syntheticTag.dispatchEvent(newClickEvent);
            }
        }
    };
    return MailViewer;
}());
exports.MailViewer = MailViewer;
function createMailViewerViewModel(_a) {
    var mail = _a.mail, showFolder = _a.showFolder, delayBodyRenderingUntil = _a.delayBodyRenderingUntil;
    return new MailViewerViewModel_1.MailViewerViewModel(mail, showFolder, delayBodyRenderingUntil !== null && delayBodyRenderingUntil !== void 0 ? delayBodyRenderingUntil : Promise.resolve(), MainLocator_1.locator.entityClient, MainLocator_1.locator.mailModel, MainLocator_1.locator.contactModel, MainLocator_1.locator.configFacade, (0, Env_1.isDesktop)() ? MainLocator_1.locator.desktopSystemFacade : null, MainLocator_1.locator.fileFacade, MainLocator_1.locator.fileController, LoginController_1.logins, MainLocator_1.locator.serviceExecutor);
}
exports.createMailViewerViewModel = createMailViewerViewModel;
/**
 * support and invoice mails can contain links to the settings page.
 * we don't want normal mails to be able to link places in the app, though.
 * */
function isSettingsLink(href, mail) {
    var _a;
    return ((_a = href.startsWith("/settings/")) !== null && _a !== void 0 ? _a : false) && (0, MailUtils_1.isTutanotaTeamMail)(mail);
}
function assertNonNull(value) {
    if (value == null) {
        throw new ProgrammingError_js_1.ProgrammingError("it is null");
    }
}
