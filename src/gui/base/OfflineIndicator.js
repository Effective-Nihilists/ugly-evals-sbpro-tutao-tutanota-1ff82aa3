"use strict";
exports.__esModule = true;
exports.OfflineIndicatorMobile = exports.OfflineIndicatorDesktop = void 0;
var mithril_1 = require("mithril");
var theme_1 = require("../theme");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
/**
 * the first line of the offline indicator shows if we're offline or online and
 * adds action prompts (if any)
 * it's returned as a span so the consumer can decide how to layout it.
 */
function attrToFirstLine(attr) {
    var state = attr.state;
    switch (state) {
        case 3 /* OfflineIndicatorState.Online */:
        case 2 /* OfflineIndicatorState.Synchronizing */:
            return (0, mithril_1["default"])("span", LanguageViewModel_1.lang.get("online_label"));
        case 0 /* OfflineIndicatorState.Offline */:
            return [
                (0, mithril_1["default"])("span", LanguageViewModel_1.lang.get("offline_label")),
                (0, mithril_1["default"])("span.b.content-accent-fg.mlr-s", LanguageViewModel_1.lang.get("reconnect_action")),
            ];
        case 1 /* OfflineIndicatorState.Connecting */:
            return (0, mithril_1["default"])("span", LanguageViewModel_1.lang.get("offline_label"));
    }
}
/**
 * the second line provides additional information about the current state.
 * it's returned as a span so the consumer can decide how to layout it.
 */
function attrToSecondLine(a) {
    switch (a.state) {
        case 3 /* OfflineIndicatorState.Online */:
            return (0, mithril_1["default"])("span", LanguageViewModel_1.lang.get("upToDate_label"));
        case 0 /* OfflineIndicatorState.Offline */:
            if (a.lastUpdate) {
                return (0, mithril_1["default"])("span", LanguageViewModel_1.lang.get("lastSync_label", { "{date}": formatDate(a.lastUpdate) }));
            }
            else {
                // never synced, don't show last sync label
                return null;
            }
        case 2 /* OfflineIndicatorState.Synchronizing */:
            return (0, mithril_1["default"])("span", LanguageViewModel_1.lang.get("synchronizing_label", { "{progress}": formatPercentage(a.progress) }));
        case 1 /* OfflineIndicatorState.Connecting */:
            return (0, mithril_1["default"])("span", LanguageViewModel_1.lang.get("reconnecting_label"));
    }
}
/**
 * format a number as a percentage string with 0 = 0% and 1 = 100%
 */
function formatPercentage(percentage) {
    return "".concat(Math.round(percentage * 100), "%");
}
/*
* format a date either as a time without date (if it's today) or
* as a date without time
 */
function formatDate(date) {
    return (0, tutanota_utils_1.isSameDayOfDate)(new Date(), date)
        ? LanguageViewModel_1.lang.formats.time.format(date)
        : LanguageViewModel_1.lang.formats.simpleDate.format(date);
}
var OfflineIndicatorDesktop = /** @class */ (function () {
    function OfflineIndicatorDesktop() {
    }
    OfflineIndicatorDesktop.prototype.view = function (vnode) {
        var a = vnode.attrs;
        return (0, mithril_1["default"])("button.small.pt-s.mlr-l.flex.col", {
            type: "button",
            href: "#",
            tabindex: "0",
            role: "button",
            onclick: a.state === 0 /* OfflineIndicatorState.Offline */ ? a.reconnectAction : tutanota_utils_1.noOp
        }, [
            (0, mithril_1["default"])("", { color: theme_1.theme.content_accent }, attrToFirstLine(a)),
            (0, mithril_1["default"])("", { color: theme_1.theme.content_accent }, attrToSecondLine(a))
        ]);
    };
    return OfflineIndicatorDesktop;
}());
exports.OfflineIndicatorDesktop = OfflineIndicatorDesktop;
var OfflineIndicatorMobile = /** @class */ (function () {
    function OfflineIndicatorMobile() {
    }
    OfflineIndicatorMobile.prototype.view = function (vnode) {
        var a = vnode.attrs;
        var secondLine = attrToSecondLine(a);
        return (0, mithril_1["default"])("button.small.center.mb-xs", {
            type: "button",
            href: "#",
            tabindex: "0",
            role: "button",
            onclick: a.state === 0 /* OfflineIndicatorState.Offline */ ? a.reconnectAction : tutanota_utils_1.noOp
        }, attrToFirstLine(a));
    };
    return OfflineIndicatorMobile;
}());
exports.OfflineIndicatorMobile = OfflineIndicatorMobile;
