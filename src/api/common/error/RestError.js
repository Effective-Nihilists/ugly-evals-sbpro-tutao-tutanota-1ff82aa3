"use strict";
//@bundleInto:common-min
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.handleRestError = exports.PayloadTooLargeError = exports.ResourceError = exports.InsufficientStorageError = exports.ServiceUnavailableError = exports.BadGatewayError = exports.InternalServerError = exports.LimitReachedError = exports.InvalidSoftwareVersionError = exports.InvalidDataError = exports.AccessBlockedError = exports.AccessExpiredError = exports.AccessDeactivatedError = exports.SessionExpiredError = exports.TooManyRequestsError = exports.LockedError = exports.PreconditionFailedError = exports.MethodNotAllowedError = exports.NotFoundError = exports.NotAuthorizedError = exports.NotAuthenticatedError = exports.BadRequestError = exports.ConnectionError = void 0;
var TutanotaError_1 = require("./TutanotaError");
var ConnectionError = /** @class */ (function (_super) {
    __extends(ConnectionError, _super);
    function ConnectionError(msg) {
        return _super.call(this, "ConnectionError", msg) || this;
    }
    ConnectionError.CODE = 0;
    return ConnectionError;
}(TutanotaError_1.TutanotaError));
exports.ConnectionError = ConnectionError;
var BadRequestError = /** @class */ (function (_super) {
    __extends(BadRequestError, _super);
    function BadRequestError(msg) {
        return _super.call(this, "BadRequestError", msg) || this;
    }
    BadRequestError.CODE = 400;
    return BadRequestError;
}(TutanotaError_1.TutanotaError));
exports.BadRequestError = BadRequestError;
var NotAuthenticatedError = /** @class */ (function (_super) {
    __extends(NotAuthenticatedError, _super);
    function NotAuthenticatedError(msg) {
        return _super.call(this, "NotAuthenticatedError", msg) || this;
    }
    NotAuthenticatedError.CODE = 401;
    return NotAuthenticatedError;
}(TutanotaError_1.TutanotaError));
exports.NotAuthenticatedError = NotAuthenticatedError;
var NotAuthorizedError = /** @class */ (function (_super) {
    __extends(NotAuthorizedError, _super);
    function NotAuthorizedError(msg) {
        return _super.call(this, "NotAuthorizedError", msg) || this;
    }
    NotAuthorizedError.CODE = 403;
    return NotAuthorizedError;
}(TutanotaError_1.TutanotaError));
exports.NotAuthorizedError = NotAuthorizedError;
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(msg) {
        return _super.call(this, "NotFoundError", msg) || this;
    }
    NotFoundError.CODE = 404;
    return NotFoundError;
}(TutanotaError_1.TutanotaError));
exports.NotFoundError = NotFoundError;
var MethodNotAllowedError = /** @class */ (function (_super) {
    __extends(MethodNotAllowedError, _super);
    function MethodNotAllowedError(msg) {
        return _super.call(this, "MethodNotAllowedError", msg) || this;
    }
    MethodNotAllowedError.CODE = 405;
    return MethodNotAllowedError;
}(TutanotaError_1.TutanotaError));
exports.MethodNotAllowedError = MethodNotAllowedError;
var PreconditionFailedError = /** @class */ (function (_super) {
    __extends(PreconditionFailedError, _super);
    function PreconditionFailedError(msg, reason) {
        var _this = _super.call(this, "PreconditionFailedError", msg) || this;
        _this.data = reason;
        return _this;
    }
    PreconditionFailedError.CODE = 412;
    return PreconditionFailedError;
}(TutanotaError_1.TutanotaError));
exports.PreconditionFailedError = PreconditionFailedError;
var LockedError = /** @class */ (function (_super) {
    __extends(LockedError, _super);
    function LockedError(msg) {
        return _super.call(this, "LockedError", msg) || this;
    }
    LockedError.CODE = 423;
    return LockedError;
}(TutanotaError_1.TutanotaError));
exports.LockedError = LockedError;
var TooManyRequestsError = /** @class */ (function (_super) {
    __extends(TooManyRequestsError, _super);
    function TooManyRequestsError(msg) {
        return _super.call(this, "TooManyRequestsError", msg) || this;
    }
    TooManyRequestsError.CODE = 429;
    return TooManyRequestsError;
}(TutanotaError_1.TutanotaError));
exports.TooManyRequestsError = TooManyRequestsError;
var SessionExpiredError = /** @class */ (function (_super) {
    __extends(SessionExpiredError, _super);
    function SessionExpiredError(msg) {
        return _super.call(this, "SessionExpiredError", msg) || this;
    }
    SessionExpiredError.CODE = 440;
    return SessionExpiredError;
}(TutanotaError_1.TutanotaError));
exports.SessionExpiredError = SessionExpiredError;
var AccessDeactivatedError = /** @class */ (function (_super) {
    __extends(AccessDeactivatedError, _super);
    function AccessDeactivatedError(msg) {
        return _super.call(this, "AccessDeactivatedError", msg) || this;
    }
    AccessDeactivatedError.CODE = 470;
    return AccessDeactivatedError;
}(TutanotaError_1.TutanotaError));
exports.AccessDeactivatedError = AccessDeactivatedError;
/** External users only, related to password changes. */
var AccessExpiredError = /** @class */ (function (_super) {
    __extends(AccessExpiredError, _super);
    function AccessExpiredError(msg) {
        return _super.call(this, "AccessExpiredError", msg) || this;
    }
    AccessExpiredError.CODE = 471;
    return AccessExpiredError;
}(TutanotaError_1.TutanotaError));
exports.AccessExpiredError = AccessExpiredError;
var AccessBlockedError = /** @class */ (function (_super) {
    __extends(AccessBlockedError, _super);
    function AccessBlockedError(msg) {
        return _super.call(this, "AccessBlockedError", msg) || this;
    }
    AccessBlockedError.CODE = 472;
    return AccessBlockedError;
}(TutanotaError_1.TutanotaError));
exports.AccessBlockedError = AccessBlockedError;
var InvalidDataError = /** @class */ (function (_super) {
    __extends(InvalidDataError, _super);
    function InvalidDataError(msg) {
        return _super.call(this, "InvalidDataError", msg) || this;
    }
    InvalidDataError.CODE = 473;
    return InvalidDataError;
}(TutanotaError_1.TutanotaError));
exports.InvalidDataError = InvalidDataError;
var InvalidSoftwareVersionError = /** @class */ (function (_super) {
    __extends(InvalidSoftwareVersionError, _super);
    function InvalidSoftwareVersionError(msg) {
        return _super.call(this, "InvalidSoftwareVersionError", msg) || this;
    }
    InvalidSoftwareVersionError.CODE = 474;
    return InvalidSoftwareVersionError;
}(TutanotaError_1.TutanotaError));
exports.InvalidSoftwareVersionError = InvalidSoftwareVersionError;
var LimitReachedError = /** @class */ (function (_super) {
    __extends(LimitReachedError, _super);
    function LimitReachedError(msg) {
        return _super.call(this, "LimitReachedError", msg) || this;
    }
    LimitReachedError.CODE = 475;
    return LimitReachedError;
}(TutanotaError_1.TutanotaError));
exports.LimitReachedError = LimitReachedError;
var InternalServerError = /** @class */ (function (_super) {
    __extends(InternalServerError, _super);
    function InternalServerError(msg) {
        return _super.call(this, "InternalServerError", msg) || this;
    }
    InternalServerError.CODE = 500;
    return InternalServerError;
}(TutanotaError_1.TutanotaError));
exports.InternalServerError = InternalServerError;
var BadGatewayError = /** @class */ (function (_super) {
    __extends(BadGatewayError, _super);
    function BadGatewayError(msg) {
        return _super.call(this, "BadGatewayError", msg) || this;
    }
    BadGatewayError.CODE = 502;
    return BadGatewayError;
}(TutanotaError_1.TutanotaError));
exports.BadGatewayError = BadGatewayError;
var ServiceUnavailableError = /** @class */ (function (_super) {
    __extends(ServiceUnavailableError, _super);
    function ServiceUnavailableError(msg) {
        return _super.call(this, "ServiceUnavailableError", msg) || this;
    }
    ServiceUnavailableError.CODE = 503;
    return ServiceUnavailableError;
}(TutanotaError_1.TutanotaError));
exports.ServiceUnavailableError = ServiceUnavailableError;
var InsufficientStorageError = /** @class */ (function (_super) {
    __extends(InsufficientStorageError, _super);
    function InsufficientStorageError(msg) {
        return _super.call(this, "InsufficientStorageError", msg) || this;
    }
    InsufficientStorageError.CODE = 507;
    return InsufficientStorageError;
}(TutanotaError_1.TutanotaError));
exports.InsufficientStorageError = InsufficientStorageError;
var ResourceError = /** @class */ (function (_super) {
    __extends(ResourceError, _super);
    function ResourceError(msg) {
        return _super.call(this, "ResourceError", msg) || this;
    }
    return ResourceError;
}(TutanotaError_1.TutanotaError));
exports.ResourceError = ResourceError;
var PayloadTooLargeError = /** @class */ (function (_super) {
    __extends(PayloadTooLargeError, _super);
    function PayloadTooLargeError(msg) {
        return _super.call(this, "PayloadTooLargeError", msg) || this;
    }
    PayloadTooLargeError.CODE = 413;
    return PayloadTooLargeError;
}(TutanotaError_1.TutanotaError));
exports.PayloadTooLargeError = PayloadTooLargeError;
/**
 * Attention: When adding an Error also add it in WorkerProtocol.ErrorNameToType.
 */
