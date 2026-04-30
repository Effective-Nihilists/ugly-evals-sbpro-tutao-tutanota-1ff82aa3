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
exports.renderAcceptGiftCardTermsCheckbox = exports.renderGiftCardSvg = exports.showGiftCardToShare = exports.generateGiftCardLink = exports.loadGiftCards = exports.getTokenFromUrl = void 0;
var mithril_1 = require("mithril");
var qrcode_svg_1 = require("qrcode-svg");
var TypeRefs_js_1 = require("../../api/entities/sys/TypeRefs.js");
var MainLocator_1 = require("../../api/main/MainLocator");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var UserError_1 = require("../../api/main/UserError");
var Dialog_1 = require("../../gui/base/Dialog");
var Button_js_1 = require("../../gui/base/Button.js");
var HtmlSanitizer_1 = require("../../misc/HtmlSanitizer");
var size_1 = require("../../gui/size");
var theme_1 = require("../../gui/theme");
var Animations_1 = require("../../gui/animation/Animations");
var ClipboardUtils_1 = require("../../misc/ClipboardUtils");
var Env_1 = require("../../api/common/Env");
var Checkbox_js_1 = require("../../gui/base/Checkbox.js");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var PriceUtils_1 = require("../PriceUtils");
var TermsAndConditions_1 = require("../TermsAndConditions");
function getTokenFromUrl(url) {
    return __awaiter(this, void 0, void 0, function () {
        var token, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = url.substring(url.indexOf("#") + 1);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    if (!token) {
                        throw new Error();
                    }
                    return [4 /*yield*/, MainLocator_1.locator.giftCardFacade.decodeGiftCardToken(token)];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    e_1 = _a.sent();
                    throw new UserError_1.UserError("invalidGiftCard_msg");
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getTokenFromUrl = getTokenFromUrl;
function loadGiftCards(customerId) {
    var entityClient = MainLocator_1.locator.entityClient;
    return entityClient
        .load(TypeRefs_js_1.CustomerTypeRef, customerId)
        .then(function (customer) { return entityClient.load(TypeRefs_js_1.CustomerInfoTypeRef, customer.customerInfo); })
        .then(function (customerInfo) {
        if (customerInfo.giftCards) {
            return entityClient.loadAll(TypeRefs_js_1.GiftCardTypeRef, customerInfo.giftCards.items);
        }
        else {
            return Promise.resolve([]);
        }
    });
}
exports.loadGiftCards = loadGiftCards;
function generateGiftCardLink(giftCard) {
    return __awaiter(this, void 0, void 0, function () {
        var token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, MainLocator_1.locator.giftCardFacade.encodeGiftCardToken(giftCard)];
                case 1:
                    token = _a.sent();
                    return [2 /*return*/, (0, Env_1.getWebRoot)() + "/giftcard/#".concat(token)];
            }
        });
    });
}
exports.generateGiftCardLink = generateGiftCardLink;
function showGiftCardToShare(giftCard) {
    generateGiftCardLink(giftCard).then(function (link) {
        var dialog;
        var infoMessage = "emptyString_msg";
        var message = giftCard.message;
        var giftCardDomElement;
        dialog = Dialog_1.Dialog.largeDialog({
            right: [
                {
                    type: "secondary" /* ButtonType.Secondary */,
                    label: "close_alt",
                    click: function () { return dialog.close(); }
                },
            ],
            middle: function () { return LanguageViewModel_1.lang.get("giftCard_label"); }
        }, {
            view: function () {
                return (0, mithril_1["default"])("", [
                    (0, mithril_1["default"])(".flex-center.full-width.pt.pb", [
                        (0, mithril_1["default"])("", {
                            style: {
                                width: "480px"
                            }
                        }, (0, mithril_1["default"])(".pt-l", {
                            oncreate: function (vnode) {
                                var children = vnode.children;
                                var domChild = children[0];
                                giftCardDomElement = domChild.dom;
                            }
                        }, renderGiftCardSvg(parseFloat(giftCard.value), link, message))),
                    ]),
                    (0, mithril_1["default"])(".flex-center", [
                        (0, mithril_1["default"])(Button_js_1.Button, {
                            click: function () {
                                dialog.close();
                                setTimeout(function () { return Promise.resolve().then(function () { return require("../../mail/editor/MailEditor"); }).then(function (editor) { return editor.writeGiftCardMail(link, giftCardDomElement); }); }, Animations_1.DefaultAnimationTime);
                            },
                            label: "shareViaEmail_action",
                            icon: function () { return "Mail" /* BootIcons.Mail */; }
                        }),
                        (0, Env_1.isAndroidApp)()
                            ? (0, mithril_1["default"])(Button_js_1.Button, {
                                click: function () {
                                    MainLocator_1.locator.systemFacade.shareText(LanguageViewModel_1.lang.get("nativeShareGiftCard_msg", {
                                        "{link}": link
                                    }), LanguageViewModel_1.lang.get("nativeShareGiftCard_label"));
                                },
                                label: "share_action",
                                icon: function () { return "Share" /* BootIcons.Share */; }
                            })
                            : (0, mithril_1["default"])(Button_js_1.Button, {
                                click: function () {
                                    (0, ClipboardUtils_1.copyToClipboard)(link)
                                        .then(function () {
                                        infoMessage = "giftCardCopied_msg";
                                    })["catch"](function () {
                                        infoMessage = "copyLinkError_msg";
                                    });
                                },
                                label: "copyToClipboard_action",
                                icon: function () { return "Clipboard" /* Icons.Clipboard */; }
                            }),
                        !(0, Env_1.isApp)()
                            ? (0, mithril_1["default"])(Button_js_1.Button, {
                                click: function () {
                                    infoMessage = "emptyString_msg";
                                    window.print();
                                },
                                label: "print_action",
                                icon: function () { return "Print" /* Icons.Print */; }
                            })
                            : null,
                    ]),
                    (0, mithril_1["default"])(".flex-center", (0, mithril_1["default"])("small.noprint", LanguageViewModel_1.lang.getMaybeLazy(infoMessage))),
                ]);
            }
        })
            .addShortcut({
            key: TutanotaConstants_1.Keys.ESC,
            exec: function () { return dialog.close(); },
            help: "close_alt"
        })
            .show();
    });
}
exports.showGiftCardToShare = showGiftCardToShare;
function renderGiftCardSvg(price, link, message) {
    var qrCode = null;
    var qrCodeSize = 80;
    if (link) {
        var qrcodeGenerator = new qrcode_svg_1["default"]({
            height: qrCodeSize,
            width: qrCodeSize,
            content: link,
            background: theme_1.theme.content_accent,
            color: theme_1.theme.content_bg,
            xmlDeclaration: false,
            container: "none"
        });
        var svg = qrcodeGenerator.svg();
        qrCode = HtmlSanitizer_1.htmlSanitizer.sanitizeSVG(svg).html;
    }
    var formattedPrice = (0, PriceUtils_1.formatPrice)(price, true);
    var baseHeight = 220;
    var height = link ? baseHeight + qrCodeSize : baseHeight + 5; // a bit of padding if there's no qrcode
    var width = 240;
    var borderRadius = 20;
    // Do not change this value. Needs to remain consistent with the SVG path data
    var logoPathWidth = 153;
    var logoWidth = 180;
    var topBottomPadding = 20;
    var logoScale = logoWidth / logoPathWidth;
    var messageBoxTop = 80;
    var messageBoxHeight = 75;
    var qrCodeTopPadding = 10;
    var qrCodeTop = messageBoxTop + messageBoxHeight + qrCodeTopPadding;
    var giftCardLabelTopOffset = 45;
    var centered = function (elementWidth, totalWidth) {
        if (totalWidth === void 0) { totalWidth = width; }
        return totalWidth / 2 - elementWidth / 2;
    };
    var squiggleStart = 117;
    var qrCodePadding = 5;
    var qrCodeLeft = 32;
    var priceY = 35;
    return (0, mithril_1["default"])("svg", {
        style: {
            color: theme_1.theme.elevated_bg,
            maxWidth: "960px",
            minwidth: "480px",
            "border-radius": (0, size_1.px)(borderRadius),
            filter: "drop-shadow(10px 10px 10px #00000088)"
        },
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 ".concat(width, " ").concat(height)
    }, [
        (0, mithril_1["default"])("rect", {
            width: "100%",
            height: "100%",
            style: {
                fill: theme_1.theme.content_accent,
                "-webkit-print-color-adjust": "exact",
                "color-adjust": "exact"
            }
        }),
        (0, mithril_1["default"])("g", {
            transform: "translate(".concat(centered(logoWidth), ", ").concat(topBottomPadding, ") scale(").concat(logoScale, ")")
        }, [
            (0, mithril_1["default"])("path", {
                /* tutanota logo text */
                fill: theme_1.theme.elevated_bg,
                d: "M9.332 1.767H0V0h20.585v1.767h-9.333V28.42h-1.92zM20.086 22.89V8.257h1.843v14.402c0 3.073 1.344 4.57 4.417 4.57 2.803 0 5.146-1.459 7.642-3.84V8.257h1.844V28.42h-1.846v-3.341c-2.227 2.112-4.839 3.764-7.796 3.764-4.186 0-6.106-2.305-6.106-5.953zm23.85 1.037V9.908h-3.534V8.257h3.533V.922h1.844v7.335h5.261v1.652h-5.261v13.748c0 2.151.73 3.38 3.264 3.38.768 0 1.536-.077 2.112-.268v1.728c-.652.115-1.42.192-2.265.192-3.342 0-4.955-1.344-4.955-4.762zm11.136-.154c0-3.84 3.264-6.721 13.865-8.488v-1.229c0-3.072-1.614-4.608-4.379-4.608-3.341 0-5.569 1.305-7.835 3.341l-1.075-1.152c2.497-2.304 5.07-3.802 8.948-3.802 4.187 0 6.184 2.38 6.184 6.106v9.486c0 2.458.154 3.956.576 4.993h-1.96a9.82 9.82 0 01-.46-2.996c-2.459 2.113-5.147 3.342-8.181 3.342-3.687 0-5.684-1.92-5.684-4.993zm13.864-.154v-6.951c-9.831 1.728-12.02 4.147-12.02 6.99 0 2.265 1.497 3.494 3.993 3.494 2.996 0 5.723-1.305 8.027-3.533zm8.143 4.801V8.142h3.34v3.033c1.768-1.728 4.302-3.456 7.605-3.456 3.88 0 5.991 2.227 5.991 6.068v14.632h-3.302V14.517c0-2.688-1.152-3.955-3.726-3.955-2.419 0-4.455 1.267-6.567 3.264V28.42zm21.775-10.14c0-6.989 4.455-10.56 9.448-10.56 4.954 0 9.41 3.571 9.41 10.56 0 6.952-4.456 10.562-9.41 10.562-4.955 0-9.448-3.61-9.448-10.561zm15.516 0c0-4.224-2.036-7.719-6.068-7.719-3.88 0-6.107 3.15-6.107 7.72 0 4.301 1.997 7.758 6.107 7.758 3.84 0 6.068-3.111 6.068-7.758zm9.83 5.224V10.869h-3.532V8.142h3.533V.922h3.303v7.22h5.261v2.727h-5.262v11.906c0 2.15.692 3.226 3.15 3.226.73 0 1.536-.116 2.074-.27v2.728c-.577.115-1.844.23-2.88.23-4.264 0-5.646-1.651-5.646-5.185zm12.137.115c0-4.11 3.495-7.028 13.557-8.45v-.92c0-2.536-1.344-3.764-3.84-3.764-3.073 0-5.339 1.344-7.336 3.072l-1.728-2.074c2.342-2.15 5.377-3.764 9.41-3.764 4.838 0 6.758 2.535 6.758 6.76v8.948c0 2.458.154 3.956.577 4.993h-3.38c-.269-.845-.46-1.652-.46-2.804-2.267 2.113-4.801 3.111-7.836 3.111-3.495 0-5.722-1.843-5.722-5.108zm13.557-.46v-5.684c-7.72 1.229-10.293 3.11-10.293 5.645 0 1.959 1.306 2.996 3.418 2.996 2.689 0 4.993-1.114 6.875-2.958z"
            }),
            (0, mithril_1["default"])("text", {
                /* translation of "gift card" */
                "text-anchor": "end",
                x: logoPathWidth,
                y: giftCardLabelTopOffset,
                fill: theme_1.theme.elevated_bg
            }, LanguageViewModel_1.lang.get("giftCard_label")),
        ]),
        (0, mithril_1["default"])("foreignObject", {
            x: centered(logoPathWidth),
            y: messageBoxTop,
            width: logoPathWidth,
            height: messageBoxHeight
        }, (0, mithril_1["default"])("p.text-preline.text-break.color-adjust-exact.monospace.text-center", {
            xmlns: "http://www.w3.org/1999/xhtml",
            style: {
                margin: 0,
                fontSize: ".6rem",
                color: theme_1.theme.elevated_bg,
                "font-family": "monospace"
            }
        }, message)),
        (0, mithril_1["default"])("text", {
            /* price */
            "text-anchor": "start",
            x: qrCodeLeft,
            y: height - priceY,
            fill: theme_1.theme.elevated_bg,
            "font-size": "1.6rem"
        }, formattedPrice),
        (0, mithril_1["default"])("text", {
            /* valid in */
            "text-anchor": "start",
            x: qrCodeLeft,
            y: height - topBottomPadding - 5,
            fill: theme_1.theme.elevated_bg,
            "font-size": ".4rem"
        }),
        qrCode
            ? (0, mithril_1["default"])("g", {
                transform: "translate(".concat(qrCodeLeft - qrCodePadding, " ").concat(qrCodeTop, ")")
            }, mithril_1["default"].trust(qrCode))
            : null,
        (0, mithril_1["default"])("path", {
            fill: theme_1.theme.elevated_bg,
            transform: "translate(".concat(squiggleStart, " ").concat(height - 80, ")"),
            d: "M74.483 0s8.728 1.406 8.713 4.992c0 .12-.011.237-.029.357-.612 3.86-13.283 3.762-18.682 4.23-5.394.459-20.04.149-23.739 6.625a1.996 1.996 0 00-.28.97c-.043 5.903 30.74 9.897 32.5 22.778.06.422.088.844.088 1.262-.025 13.047-27.86 24.602-61.907 38.193C7.43 80.891 3.78 82.585 0 83.896h127.618v-28.16c-3.2-8.982-9.027-17.293-19.193-22.564C87.613 22.37 55.084 20.366 53.693 16.204c-.06-.177-.09-.35-.085-.516.03-2.846 8.905-3.51 14.734-3.802 6.162-.302 15.481-1.135 16.622-5.56.056-.213.08-.422.08-.624C85.075 1.582 74.484 0 74.484 0z"
        }),
    ]);
}
exports.renderGiftCardSvg = renderGiftCardSvg;
function renderAcceptGiftCardTermsCheckbox(checked, onChecked) {
    return (0, mithril_1["default"])(Checkbox_js_1.Checkbox, {
        checked: checked,
        onChecked: onChecked,
        label: function () { return [
            (0, mithril_1["default"])("", LanguageViewModel_1.lang.get("termsAndConditions_label")),
            (0, mithril_1["default"])("div", (0, TermsAndConditions_1.renderTermsAndConditionsButton)("giftCardsTerms-entries" /* TermsSection.GiftCards */, TermsAndConditions_1.CURRENT_GIFT_CARD_TERMS_VERSION)),
        ]; }
    });
}
exports.renderAcceptGiftCardTermsCheckbox = renderAcceptGiftCardTermsCheckbox;
