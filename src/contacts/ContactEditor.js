"use strict";
exports.__esModule = true;
exports.ContactEditor = void 0;
var mithril_1 = require("mithril");
var stream_1 = require("mithril/stream");
var Dialog_1 = require("../gui/base/Dialog");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var FormatValidator_1 = require("../misc/FormatValidator");
var ContactUtils_1 = require("./model/ContactUtils");
var TutanotaConstants_1 = require("../api/common/TutanotaConstants");
var TypeRefs_js_1 = require("../api/entities/tutanota/TypeRefs.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Env_1 = require("../api/common/Env");
var WindowFacade_1 = require("../misc/WindowFacade");
var LoginController_1 = require("../api/main/LoginController");
var RestError_1 = require("../api/common/error/RestError");
var BirthdayUtils_1 = require("../api/common/utils/BirthdayUtils");
var ContactGuiUtils_1 = require("./view/ContactGuiUtils");
var DateParser_1 = require("../misc/DateParser");
var TextField_js_1 = require("../gui/base/TextField.js");
var EntityUtils_1 = require("../api/common/utils/EntityUtils");
var ContactAggregateEditor_1 = require("./ContactAggregateEditor");
var Animations_1 = require("../gui/animation/Animations");
(0, Env_1.assertMainOrNode)();
var ContactEditor = /** @class */ (function () {
    /**
     * The contact that should be update or the contact list that the new contact should be written to must be provided
     * @param entityClient
     * @param contact An existing or new contact. If null a new contact is created.
     * @param listId The list id of the new contact.
     * @param newContactIdReceiver. Is called receiving the contact id as soon as the new contact was saved.
     */
    function ContactEditor(entityClient, contact, listId, newContactIdReceiver) {
        var _this = this;
        this.entityClient = entityClient;
        this.contact = contact ? (0, tutanota_utils_1.clone)(contact) : (0, TypeRefs_js_1.createContact)();
        this._isNewContact = contact == null;
        this._newContactIdReceiver = newContactIdReceiver !== null && newContactIdReceiver !== void 0 ? newContactIdReceiver : null;
        if (contact == null && listId == null) {
            throw new Error("must provide contact to edit or listId for the new contact");
        }
        else {
            this.listId = listId ? listId : (0, tutanota_utils_1.neverNull)(contact)._id[0];
        }
        var id = function (entity) { return entity._id || _this._newId(); };
        this.mailAddresses = this.contact.mailAddresses.map(function (address) { return [address, id(address)]; });
        this.mailAddresses.push(this._newMailAddress());
        this.phoneNumbers = this.contact.phoneNumbers.map(function (phoneNumber) { return [phoneNumber, id(phoneNumber)]; });
        this.phoneNumbers.push(this._newPhoneNumber());
        this.addresses = this.contact.addresses.map(function (address) { return [address, id(address)]; });
        this.addresses.push(this._newAddress());
        this.socialIds = this.contact.socialIds.map(function (socialId) { return [socialId, id(socialId)]; });
        this.socialIds.push(this._newSocialId());
        this.firstName = (0, stream_1["default"])(this.contact.firstName);
        this.lastName = (0, stream_1["default"])(this.contact.lastName);
        this.invalidBirthday = false;
        this.birthday = (0, stream_1["default"])((0, ContactUtils_1.formatBirthdayOfContact)(this.contact) || "");
        this.dialog = this._createDialog();
        this.windowCloseUnsubscribe = tutanota_utils_1.noOp;
    }
    ContactEditor.prototype.oncreate = function () {
        this.windowCloseUnsubscribe = WindowFacade_1.windowFacade.addWindowCloseListener(function () {
        });
    };
    ContactEditor.prototype.onremove = function () {
        this.windowCloseUnsubscribe();
    };
    ContactEditor.prototype.view = function () {
        var _this = this;
        var presharedPasswordAttrs = this._createPresharedPasswordAttrs();
        return (0, mithril_1["default"])("#contact-editor", [
            (0, mithril_1["default"])(".wrapping-row", [(0, mithril_1["default"])(StandaloneField, this._createFirstNameAttrs()), (0, mithril_1["default"])(StandaloneField, this._createLastNameAttrs())]),
            (0, mithril_1["default"])(".wrapping-row", [(0, mithril_1["default"])(StandaloneField, this._createTitleAttrs()), (0, mithril_1["default"])(StandaloneField, this._createBirthdayAttrs())]),
            (0, mithril_1["default"])(".wrapping-row", [
                (0, mithril_1["default"])(StandaloneField, this._createRoleAttrs()),
                (0, mithril_1["default"])(StandaloneField, this._createCompanyAttrs()),
                (0, mithril_1["default"])(StandaloneField, this._createNickNameAttrs()),
                (0, mithril_1["default"])(StandaloneField, this._createCommentAttrs()),
            ]),
            (0, mithril_1["default"])(".wrapping-row", [
                (0, mithril_1["default"])(".mail.mt-xl", [
                    (0, mithril_1["default"])(".h4", LanguageViewModel_1.lang.get("email_label")),
                    (0, mithril_1["default"])(".aggregateEditors", [
                        this.mailAddresses.map(function (_a, index) {
                            var address = _a[0], id = _a[1];
                            var lastEditor = index === (0, tutanota_utils_1.lastIndex)(_this.mailAddresses);
                            return (0, mithril_1["default"])(ContactAggregateEditor_1.ContactAggregateEditor, _this._createMailAddressEditor(id, !lastEditor, address));
                        }),
                    ]),
                ]),
                (0, mithril_1["default"])(".phone.mt-xl", [
                    (0, mithril_1["default"])(".h4", LanguageViewModel_1.lang.get("phone_label")),
                    (0, mithril_1["default"])(".aggregateEditors", [
                        this.phoneNumbers.map(function (_a, index) {
                            var phoneNumber = _a[0], id = _a[1];
                            var lastEditor = index === (0, tutanota_utils_1.lastIndex)(_this.phoneNumbers);
                            return (0, mithril_1["default"])(ContactAggregateEditor_1.ContactAggregateEditor, _this._createPhoneEditor(id, !lastEditor, phoneNumber));
                        }),
                    ]),
                ]),
            ]),
            (0, mithril_1["default"])(".wrapping-row", [
                (0, mithril_1["default"])(".address.mt-xl", [
                    (0, mithril_1["default"])(".h4", LanguageViewModel_1.lang.get("address_label")),
                    (0, mithril_1["default"])(".aggregateEditors", [
                        this.addresses.map(function (_a, index) {
                            var address = _a[0], id = _a[1];
                            var lastEditor = index === (0, tutanota_utils_1.lastIndex)(_this.addresses);
                            return (0, mithril_1["default"])(ContactAggregateEditor_1.ContactAggregateEditor, _this._createAddressEditor(id, !lastEditor, address));
                        }),
                    ]),
                ]),
                (0, mithril_1["default"])(".social.mt-xl", [
                    (0, mithril_1["default"])(".h4", LanguageViewModel_1.lang.get("social_label")),
                    (0, mithril_1["default"])(".aggregateEditors", [
                        this.socialIds.map(function (_a, index) {
                            var socialId = _a[0], id = _a[1];
                            var lastEditor = index === (0, tutanota_utils_1.lastIndex)(_this.socialIds);
                            return (0, mithril_1["default"])(ContactAggregateEditor_1.ContactAggregateEditor, _this._createSocialEditor(id, !lastEditor, socialId));
                        }),
                    ]),
                ]),
            ]),
            presharedPasswordAttrs
                ? (0, mithril_1["default"])(".wrapping-row", [
                    (0, mithril_1["default"])(".passwords.mt-xl", [(0, mithril_1["default"])(".h4", LanguageViewModel_1.lang.get("presharedPassword_label")), (0, mithril_1["default"])(TextField_js_1.TextField, presharedPasswordAttrs)]),
                    (0, mithril_1["default"])(".spacer"),
                ])
                : null,
            (0, mithril_1["default"])(".pb"),
        ]);
    };
    ContactEditor.prototype.show = function () {
        this.dialog.show();
    };
    ContactEditor.prototype._close = function () {
        this.dialog.close();
    };
    ContactEditor.prototype.save = function () {
        var _this = this;
        if (this.invalidBirthday) {
            Dialog_1.Dialog.message("invalidBirthday_msg");
            return;
        }
        this.contact.mailAddresses = this.mailAddresses.map(function (e) { return e[0]; }).filter(function (e) { return e.address.trim().length > 0; });
        this.contact.phoneNumbers = this.phoneNumbers.map(function (e) { return e[0]; }).filter(function (e) { return e.number.trim().length > 0; });
        this.contact.addresses = this.addresses.map(function (e) { return e[0]; }).filter(function (e) { return e.address.trim().length > 0; });
        this.contact.socialIds = this.socialIds.map(function (e) { return e[0]; }).filter(function (e) { return e.socialId.trim().length > 0; });
        var promise;
        if (this.contact._id) {
            promise = this.entityClient.update(this.contact)["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, tutanota_utils_1.noOp));
        }
        else {
            this.contact._area = "0"; // legacy
            this.contact.autoTransmitPassword = ""; // legacy
            this.contact._owner = LoginController_1.logins.getUserController().user._id;
            this.contact._ownerGroup = (0, tutanota_utils_1.neverNull)(LoginController_1.logins.getUserController().user.memberships.find(function (m) { return m.groupType === TutanotaConstants_1.GroupType.Contact; })).group;
            promise = this.entityClient.setup(this.listId, this.contact).then(function (contactId) {
                if (_this._newContactIdReceiver) {
                    _this._newContactIdReceiver(contactId);
                }
            });
        }
        promise
            .then(function () { return _this._close(); })["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.PayloadTooLargeError, function () {
            Dialog_1.Dialog.message("requestTooLarge_msg");
        }));
    };
    ContactEditor.prototype._createMailAddressEditor = function (id, allowCancel, mailAddress) {
        var _this = this;
        var helpLabel;
        if (mailAddress.address.trim().length > 0 && !(0, FormatValidator_1.isMailAddress)(mailAddress.address.trim(), false)) {
            helpLabel = "invalidInputFormat_msg";
        }
        else {
            helpLabel = "emptyString_msg";
        }
        var typeLabels = (0, tutanota_utils_1.typedEntries)(ContactGuiUtils_1.ContactMailAddressTypeToLabel);
        return {
            value: mailAddress.address,
            fieldType: "text" /* TextFieldType.Text */,
            label: (0, ContactGuiUtils_1.getContactAddressTypeLabel)((0, tutanota_utils_1.downcast)(mailAddress.type), mailAddress.customTypeName),
            helpLabel: helpLabel,
            cancelAction: function () {
                (0, tutanota_utils_1.findAndRemove)(_this.mailAddresses, function (t) { return t[1] === id; });
            },
            onUpdate: function (value) {
                mailAddress.address = value;
                if (mailAddress === (0, tutanota_utils_1.lastThrow)(_this.mailAddresses)[0])
                    _this.mailAddresses.push(_this._newAddress());
            },
            animateCreate: !mailAddress.address,
            allowCancel: allowCancel,
            key: id,
            typeLabels: typeLabels,
            onTypeSelected: function (type) { return _this._onTypeSelected(type === "3" /* ContactAddressType.CUSTOM */, type, mailAddress); }
        };
    };
    ContactEditor.prototype._createPhoneEditor = function (id, allowCancel, phoneNumber) {
        var _this = this;
        var typeLabels = (0, tutanota_utils_1.typedEntries)(ContactGuiUtils_1.ContactPhoneNumberTypeToLabel);
        return {
            value: phoneNumber.number,
            fieldType: "text" /* TextFieldType.Text */,
            label: (0, ContactGuiUtils_1.getContactPhoneNumberTypeLabel)((0, tutanota_utils_1.downcast)(phoneNumber.type), phoneNumber.customTypeName),
            helpLabel: "emptyString_msg",
            cancelAction: function () {
                (0, tutanota_utils_1.findAndRemove)(_this.phoneNumbers, function (t) { return t[1] === id; });
            },
            onUpdate: function (value) {
                phoneNumber.number = value;
                if (phoneNumber === (0, tutanota_utils_1.lastThrow)(_this.phoneNumbers)[0])
                    _this.phoneNumbers.push(_this._newPhoneNumber());
            },
            animateCreate: !phoneNumber.number,
            allowCancel: allowCancel,
            key: id,
            typeLabels: typeLabels,
            onTypeSelected: function (type) { return _this._onTypeSelected(type === "5" /* ContactPhoneNumberType.CUSTOM */, type, phoneNumber); }
        };
    };
    ContactEditor.prototype._createAddressEditor = function (id, allowCancel, address) {
        var _this = this;
        var typeLabels = (0, tutanota_utils_1.typedEntries)(ContactGuiUtils_1.ContactMailAddressTypeToLabel);
        return {
            value: address.address,
            fieldType: "area" /* TextFieldType.Area */,
            label: (0, ContactGuiUtils_1.getContactAddressTypeLabel)((0, tutanota_utils_1.downcast)(address.type), address.customTypeName),
            helpLabel: "emptyString_msg",
            cancelAction: function () {
                (0, tutanota_utils_1.findAndRemove)(_this.addresses, function (t) { return t[1] === id; });
            },
            onUpdate: function (value) {
                address.address = value;
                if (address === (0, tutanota_utils_1.lastThrow)(_this.addresses)[0])
                    _this.addresses.push(_this._newAddress());
            },
            animateCreate: !address.address,
            allowCancel: allowCancel,
            key: id,
            typeLabels: typeLabels,
            onTypeSelected: function (type) { return _this._onTypeSelected(type === "3" /* ContactAddressType.CUSTOM */, type, address); }
        };
    };
    ContactEditor.prototype._createSocialEditor = function (id, allowCancel, socialId) {
        var _this = this;
        var typeLabels = (0, tutanota_utils_1.typedEntries)(ContactGuiUtils_1.ContactSocialTypeToLabel);
        return {
            value: socialId.socialId,
            fieldType: "text" /* TextFieldType.Text */,
            label: (0, ContactGuiUtils_1.getContactSocialTypeLabel)((0, tutanota_utils_1.downcast)(socialId.type), socialId.customTypeName),
            helpLabel: "emptyString_msg",
            cancelAction: function () {
                (0, tutanota_utils_1.findAndRemove)(_this.socialIds, function (t) { return t[1] === id; });
            },
            onUpdate: function (value) {
                socialId.socialId = value;
                if (socialId === (0, tutanota_utils_1.lastThrow)(_this.socialIds)[0])
                    _this.socialIds.push(_this._newSocialId());
            },
            animateCreate: !socialId.socialId,
            allowCancel: allowCancel,
            key: id,
            typeLabels: typeLabels,
            onTypeSelected: function (type) { return _this._onTypeSelected(type === "5" /* ContactSocialType.CUSTOM */, type, socialId); }
        };
    };
    ContactEditor.prototype._createCommentAttrs = function () {
        var _this = this;
        return {
            label: "comment_label",
            value: this.contact.comment,
            oninput: function (value) { return (_this.contact.comment = value); },
            type: "area" /* TextFieldType.Area */
        };
    };
    ContactEditor.prototype._createFirstNameAttrs = function () {
        var _this = this;
        return {
            label: "firstName_placeholder",
            value: this.firstName(),
            oninput: function (value) {
                _this.firstName(value);
                _this.contact.firstName = value;
            }
        };
    };
    ContactEditor.prototype._createNickNameAttrs = function () {
        var _this = this;
        var _a;
        return {
            label: "nickname_placeholder",
            value: (_a = this.contact.nickname) !== null && _a !== void 0 ? _a : "",
            oninput: function (value) { return _this.contact.nickname = value; }
        };
    };
    ContactEditor.prototype._createLastNameAttrs = function () {
        var _this = this;
        return {
            label: "lastName_placeholder",
            value: this.lastName(),
            oninput: function (value) {
                _this.lastName(value);
                _this.contact.lastName = value;
            }
        };
    };
    ContactEditor.prototype._createBirthdayAttrs = function () {
        var _this = this;
        var birthdayHelpText = function () {
            var bday = (0, TypeRefs_js_1.createBirthday)();
            bday.day = "22";
            bday.month = "9";
            bday.year = "2000";
            return _this.invalidBirthday
                ? LanguageViewModel_1.lang.get("invalidDateFormat_msg", {
                    "{1}": (0, ContactUtils_1.formatBirthdayNumeric)(bday)
                })
                : "";
        };
        return {
            label: "birthday_alt",
            value: this.birthday(),
            helpLabel: birthdayHelpText,
            oninput: function (value) {
                _this.birthday(value);
                if (value.trim().length === 0) {
                    _this.contact.birthdayIso = null;
                    _this.invalidBirthday = false;
                }
                else {
                    var birthday = (0, DateParser_1.parseBirthday)(value);
                    if (birthday) {
                        try {
                            _this.contact.birthdayIso = (0, BirthdayUtils_1.birthdayToIsoDate)(birthday);
                            _this.invalidBirthday = false;
                        }
                        catch (e) {
                            _this.invalidBirthday = true;
                        }
                    }
                    else {
                        _this.invalidBirthday = true;
                    }
                }
            }
        };
    };
    ContactEditor.prototype._createCompanyAttrs = function () {
        var _this = this;
        return {
            label: "company_label",
            value: this.contact.company,
            oninput: function (value) { return _this.contact.company = value; }
        };
    };
    ContactEditor.prototype._createRoleAttrs = function () {
        var _this = this;
        return {
            label: "role_placeholder",
            value: this.contact.role,
            oninput: function (value) { return _this.contact.role = value; }
        };
    };
    ContactEditor.prototype._createTitleAttrs = function () {
        var _this = this;
        return {
            label: "title_placeholder",
            value: this.contact.title || "",
            oninput: function (value) { return _this.contact.title = value; }
        };
    };
    ContactEditor.prototype._createPresharedPasswordAttrs = function () {
        var _this = this;
        var _a;
        if (!this._isNewContact && !this.contact.presharedPassword) {
            return null;
        }
        return {
            label: "password_label",
            value: (_a = this.contact.presharedPassword) !== null && _a !== void 0 ? _a : "",
            oninput: function (value) { return _this.contact.presharedPassword = value; }
        };
    };
    ContactEditor.prototype._createCloseButtonAttrs = function () {
        var _this = this;
        return {
            label: "close_alt",
            click: function (e, dom) { return _this._close(); },
            type: "secondary" /* ButtonType.Secondary */
        };
    };
    ContactEditor.prototype._newPhoneNumber = function () {
        var phoneNumber = (0, TypeRefs_js_1.createContactPhoneNumber)({
            type: "2" /* ContactPhoneNumberType.MOBILE */,
            customTypeName: "",
            number: ""
        });
        return [phoneNumber, this._newId()];
    };
    ContactEditor.prototype._newMailAddress = function () {
        var mailAddress = (0, TypeRefs_js_1.createContactMailAddress)({
            type: "1" /* ContactAddressType.WORK */,
            customTypeName: "",
            address: ""
        });
        return [mailAddress, this._newId()];
    };
    ContactEditor.prototype._newAddress = function () {
        var address = (0, TypeRefs_js_1.createContactAddress)({
            type: "1" /* ContactAddressType.WORK */,
            customTypeName: "",
            address: ""
        });
        return [address, this._newId()];
    };
    ContactEditor.prototype._newSocialId = function () {
        var socialId = (0, TypeRefs_js_1.createContactSocialId)({
            type: "0" /* ContactSocialType.TWITTER */,
            customTypeName: "",
            socialId: ""
        });
        return [socialId, this._newId()];
    };
    ContactEditor.prototype._newId = function () {
        return (0, EntityUtils_1.timestampToGeneratedId)(Date.now());
    };
    ContactEditor.prototype._onTypeSelected = function (isCustom, key, aggregate) {
        if (isCustom) {
            setTimeout(function () {
                Dialog_1.Dialog.showTextInputDialog("customLabel_label", "customLabel_label", null, aggregate.customTypeName).then(function (name) {
                    aggregate.customTypeName = name;
                    aggregate.type = key;
                });
            }, Animations_1.DefaultAnimationTime); // wait till the dropdown is hidden
        }
        else {
            aggregate.type = key;
        }
    };
    ContactEditor.prototype._createDialog = function () {
        var _this = this;
        var name = stream_1["default"].merge([this.firstName, this.lastName]).map(function (names) { return names.join(" "); });
        var headerBarAttrs = {
            left: [this._createCloseButtonAttrs()],
            middle: name,
            right: [
                {
                    label: "save_action",
                    click: function () { return _this.save(); },
                    type: "primary" /* ButtonType.Primary */
                },
            ]
        };
        return Dialog_1.Dialog.largeDialog(headerBarAttrs, this)
            .addShortcut({
            key: TutanotaConstants_1.Keys.ESC,
            exec: function () { return _this._close(); },
            help: "close_alt"
        })
            .addShortcut({
            key: TutanotaConstants_1.Keys.S,
            ctrl: true,
            exec: function () { return _this.save(); },
            help: "save_action"
        })
            .setCloseHandler(function () { return _this._close(); });
    };
    return ContactEditor;
}());
exports.ContactEditor = ContactEditor;
/** Renders TextField with wrapper and padding element to align them all. */
var StandaloneField = /** @class */ (function () {
    function StandaloneField() {
    }
    StandaloneField.prototype.view = function (_a) {
        var attrs = _a.attrs;
        return (0, mithril_1["default"])(".flex.child-grow", [(0, mithril_1["default"])(TextField_js_1.TextField, attrs), (0, mithril_1["default"])(".icon-button")]);
    };
    return StandaloneField;
}());