function handleRestError(errorCode, path, errorId, precondition) {
    var message = "".concat(errorCode, ": ").concat(errorId ? errorId + " " : "").concat(precondition ? precondition + " " : "").concat(path);
    switch (errorCode) {
        case ConnectionError.CODE:
            return new ConnectionError(message);
        case BadRequestError.CODE:
            return new BadRequestError(message);
        case NotAuthenticatedError.CODE:
            return new NotAuthenticatedError(message);
        case NotAuthorizedError.CODE:
            return new NotAuthorizedError(message);
        case NotFoundError.CODE:
            return new NotFoundError(message);
        case MethodNotAllowedError.CODE:
            return new MethodNotAllowedError(message);
        case PreconditionFailedError.CODE:
            return new PreconditionFailedError(message, precondition !== null && precondition !== void 0 ? precondition : null);
        case LockedError.CODE:
            return new LockedError(message);
        case TooManyRequestsError.CODE:
            return new TooManyRequestsError(message);
        case SessionExpiredError.CODE:
            return new SessionExpiredError(message);
        case AccessDeactivatedError.CODE:
            return new AccessDeactivatedError(message);
        case AccessExpiredError.CODE:
            return new AccessExpiredError(message);
        case AccessBlockedError.CODE:
            return new AccessBlockedError(message);
        case InvalidDataError.CODE:
            return new InvalidDataError(message);
        case InvalidSoftwareVersionError.CODE:
            return new InvalidSoftwareVersionError(message);
        case LimitReachedError.CODE:
            return new LimitReachedError(message);
        case InternalServerError.CODE:
            return new InternalServerError(message);
        case BadGatewayError.CODE:
            return new BadGatewayError(message);
        case ServiceUnavailableError.CODE:
            return new ServiceUnavailableError(message);
        case InsufficientStorageError.CODE:
            return new InsufficientStorageError(message);
        case PayloadTooLargeError.CODE:
            return new PayloadTooLargeError(message);
        default:
            return new ResourceError(message);
    }
}
exports.handleRestError = handleRestError;
