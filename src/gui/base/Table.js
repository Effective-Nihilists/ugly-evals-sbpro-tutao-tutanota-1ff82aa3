"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.createRowActions = exports.Table = void 0;
var mithril_1 = require("mithril");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var Icon_1 = require("./Icon");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Dropdown_js_1 = require("./Dropdown.js");
var Env_1 = require("../../api/common/Env");
var IconButton_js_1 = require("./IconButton.js");
var size_js_1 = require("../size.js");
(0, Env_1.assertMainOrNode)();
/**
 * Shows a table of TableLine entries. The last column of the table may show action buttons for each TableLine and/or an add button.
 * The table shows a loading spinner until updateEntries() is called the first time.
 */
var Table = /** @class */ (function () {
    function Table() {
    }
    Table.prototype.view = function (vnode) {
        var _this = this;
        var _a;
        var a = vnode.attrs;
        var loading = !a.lines;
        var alignments = a.columnAlignments || [];
        var lineAttrs = a.lines ? a.lines.map(function (lineAttrs) { return _this._createLine(lineAttrs, a.showActionButtonColumn, a.columnWidths, false, alignments, false); }) : [];
        return (0, mithril_1["default"])("", [
            (0, mithril_1["default"])("table.table".concat(a.columnHeading ? ".table-header-border" : ""), [
                (a.columnHeading
                    ? [
                        this._createLine({
                            cells: a.columnHeading.map(function (textIdOrFunction) { return LanguageViewModel_1.lang.getMaybeLazy(textIdOrFunction); }),
                            actionButtonAttrs: loading ? null : a.addButtonAttrs
                        }, a.showActionButtonColumn, a.columnWidths, true, alignments, (_a = a.verticalColumnHeadings) !== null && _a !== void 0 ? _a : false),
                    ]
                    : []).concat(lineAttrs),
            ]),
            loading ? (0, mithril_1["default"])(".flex-center.items-center.button-height", (0, Icon_1.progressIcon)()) : null,
            !loading && (0, tutanota_utils_1.neverNull)(a.lines).length === 0 ? (0, mithril_1["default"])(".flex-center.items-center.button-height", LanguageViewModel_1.lang.get("noEntries_msg")) : null,
        ]);
    };
    Table.prototype._createLine = function (lineAttrs, showActionButtonColumn, columnWidths, bold, columnAlignments, verticalText) {
        var cells;
        if (typeof lineAttrs.cells == "function") {
            cells = lineAttrs.cells().map(function (cellTextData, index) {
                return (0, mithril_1["default"])("td", [
                    (0, mithril_1["default"])(".text-ellipsis.pr.pt-s" +
                        columnWidths[index] +
                        (bold ? ".b" : "") +
                        (cellTextData.click ? ".click" : "" + (cellTextData.mainStyle ? cellTextData.mainStyle : "")) +
                        (columnAlignments[index] ? ".right" : ""), {
                        title: cellTextData.main,
                        // show the text as tooltip, so ellipsed lines can be shown
                        onclick: function (event) {
                            var dom = (0, tutanota_utils_1.downcast)(event.target);
                            cellTextData.click ? cellTextData.click(event, dom) : null;
                        }
                    }, verticalText ? (0, mithril_1["default"])("span.vertical-text", cellTextData.main) : cellTextData.main),
                    (0, mithril_1["default"])(".small.text-ellipsis.pr" + (cellTextData.click ? ".click" : ""), {
                        onclick: function (event) {
                            var dom = (0, tutanota_utils_1.downcast)(event.target);
                            cellTextData.click ? cellTextData.click(event, dom) : null;
                        }
                    }, cellTextData.info ? cellTextData.info.map(function (line) { return (0, mithril_1["default"])("", line); }) : null),
                ]);
            });
        }
        else {
            cells = lineAttrs.cells.map(function (text, index) {
                return (0, mithril_1["default"])("td.text-ellipsis.pr.pt-s.pb-s." + columnWidths[index] + (bold ? ".b" : "") + (columnAlignments[index] ? ".right" : ""), {
                    title: text
                }, verticalText ? (0, mithril_1["default"])("span.vertical-text", text) : text);
            });
        }
        if (showActionButtonColumn) {
            cells.push((0, mithril_1["default"])("td", {
                style: {
                    width: (0, size_js_1.px)(size_js_1.size.button_height_compact)
                }
            }, lineAttrs.actionButtonAttrs
                ? (0, mithril_1["default"])(IconButton_js_1.IconButton, lineAttrs.actionButtonAttrs)
                : []));
        }
        return (0, mithril_1["default"])("tr.selectable", cells);
    };
    return Table;
}());
exports.Table = Table;
function createRowActions(instance, currentElement, indexOfElement, prefixActions) {
    if (prefixActions === void 0) { prefixActions = []; }
    var elements = instance.getArray();
    var makeButtonAttrs = function () { return __spreadArray(__spreadArray([], prefixActions, true), [
        indexOfElement > 1
            ? {
                label: "moveToTop_action",
                click: function () {
                    elements.splice(indexOfElement, 1);
                    elements.unshift(currentElement);
                    instance.updateInstance();
                }
            }
            : null,
        indexOfElement > 0
            ? {
                label: "moveUp_action",
                click: function () {
                    var prev = elements[indexOfElement - 1];
                    elements[indexOfElement - 1] = currentElement;
                    elements[indexOfElement] = prev;
                    instance.updateInstance();
                }
            }
            : null,
        indexOfElement < instance.getArray().length - 1
            ? {
                label: "moveDown_action",
                click: function () {
                    var next = elements[indexOfElement + 1];
                    elements[indexOfElement + 1] = currentElement;
                    elements[indexOfElement] = next;
                    instance.updateInstance();
                }
            }
            : null,
        indexOfElement < instance.getArray().length - 2
            ? {
                label: "moveToBottom_action",
                click: function () {
                    elements.splice(indexOfElement, 1);
                    elements.push(currentElement);
                    instance.updateInstance();
                }
            }
            : null,
        {
            label: "delete_action",
            click: function () {
                elements.splice(indexOfElement, 1);
                instance.updateInstance();
            }
        },
    ], false); };
    return {
        title: "edit_action",
        click: (0, Dropdown_js_1.createDropdown)({ lazyButtons: makeButtonAttrs, width: 260 }),
        icon: "More" /* Icons.More */,
        size: 1 /* ButtonSize.Compact */
    };
}
exports.createRowActions = createRowActions;
