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
exports.RecipientsModel = exports.ResolveMode = void 0;
var MailUtils_js_1 = require("../../mail/model/MailUtils.js");
var ContactUtils_js_1 = require("../../contacts/model/ContactUtils.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TypeRefs_1 = require("../entities/tutanota/TypeRefs");
var ResolveMode;
(function (ResolveMode) {
    ResolveMode[ResolveMode["Lazy"] = 0] = "Lazy";
    ResolveMode[ResolveMode["Eager"] = 1] = "Eager";
})(ResolveMode = exports.ResolveMode || (exports.ResolveMode = {}));
var RecipientsModel = /** @class */ (function () {
    function RecipientsModel(contactModel, loginController, mailFacade, entityClient) {
        this.contactModel = contactModel;
        this.loginController = loginController;
        this.mailFacade = mailFacade;
        this.entityClient = entityClient;
    }
    /**
     * Start resolving a recipient
     * If resolveLazily === true, Then resolution will not be initiated (i.e. no server calls will be made) until the first call to `resolved`
     */
    RecipientsModel.prototype.resolve = function (recipient, resolveMode) {
        return new ResolvableRecipientImpl(recipient, this.contactModel, this.loginController, this.mailFacade, this.entityClient, resolveMode);
    };
    return RecipientsModel;
}());
exports.RecipientsModel = RecipientsModel;
var ResolvableRecipientImpl = /** @class */ (function () {
    function ResolvableRecipientImpl(arg, contactModel, loginController, mailFacade, entityClient, resolveMode) {
        var _this = this;
        var _a, _b;
        this.contactModel = contactModel;
        this.loginController = loginController;
        this.mailFacade = mailFacade;
        this.entityClient = entityClient;
        this.initialType = "unknown" /* RecipientType.UNKNOWN */;
        this.initialContact = null;
        this.overrideContact = null;
        this.address = arg.address;
        this._name = (_a = arg.name) !== null && _a !== void 0 ? _a : null;
        if (!(arg.contact instanceof Array)) {
            this.initialContact = (_b = arg.contact) !== null && _b !== void 0 ? _b : null;
        }
        if ((0, MailUtils_js_1.isTutanotaMailAddress)(this.address)) {
            this.initialType = "internal" /* RecipientType.INTERNAL */;
        }
        else if (arg.type) {
            this.initialType = arg.type;
        }
        this.lazyType = new tutanota_utils_1.LazyLoaded(function () { return _this.resolveType(); });
        this.lazyContact = new tutanota_utils_1.LazyLoaded(function () { return __awaiter(_this, void 0, void 0, function () {
            var contact;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.resolveContact(arg.contact)];
                    case 1:
                        contact = _a.sent();
                        if (contact != null && this._name == null) {
                            this._name = (0, ContactUtils_js_1.getContactDisplayName)(contact);
                        }
                        return [2 /*return*/, contact];
                }
            });
        }); });
        if (resolveMode === ResolveMode.Eager) {
            this.lazyType.load();
            this.lazyContact.load();
        }
    }
    Object.defineProperty(ResolvableRecipientImpl.prototype, "name", {
        get: function () {
            var _a;
            return (_a = this._name) !== null && _a !== void 0 ? _a : "";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResolvableRecipientImpl.prototype, "type", {
        get: function () {
            var _a;
            return (_a = this.lazyType.getSync()) !== null && _a !== void 0 ? _a : this.initialType;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResolvableRecipientImpl.prototype, "contact", {
        get: function () {
            var _a;
            return (_a = this.lazyContact.getSync()) !== null && _a !== void 0 ? _a : this.initialContact;
        },
        enumerable: false,
        configurable: true
    });
    ResolvableRecipientImpl.prototype.setName = function (newName) {
        this._name = newName;
    };
    ResolvableRecipientImpl.prototype.setContact = function (newContact) {
        this.overrideContact = newContact;
        this.lazyContact.reload();
    };
    ResolvableRecipientImpl.prototype.resolved = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all([this.lazyType.getAsync(), this.lazyContact.getAsync()])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                address: this.address,
                                name: this.name,
                                type: this.type,
                                contact: this.contact
                            }];
                }
            });
        });
    };
    ResolvableRecipientImpl.prototype.isResolved = function () {
        // We are only resolved when both type and contact are non-null and finished
        return this.lazyType.isLoaded() && this.lazyContact.isLoaded();
    };
    ResolvableRecipientImpl.prototype.whenResolved = function (handler) {
        this.resolved().then(handler);
        return this;
    };
    /**
     * Determine whether recipient is INTERNAL or EXTERNAL based on the existence of key data (external recipients don't have any)
     */
    ResolvableRecipientImpl.prototype.resolveType = function () {
        return __awaiter(this, void 0, void 0, function () {
            var keyData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.initialType === "unknown" /* RecipientType.UNKNOWN */)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.mailFacade.getRecipientKeyData(this.address)];
                    case 1:
                        keyData = _a.sent();
                        return [2 /*return*/, keyData == null ? "external" /* RecipientType.EXTERNAL */ : "internal" /* RecipientType.INTERNAL */];
                    case 2: return [2 /*return*/, this.initialType];
                }
            });
        });
    };
    /**
     * Resolve the recipients contact.
     * If {@param contact} is an Id, the contact will be loaded directly
     * Otherwise, the contact will be searched for in the ContactModel
     */
    ResolvableRecipientImpl.prototype.resolveContact = function (contact) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        if (!this.overrideContact) return [3 /*break*/, 1];
                        return [2 /*return*/, this.overrideContact];
                    case 1:
                        if (!(contact instanceof Array)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.entityClient.load(TypeRefs_1.ContactTypeRef, contact)];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3:
                        if (!(contact == null)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.contactModel.searchForContact(this.address)];
                    case 4: return [2 /*return*/, (_a = _b.sent()) !== null && _a !== void 0 ? _a : (0, MailUtils_js_1.createNewContact)(this.loginController.getUserController().user, this.address, this.name)];
                    case 5: return [2 /*return*/, contact];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        e_1 = _b.sent();
                        console.log("error resolving contact", e_1);
                        return [2 /*return*/, null];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return ResolvableRecipientImpl;
}());
