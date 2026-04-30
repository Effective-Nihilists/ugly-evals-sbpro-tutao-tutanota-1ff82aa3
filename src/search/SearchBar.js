"use strict";
exports.__esModule = true;
exports.SearchBar = void 0;
var mithril_1 = require("mithril");
var LoginController_1 = require("../api/main/LoginController");
var size_1 = require("../gui/size");
var stream_1 = require("mithril/stream");
var theme_1 = require("../gui/theme");
var Icon_1 = require("../gui/base/Icon");
var Animations_1 = require("../gui/animation/Animations");
var Overlay_1 = require("../gui/base/Overlay");
var TypeRefs_js_1 = require("../api/entities/tutanota/TypeRefs.js");
var KeyManager_1 = require("../misc/KeyManager");
var RestError_1 = require("../api/common/error/RestError");
var SearchUtils_1 = require("./model/SearchUtils");
var MainLocator_1 = require("../api/main/MainLocator");
var Dialog_1 = require("../gui/base/Dialog");
var TypeRefs_js_2 = require("../api/entities/sys/TypeRefs.js");
var TutanotaConstants_1 = require("../api/common/TutanotaConstants");
var Env_1 = require("../api/common/Env");
var styles_1 = require("../gui/styles");
var ClientDetector_1 = require("../misc/ClientDetector");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var List_1 = require("../gui/base/List");
var SearchModel_1 = require("./model/SearchModel");
var SearchBarOverlay_1 = require("./SearchBarOverlay");
var IndexingNotSupportedError_1 = require("../api/common/error/IndexingNotSupportedError");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var AriaUtils_1 = require("../gui/AriaUtils");
var EntityUtils_1 = require("../api/common/utils/EntityUtils");
var ContactGuiUtils_1 = require("../contacts/view/ContactGuiUtils");
(0, Env_1.assertMainOrNode)();
var SEARCH_INPUT_WIDTH = 200; // includes input field and close/progress icon
var MAX_SEARCH_PREVIEW_RESULTS = 10;
var SearchBar = /** @class */ (function () {
    function SearchBar() {
        var _this = this;
        this._closeOverlayFunction = null;
        this._confirmDialogShown = false;
        this._doSearch = (0, tutanota_utils_1.debounce)(300, function (query, restriction, cb) {
            var useSuggestions = mithril_1["default"].route.get().startsWith("/settings");
            // We don't limit contacts because we need to download all of them to sort them. They should be cached anyway.
            var limit = (0, tutanota_utils_1.isSameTypeRef)(TypeRefs_js_1.MailTypeRef, restriction.type) ? (_this._isQuickSearch() ? MAX_SEARCH_PREVIEW_RESULTS : List_1.PageSize) : null;
            MainLocator_1.locator.search
                .search({
                query: query !== null && query !== void 0 ? query : "",
                restriction: restriction,
                minSuggestionCount: useSuggestions ? 10 : 0,
                maxResults: limit
            })
                .then(function (result) { return _this._loadAndDisplayResult(query, result ? result : null, limit); })["finally"](function () { return cb(); });
        });
        this._groupInfoRestrictionListId = null;
        this.lastSelectedGroupInfoResult = (0, stream_1["default"])();
        this.lastSelectedWhitelabelChildrenInfoResult = (0, stream_1["default"])();
        this.focused = false;
        this.skipNextBlur = (0, stream_1["default"])(false);
        this.busy = false;
        this._returnListener = tutanota_utils_1.noOp;
        this._state = (0, stream_1["default"])({
            query: "",
            searchResult: null,
            indexState: MainLocator_1.locator.search.indexState(),
            entities: [],
            selected: null
        });
        this._overlayContentComponent = {
            view: function () {
                return (0, mithril_1["default"])(SearchBarOverlay_1.SearchBarOverlay, {
                    state: _this._state(),
                    isQuickSearch: _this._isQuickSearch(),
                    isFocused: _this.focused,
                    isExpanded: _this.expanded,
                    skipNextBlur: _this.skipNextBlur,
                    selectResult: function (selected) { return _this._selectResult(selected); }
                });
            }
        };
        var stateStream;
        var lastQueryStream;
        var indexStateStream;
        var shortcuts;
        // a little optimization to not call getRestriction() on every redraw
        var lastPath = null;
        this.view = function (vnode) {
            var newPath = mithril_1["default"].route.get();
            if (lastPath == null || newPath !== lastPath) {
                lastPath = newPath;
                if (MainLocator_1.locator.search.isNewSearch(_this._state().query, (0, SearchUtils_1.getRestriction)(newPath))) {
                    _this._updateState({
                        searchResult: null,
                        entities: []
                    });
                }
            }
            return (0, mithril_1["default"])(".flex" + (vnode.attrs.classes || ""), {
                style: vnode.attrs.style
            }, [
                (0, mithril_1["default"])(".search-bar.flex-end.items-center" + (0, AriaUtils_1.landmarkAttrs)("search" /* AriaLandmarks.Search */), {
                    oncreate: function (vnode) {
                        _this._domWrapper = vnode.dom;
                        shortcuts = _this._setupShortcuts();
                        KeyManager_1.keyManager.registerShortcuts(shortcuts);
                        indexStateStream = MainLocator_1.locator.search.indexState.map(function (indexState) {
                            // When we finished indexing, search again forcibly to not confuse anyone with old results
                            var currentResult = _this._state().searchResult;
                            if (!indexState.failedIndexingUpTo &&
                                currentResult &&
                                _this._state().indexState.progress !== 0 &&
                                indexState.progress === 0) {
                                _this._doSearch(_this._state().query, currentResult.restriction, mithril_1["default"].redraw);
                            }
                            _this._updateState({
                                indexState: indexState
                            });
                        });
                        stateStream = _this._state.map(function (state) {
                            _this._showOverlay();
                            if (_this._domInput) {
                                var input = _this._domInput;
                                if (state.query !== input.value) {
                                    input.value = state.query;
                                }
                            }
                            mithril_1["default"].redraw();
                        });
                        lastQueryStream = MainLocator_1.locator.search.lastQuery.map(function (value) {
                            // Set value from the model when we it's set from the URL e.g. reloading the page on the search screen
                            if (value) {
                                _this._updateState({
                                    query: value
                                });
                                _this.expanded = true;
                            }
                        });
                    },
                    onremove: function () {
                        shortcuts && KeyManager_1.keyManager.unregisterShortcuts(shortcuts);
                        stateStream === null || stateStream === void 0 ? void 0 : stateStream.end(true);
                        lastQueryStream === null || lastQueryStream === void 0 ? void 0 : lastQueryStream.end(true);
                        indexStateStream === null || indexStateStream === void 0 ? void 0 : indexStateStream.end(true);
                        _this._closeOverlay();
                    },
                    style: {
                        "min-height": (0, size_1.px)(size_1.inputLineHeight + 2),
                        // 2 px border
                        "padding-bottom": _this.expanded ? (_this.focused ? (0, size_1.px)(0) : (0, size_1.px)(1)) : (0, size_1.px)(2),
                        "padding-top": (0, size_1.px)(2),
                        // center input field
                        "margin-right": (0, size_1.px)(styles_1.styles.isDesktopLayout() ? 15 : 8),
                        "border-bottom": vnode.attrs.alwaysExpanded || _this.expanded
                            ? _this.focused
                                ? "2px solid ".concat(theme_1.theme.content_accent)
                                : "1px solid ".concat(theme_1.theme.content_border)
                            : "0px",
                        "align-self": "center",
                        "max-width": (0, size_1.px)(400),
                        flex: "1"
                    }
                }, [
                    styles_1.styles.isDesktopLayout()
                        ? (0, mithril_1["default"])("button.ml-negative-xs.click", {
                            tabindex: "0" /* TabIndex.Default */,
                            title: LanguageViewModel_1.lang.get("search_label"),
                            onmousedown: function () {
                                if (_this.focused) {
                                    _this.skipNextBlur(true); // avoid closing of overlay when clicking search icon
                                }
                            },
                            onclick: function (e) {
                                e.preventDefault();
                                _this.handleSearchClick(e);
                            }
                        }, (0, mithril_1["default"])(Icon_1.Icon, {
                            icon: "Search" /* BootIcons.Search */,
                            "class": "flex-center items-center icon-large",
                            style: {
                                fill: _this.focused ? theme_1.theme.header_button_selected : theme_1.theme.header_button
                            }
                        }))
                        : null,
                    (0, mithril_1["default"])(".searchInputWrapper.flex.items-center", {
                        "aria-hidden": String(!_this.expanded),
                        tabindex: _this.expanded ? "0" /* TabIndex.Default */ : "-1" /* TabIndex.Programmatic */,
                        style: (function () {
                            var paddingLeft;
                            if (_this.expanded || vnode.attrs.alwaysExpanded) {
                                if (styles_1.styles.isDesktopLayout()) {
                                    paddingLeft = (0, size_1.px)(10);
                                }
                                else {
                                    paddingLeft = (0, size_1.px)(6);
                                }
                            }
                            else {
                                paddingLeft = (0, size_1.px)(0);
                            }
                            return {
                                width: _this.inputWrapperWidth(!!vnode.attrs.alwaysExpanded),
                                transition: "width ".concat(Animations_1.DefaultAnimationTime, "ms"),
                                "padding-left": paddingLeft,
                                "padding-top": "3px",
                                "padding-bottom": "3px",
                                "overflow-x": "hidden"
                            };
                        })()
                    }, [
                        _this._getInputField(vnode.attrs),
                        (0, mithril_1["default"])("button.closeIconWrapper", {
                            onclick: function () { return _this.close(); },
                            style: {
                                width: size_1.size.icon_size_large
                            },
                            title: LanguageViewModel_1.lang.get("close_alt"),
                            tabindex: _this.expanded ? "0" /* TabIndex.Default */ : "-1" /* TabIndex.Programmatic */
                        }, _this.busy
                            ? (0, mithril_1["default"])(Icon_1.Icon, {
                                icon: "Progress" /* BootIcons.Progress */,
                                "class": "flex-center items-center icon-progress-search icon-progress"
                            })
                            : (0, mithril_1["default"])(Icon_1.Icon, {
                                icon: "Close" /* Icons.Close */,
                                "class": "flex-center items-center icon-large",
                                style: {
                                    fill: theme_1.theme.header_button
                                }
                            })),
                    ]),
                ]),
                vnode.attrs.spacer ? (0, mithril_1["default"])(".nav-bar-spacer") : null,
            ]);
        };
    }
    SearchBar.prototype.inputWrapperWidth = function (alwaysExpanded) {
        if (alwaysExpanded) {
            return "100%";
        }
        else {
            return this.expanded ? (0, size_1.px)(SEARCH_INPUT_WIDTH) : (0, size_1.px)(0);
        }
    };
    /**
     * Replace contents of the overlay if it was shown or display a new one
     * if it wasn't
     * @param contentFunction what to show in overlay
     * @private
     */
    SearchBar.prototype._showOverlay = function () {
        var _this = this;
        if (this._closeOverlayFunction == null) {
            this._closeOverlayFunction = (0, Overlay_1.displayOverlay)(function () { return _this._makeOverlayRect(); }, this._overlayContentComponent);
        }
        else {
            mithril_1["default"].redraw();
        }
    };
    SearchBar.prototype._closeOverlay = function () {
        if (this._closeOverlayFunction) {
            this._closeOverlayFunction();
            this._closeOverlayFunction = null;
        }
    };
    SearchBar.prototype._makeOverlayRect = function () {
        var overlayRect;
        var domRect = this._domWrapper.getBoundingClientRect();
        if (styles_1.styles.isDesktopLayout()) {
            overlayRect = {
                top: (0, size_1.px)(domRect.bottom + 5),
                right: (0, size_1.px)(window.innerWidth - domRect.right),
                width: (0, size_1.px)(350),
                zIndex: 100 /* LayerType.LowPriorityOverlay */
            };
        }
        else if (window.innerWidth < 500) {
            overlayRect = {
                top: (0, size_1.px)(size_1.size.navbar_height_mobile + 6),
                left: (0, size_1.px)(16),
                right: (0, size_1.px)(16),
                zIndex: 100 /* LayerType.LowPriorityOverlay */
            };
        }
        else {
            overlayRect = {
                top: (0, size_1.px)(size_1.size.navbar_height_mobile + 6),
                left: (0, size_1.px)(domRect.left),
                right: (0, size_1.px)(window.innerWidth - domRect.right),
                zIndex: 100 /* LayerType.LowPriorityOverlay */
            };
        }
        return overlayRect;
    };
    SearchBar.prototype._setupShortcuts = function () {
        var _this = this;
        return [
            {
                key: TutanotaConstants_1.Keys.F,
                enabled: function () { return true; },
                exec: function (key) {
                    _this.focus();
                    mithril_1["default"].redraw();
                },
                help: "search_label"
            },
        ];
    };
    // TODO: remove this and take the list id from the url as soon as the list id is included in user and group settings
    SearchBar.prototype.setGroupInfoRestrictionListId = function (listId) {
        this._groupInfoRestrictionListId = listId;
    };
    SearchBar.prototype._downloadResults = function (_a) {
        var results = _a.results, restriction = _a.restriction;
        if (results.length === 0) {
            return Promise.resolve([]);
        }
        var byList = (0, tutanota_utils_1.groupBy)(results, EntityUtils_1.listIdPart);
        return (0, tutanota_utils_1.promiseMap)(byList, function (_a) {
            var listId = _a[0], idTuples = _a[1];
            return MainLocator_1.locator.entityClient
                .loadMultiple(restriction.type, listId, idTuples.map(EntityUtils_1.elementIdPart))["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, function () {
                console.log("mail list from search index not found");
                return [];
            }))["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotAuthorizedError, function () {
                console.log("no permission on instance from search index");
                return [];
            }));
        }, {
            concurrency: 3
        }) // Higher concurrency to not wait too long for search results of multiple lists
            .then(tutanota_utils_1.flat);
    };
    SearchBar.prototype._selectResult = function (result) {
        var query = this._state().query;
        if (result != null) {
            this._domInput.blur();
            var type = "_type" in result ? result._type : null;
            if (!type) {
                // click on SHOW MORE button
                if (result.allowShowMore) {
                    this._updateSearchUrl(query);
                }
            }
            else if ((0, tutanota_utils_1.isSameTypeRef)(TypeRefs_js_1.MailTypeRef, type)) {
                this._updateSearchUrl(query, (0, tutanota_utils_1.downcast)(result));
            }
            else if ((0, tutanota_utils_1.isSameTypeRef)(TypeRefs_js_1.ContactTypeRef, type)) {
                this._updateSearchUrl(query, (0, tutanota_utils_1.downcast)(result));
            }
            else if ((0, tutanota_utils_1.isSameTypeRef)(TypeRefs_js_2.GroupInfoTypeRef, type)) {
                this.lastSelectedGroupInfoResult((0, tutanota_utils_1.downcast)(result));
            }
            else if ((0, tutanota_utils_1.isSameTypeRef)(TypeRefs_js_2.WhitelabelChildTypeRef, type)) {
                this.lastSelectedWhitelabelChildrenInfoResult((0, tutanota_utils_1.downcast)(result));
            }
        }
    };
    SearchBar.prototype.handleSearchClick = function (e) {
        if (!this.focused) {
            this.focus();
        }
        else {
            this.search();
        }
    };
    SearchBar.prototype._getRestriction = function () {
        return (0, SearchUtils_1.getRestriction)(mithril_1["default"].route.get());
    };
    SearchBar.prototype._updateSearchUrl = function (query, selected) {
        (0, SearchUtils_1.setSearchUrl)((0, SearchUtils_1.getSearchUrl)(query, this._getRestriction(), selected && (0, EntityUtils_1.getElementId)(selected)));
    };
    SearchBar.prototype.search = function (query) {
        var _this = this;
        var oldQuery = this._state().query;
        if (query != null) {
            this._updateState({
                query: query
            });
        }
        else {
            query = oldQuery;
        }
        var restriction = this._getRestriction();
        if ((0, tutanota_utils_1.isSameTypeRef)(restriction.type, TypeRefs_js_2.GroupInfoTypeRef)) {
            restriction.listId = this._groupInfoRestrictionListId;
        }
        if (!MainLocator_1.locator.search.indexState().mailIndexEnabled && restriction && (0, tutanota_utils_1.isSameTypeRef)(restriction.type, TypeRefs_js_1.MailTypeRef) && !this._confirmDialogShown) {
            this.expanded = false;
            this.focused = false;
            this._confirmDialogShown = true;
            Dialog_1.Dialog.confirm("enableSearchMailbox_msg", "search_label")
                .then(function (confirmed) {
                if (confirmed) {
                    MainLocator_1.locator.indexerFacade
                        .enableMailIndexing()
                        .then(function () {
                        _this.search();
                        _this.focus();
                    })["catch"]((0, tutanota_utils_1.ofClass)(IndexingNotSupportedError_1.IndexingNotSupportedError, function () {
                        Dialog_1.Dialog.message((0, Env_1.isApp)() ? "searchDisabledApp_msg" : "searchDisabled_msg");
                    }));
                }
            })["finally"](function () { return (_this._confirmDialogShown = false); });
        }
        else {
            if (!MainLocator_1.locator.search.isNewSearch(query, restriction) && oldQuery === query) {
                var result = MainLocator_1.locator.search.result();
                if (this._isQuickSearch() && result) {
                    this._showResultsInOverlay(result);
                }
                this.busy = false;
            }
            else {
                if (query.trim() !== "") {
                    this.busy = true;
                }
                this._doSearch(query, restriction, function () {
                    _this.busy = false;
                    mithril_1["default"].redraw();
                });
            }
        }
    };
    /** Given the result from the search load additional results if needed and then display them or set URL. */
    SearchBar.prototype._loadAndDisplayResult = function (query, result, limit) {
        var _this = this;
        var safeResult = result, safeLimit = limit;
        this._updateState({
            searchResult: safeResult
        });
        if (!safeResult || MainLocator_1.locator.search.isNewSearch(query, safeResult.restriction)) {
            return;
        }
        if (this._isQuickSearch()) {
            if (safeLimit && (0, SearchModel_1.hasMoreResults)(safeResult) && safeResult.results.length < safeLimit) {
                MainLocator_1.locator.searchFacade.getMoreSearchResults(safeResult, safeLimit - safeResult.results.length).then(function (moreResults) {
                    if (MainLocator_1.locator.search.isNewSearch(query, moreResults.restriction)) {
                        return;
                    }
                    else {
                        _this._loadAndDisplayResult(query, moreResults, limit);
                    }
                });
            }
            else {
                this._showResultsInOverlay(safeResult);
            }
        }
        else {
            // instances will be displayed as part of the list of the search view, when the search view is displayed
            (0, SearchUtils_1.setSearchUrl)((0, SearchUtils_1.getSearchUrl)(query, safeResult.restriction));
        }
    };
    SearchBar.prototype.close = function () {
        if (this.expanded) {
            this.expanded = false;
            this._updateState({
                query: ""
            });
            MainLocator_1.locator.search.lastQuery("");
            this._domInput.blur(); // remove focus from the input field in case ESC is pressed
        }
        if (mithril_1["default"].route.get().startsWith("/search")) {
            MainLocator_1.locator.search.result(null);
            this._updateSearchUrl("");
        }
    };
    SearchBar.prototype._showResultsInOverlay = function (result) {
        var _this = this;
        return this._downloadResults(result).then(function (entries) {
            // If there was no new search while we've been downloading the result
            if (!MainLocator_1.locator.search.isNewSearch(result.query, result.restriction)) {
                var filteredResults = _this._filterResults(entries, result.restriction);
                var overlayEntries = filteredResults.slice(0, MAX_SEARCH_PREVIEW_RESULTS);
                if (result.query.trim() !== "" &&
                    (overlayEntries.length === 0 ||
                        (0, SearchModel_1.hasMoreResults)(result) ||
                        overlayEntries.length < filteredResults.length ||
                        result.currentIndexTimestamp !== TutanotaConstants_1.FULL_INDEXED_TIMESTAMP)) {
                    var moreEntry = {
                        resultCount: result.results.length,
                        shownCount: overlayEntries.length,
                        indexTimestamp: result.currentIndexTimestamp,
                        allowShowMore: !(0, tutanota_utils_1.isSameTypeRef)(result.restriction.type, TypeRefs_js_2.GroupInfoTypeRef) && !(0, tutanota_utils_1.isSameTypeRef)(result.restriction.type, TypeRefs_js_2.WhitelabelChildTypeRef)
                    };
                    overlayEntries.push(moreEntry);
                }
                _this._updateState({
                    entities: overlayEntries,
                    selected: overlayEntries[0]
                });
            }
        });
    };
    SearchBar.prototype._isQuickSearch = function () {
        return !mithril_1["default"].route.get().startsWith("/search");
    };
    SearchBar.prototype._filterResults = function (instances, restriction) {
        var filteredInstances = instances.slice();
        // filter group infos for local admins
        if ((0, tutanota_utils_1.isSameTypeRef)(restriction.type, TypeRefs_js_2.GroupInfoTypeRef) && !LoginController_1.logins.getUserController().isGlobalAdmin()) {
            var localAdminGroupIds_1 = LoginController_1.logins
                .getUserController()
                .getLocalAdminGroupMemberships()
                .map(function (gm) { return gm.group; });
            filteredInstances = filteredInstances.filter(function (gi) { return (0, SearchUtils_1.isAdministratedGroup)(localAdminGroupIds_1, (0, tutanota_utils_1.downcast)(gi)); });
        }
        else if ((0, tutanota_utils_1.isSameTypeRef)(restriction.type, TypeRefs_js_1.ContactTypeRef)) {
            // Sort contacts by name
            filteredInstances.sort(function (o1, o2) { return (0, ContactGuiUtils_1.compareContacts)(o1, o2); });
        }
        return filteredInstances;
    };
    SearchBar.prototype._getInputField = function (attrs) {
        var _this = this;
        return (0, mithril_1["default"])("input.input.input-no-clear", {
            "aria-autocomplete": "list",
            tabindex: this.expanded ? "0" /* TabIndex.Default */ : "-1" /* TabIndex.Programmatic */,
            role: "combobox",
            placeholder: attrs.placeholder,
            type: "text" /* TextFieldType.Text */,
            value: this._state().query,
            oncreate: function (vnode) {
                _this._domInput = vnode.dom;
            },
            onclick: function () { return _this.focus(); },
            onfocus: function () {
                // to highlight elements correctly when focused via keyboard
                _this.focused = true;
            },
            onblur: function (e) {
                if (_this.skipNextBlur()) {
                    setTimeout(function () { return _this._domInput.focus(); }, 0); // setTimeout needed in Firefox to keep focus
                }
                else {
                    _this.blur();
                }
                _this.skipNextBlur(false);
            },
            onremove: function () {
                _this._domInput.onblur = null;
            },
            oninput: function () {
                var domValue = _this._domInput.value;
                if (_this._state().query !== domValue) {
                    // update the input on each change
                    _this.search(domValue);
                }
            },
            onkeydown: function (e) {
                var _a = _this._state(), selected = _a.selected, entities = _a.entities;
                var keyHandlers = [
                    {
                        key: TutanotaConstants_1.Keys.F1,
                        exec: function () { return KeyManager_1.keyManager.openF1Help(); }
                    },
                    {
                        key: TutanotaConstants_1.Keys.ESC,
                        exec: function () { return _this.close(); }
                    },
                    {
                        key: TutanotaConstants_1.Keys.RETURN,
                        exec: function () {
                            if (selected) {
                                _this._selectResult(selected);
                            }
                            else {
                                if ((0, Env_1.isApp)()) {
                                    _this._domInput.blur();
                                }
                                else {
                                    _this.search();
                                }
                            }
                            _this._returnListener();
                        }
                    },
                    {
                        key: TutanotaConstants_1.Keys.UP,
                        exec: function () {
                            if (entities.length > 0) {
                                var oldSelected = selected || entities[0];
                                _this._updateState({
                                    selected: entities[(0, tutanota_utils_1.mod)(entities.indexOf(oldSelected) - 1, entities.length)]
                                });
                            }
                            e.preventDefault();
                        }
                    },
                    {
                        key: TutanotaConstants_1.Keys.DOWN,
                        exec: function () {
                            if (entities.length > 0) {
                                var newSelected = selected || entities[0];
                                _this._updateState({
                                    selected: entities[(0, tutanota_utils_1.mod)(entities.indexOf(newSelected) + 1, entities.length)]
                                });
                            }
                            e.preventDefault();
                        }
                    },
                ];
                var keyCode = e.which;
                var keyHandler = keyHandlers.find(function (handler) { return handler.key.code === keyCode; });
                if (keyHandler) {
                    keyHandler.exec();
                    e.preventDefault();
                }
                // disable key bindings
                e.stopPropagation();
                return true;
            },
            style: {
                "line-height": (0, size_1.px)(size_1.inputLineHeight)
            }
        });
    };
    SearchBar.prototype.focus = function () {
        var _this = this;
        if (!MainLocator_1.locator.search.indexingSupported) {
            Dialog_1.Dialog.message((0, Env_1.isApp)() ? "searchDisabledApp_msg" : "searchDisabled_msg");
        }
        else if (!this.expanded) {
            this.focused = true;
            this.expanded = true;
            // setTimeout to fix bug in current Safari with losing focus
            setTimeout(function () {
                _this._domInput.select();
                _this._domInput.focus();
                _this.search();
            }, ClientDetector_1.client.browser === "Safari" /* BrowserType.SAFARI */ ? 200 : 0);
        }
    };
    SearchBar.prototype.blur = function () {
        this.focused = false;
        if (this._state().query === "") {
            this.expanded = false;
            if (mithril_1["default"].route.get().startsWith("/search")) {
                MainLocator_1.locator.search.result(null);
                (0, SearchUtils_1.setSearchUrl)((0, SearchUtils_1.getSearchUrl)("", (0, SearchUtils_1.getRestriction)(mithril_1["default"].route.get())));
            }
        }
    };
    SearchBar.prototype.getMaxWidth = function () {
        return SEARCH_INPUT_WIDTH + 40; // includes  input width + search icon(21) + margin right(15) + spacer(4)
    };
    SearchBar.prototype.setReturnListener = function (listener) {
        this._returnListener = listener;
    };
    SearchBar.prototype._updateState = function (update) {
        var newState = Object.assign({}, this._state(), update);
        this._state(newState);
        return newState;
    };
    return SearchBar;
}());
exports.SearchBar = SearchBar;
