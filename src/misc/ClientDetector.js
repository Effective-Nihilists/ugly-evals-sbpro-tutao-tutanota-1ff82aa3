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
exports.client = exports.ClientDetector = void 0;
var Env_1 = require("../api/common/Env");
(0, Env_1.assertMainOrNodeBoot)();
var ClientDetector = /** @class */ (function () {
    function ClientDetector() {
    }
    ClientDetector.prototype.init = function (userAgent, platform) {
        this.userAgent = userAgent;
        this.browser = "Other" /* BrowserType.OTHER */;
        this.browserVersion = 0;
        this.device = "Desktop" /* DeviceType.DESKTOP */;
        this._setBrowserAndVersion();
        this._setDeviceInfo();
        this.overflowAuto = this.cssPropertyValueSupported("overflow", "overlay") ? "overlay" : "auto";
        this.isMacOS = platform.indexOf("Mac") !== -1;
    };
    /**
     * This function uses syntax constructs which we want to make sure are supported. If they are not then this file cannot be imported.
     */
    ClientDetector.prototype.syntaxChecks = function () {
        var _a;
        // By default rollup disables tree-shaking inside the try-catch.
        try {
            var arrowFunction = function () {
                return 1;
            };
            var aLet = 2;
            function testGenerator() {
                return __generator(this, function (_a) {
                    return [2 /*return*/];
                });
            }
            function testAsync() {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/];
                    });
                });
            }
            function testDefaultArgs(a) {
                if (a === void 0) { a = 2; }
            }
            testGenerator();
            testAsync();
            testDefaultArgs();
            var anArray = [1, 2, 3];
            var spreadArray = __spreadArray([], anArray, true);
            var dynamicString = "";
            var impossibleCondition = arrowFunction() === aLet;
            if (impossibleCondition) {
                Promise.resolve().then(function () { return require(dynamicString); });
            }
            var objectSyntax = (_a = {},
                _a[dynamicString] = true,
                _a.testFn = function () {
                },
                Object.defineProperty(_a, "accessor", {
                    get: function () {
                        return null;
                    },
                    set: function (newValue) {
                    },
                    enumerable: false,
                    configurable: true
                }),
                _a);
            var templateString = "test ".concat(dynamicString);
            var x = 1;
            var y = 2;
            var propertyShorthand = {
                x: x,
                y: y
            };
            var x2 = propertyShorthand.x, y2 = propertyShorthand.y;
            var a1 = anArray[0], a2 = anArray[1], arest = anArray.slice(2);
            var WithStatisMember = /** @class */ (function () {
                function WithStatisMember() {
                }
                WithStatisMember.aFuncton = function () {
                };
                return WithStatisMember;
            }());
            for (var _i = 0, _b = testGenerator(); _i < _b.length; _i++) {
                var item = _b[_i];
            }
        }
        catch (e) {
        }
    };
    ClientDetector.prototype.testBuiltins = function () {
        return (typeof Set !== "undefined" &&
            typeof Map !== "undefined" &&
            typeof Array.prototype.includes === "function" &&
            typeof Object.entries === "function" &&
            typeof Object.values === "function" &&
            typeof Object.fromEntries === "function" &&
            typeof Symbol !== "undefined" &&
            typeof Uint8Array !== "undefined" &&
            typeof Proxy !== "undefined" &&
            typeof Reflect !== "undefined" &&
            typeof Promise.prototype["finally"] !== "undefined");
    };
    /**
     * Browsers which support these features are supported
     */
    ClientDetector.prototype.isSupported = function () {
        this.syntaxChecks();
        return this.isSupportedBrowserVersion() && this.testBuiltins() && this.websockets();
    };
    ClientDetector.prototype.isMobileDevice = function () {
        return this.device !== "Desktop" /* DeviceType.DESKTOP */;
    };
    ClientDetector.prototype.isDesktopDevice = function () {
        return this.device === "Desktop" /* DeviceType.DESKTOP */;
    };
    /**
     * @see https://github.com/Modernizr/Modernizr/blob/5e3f359bfc9aa511543ece60bd8a6ea8aa7defd3/feature-detects/websockets.js
     */
    ClientDetector.prototype.websockets = function () {
        return "WebSocket" in window && window.WebSocket.CLOSING === 2;
    };
    ClientDetector.prototype.localStorage = function () {
        try {
            return localStorage != null;
        }
        catch (e) {
            // DOMException is thrown if all cookies are disabled
            return false;
        }
    };
    /**
     * @see https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
     */
    ClientDetector.prototype.history = function () {
        return window.history && "pushState" in window.history;
    };
    /**
     * @see https://github.com/Modernizr/Modernizr/blob/master/feature-detects/network/xhr2.js
     */
    ClientDetector.prototype.xhr2 = function () {
        return "XMLHttpRequest" in window;
    };
    ClientDetector.prototype.indexedDb = function () {
        try {
            return window.indexedDB != null;
        }
        catch (e) {
            return false;
        }
    };
    /**
     * @see https://github.com/Modernizr/Modernizr/issues/1894
     */
    ClientDetector.prototype.passive = function () {
        var supportsPassive = false;
        try {
            // @ts-ignore
            window.document.addEventListener("test", null, {
                // @ts-ignore
                get passive() {
                    supportsPassive = true;
                }
            });
        }
        catch (e) {
        }
        return supportsPassive;
    };
    ClientDetector.prototype._setBrowserAndVersion = function () {
        var operaIndex1 = this.userAgent.indexOf("Opera");
        var operaIndex2 = this.userAgent.indexOf("OPR/");
        var firefoxIndex = this.userAgent.indexOf("Firefox/");
        var paleMoonIndex = this.userAgent.indexOf("PaleMoon/");
        var iceweaselIndex = this.userAgent.indexOf("Iceweasel/");
        var chromeIndex = this.userAgent.indexOf("Chrome/");
        var chromeIosIndex = this.userAgent.indexOf("CriOS/");
        var safariIndex = this.userAgent.indexOf("Safari/");
        var edgeIndex = this.userAgent.indexOf("Edge"); // "Old" edge based on EdgeHTML, "new" one based on Blink has only "Edg"
        var androidIndex = this.userAgent.indexOf("Android");
        var versionIndex = -1;
        if (edgeIndex !== -1) {
            this.browser = "Edge" /* BrowserType.EDGE */;
            versionIndex = edgeIndex + 5;
        }
        else if (operaIndex1 !== -1) {
            this.browser = "Opera" /* BrowserType.OPERA */;
            versionIndex = this.userAgent.indexOf("Version/");
            if (versionIndex !== -1) {
                versionIndex += 8;
            }
            else {
                versionIndex = operaIndex1 + 6;
            }
        }
        else if (operaIndex2 !== -1) {
            this.browser = "Opera" /* BrowserType.OPERA */;
            versionIndex = operaIndex2 + 4;
        }
        else if ((firefoxIndex !== -1 || iceweaselIndex !== -1) && operaIndex1 === -1 && operaIndex2 === -1 && paleMoonIndex === -1) {
            // Opera may pretend to be Firefox, so it is skipped
            this.browser = "Firefox" /* BrowserType.FIREFOX */;
            if (firefoxIndex !== -1) {
                versionIndex = firefoxIndex + 8;
            }
            else {
                versionIndex = iceweaselIndex + 10;
            }
        }
        else if (chromeIndex !== -1) {
            this.browser = "Chrome" /* BrowserType.CHROME */;
            versionIndex = chromeIndex + 7;
        }
        else if (androidIndex !== -1) {
            // default android browser
            // keep this check after Chrome, Firefox and Opera, because the Android browser does not identify itself in any other way
            this.browser = "Android" /* BrowserType.ANDROID */;
            versionIndex = androidIndex + 8;
        }
        else if (chromeIosIndex !== -1) {
            this.browser = "Chrome" /* BrowserType.CHROME */;
            versionIndex = chromeIosIndex + 6;
        }
        else if (safariIndex !== -1 && chromeIndex === -1) {
            // Chrome and black berry pretends to be Safari, so it is skipped
            this.browser = "Safari" /* BrowserType.SAFARI */;
            // Safari prints its version after "Version/"
            versionIndex = this.userAgent.indexOf("Version/");
            if (versionIndex !== -1) {
                versionIndex += 8;
            }
            else {
                // Other browsers on iOS do not usually send Version/ and we can assume that they're Safari
                this.extractIosVersion();
                return;
            }
        }
        else if (this.userAgent.match(/iPad.*AppleWebKit/) || this.userAgent.match(/iPhone.*AppleWebKit/)) {
            // iPad and iPhone do not send the Safari this.userAgent when HTML-apps are directly started from the homescreen a browser version is sent neither
            // after "OS" the iOS version is sent, so use that one
            // Also there are a lot of browsers on iOS but they all are based on Safari so we can use the same extraction mechanism for all of them.
            this.extractIosVersion();
            return;
        }
        if (versionIndex !== -1) {
            var mainVersionEndIndex = this.userAgent.indexOf(".", versionIndex);
            if (mainVersionEndIndex !== -1) {
                try {
                    this.browserVersion = Number(this.userAgent.substring(versionIndex, mainVersionEndIndex + 2)); // we recognize one digit after the '.'
                }
                catch (e) {
                }
            }
        }
        // if the version is not valid, the browser type is not valid, so set it to other
        if (this.browserVersion === 0) {
            this.browser = "Other" /* BrowserType.OTHER */;
        }
    };
    ClientDetector.prototype.extractIosVersion = function () {
        // Extracting version does not work with iPad OS WebView because it's not in the userAgent. We could look it up
        // from Webkit version but maybe we don't need that for now.
        var versionIndex = this.userAgent.indexOf(" OS ");
        if (versionIndex !== -1) {
            this.browser = "Safari" /* BrowserType.SAFARI */;
            try {
                // in case of versions like 12_1_1 get substring 12_1 and convert it to 12.1
                var pos = versionIndex + 4;
                var hadNan = false;
                while (pos < this.userAgent.length) {
                    pos++;
                    if (isNaN(Number(this.userAgent.charAt(pos)))) {
                        if (hadNan) {
                            break;
                        }
                        else {
                            hadNan = true;
                        }
                    }
                }
                var numberString = this.userAgent.substring(versionIndex + 4, pos);
                this.browserVersion = Number(numberString.replace(/_/g, "."));
            }
            catch (e) {
            }
        }
    };
    ClientDetector.prototype._setDeviceInfo = function () {
        this.device = "Desktop" /* DeviceType.DESKTOP */;
        if (this.userAgent.match(/iPad.*AppleWebKit/) != null || // iPadOS does not differ in UserAgent from Safari on macOS. Use hack with TouchEvent to detect iPad
            // Desktop Chrome has TouchEvent but it also has Chrome in it. Mobile iOS has CriOS in it and not Chrome.
            (/Macintosh; Intel Mac OS X.*AppleWebKit/.test(this.userAgent) && window.TouchEvent && /.*Chrome.*/.test(this.userAgent) === false)) {
            this.device = "iPad" /* DeviceType.IPAD */;
        }
        else if (this.userAgent.match(/iPhone.*AppleWebKit/) != null) {
            this.device = "iPhone" /* DeviceType.IPHONE */;
        }
        else if (this.userAgent.match(/Android/) != null) {
            if (this.userAgent.match(/Ubuntu/) != null) {
                this.device = "Other mobile" /* DeviceType.OTHER_MOBILE */;
            }
            else {
                this.device = "Android" /* DeviceType.ANDROID */;
            }
        }
        else if (this.userAgent.match(/Windows NT/) != null) {
            this.device = "Desktop" /* DeviceType.DESKTOP */;
        }
        else if (this.userAgent.match(/Mobile/) != null || this.userAgent.match(/Tablet/) != null) {
            this.device = "Other mobile" /* DeviceType.OTHER_MOBILE */;
        }
    };
    ClientDetector.prototype.isTouchSupported = function () {
        return "ontouchstart" in window;
    };
    ClientDetector.prototype.isIos = function () {
        return this.device === "iPad" /* DeviceType.IPAD */ || this.device === "iPhone" /* DeviceType.IPHONE */;
    };
    ClientDetector.prototype.cssPropertyValueSupported = function (prop, value) {
        var d = document.createElement("div");
        d.style[prop] = value;
        return d.style[prop] === value;
    };
    ClientDetector.prototype.getIdentifier = function () {
        if (env.mode === Env_1.Mode.App) {
            return exports.client.device + " App";
        }
        else if (env.mode === Env_1.Mode.Browser) {
            return exports.client.browser + " Browser";
        }
        else if (env.platformId === "linux") {
            return "Linux Desktop";
        }
        else if (env.platformId === "darwin") {
            return "Mac Desktop";
        }
        else if (env.platformId === "win32") {
            return "Windows Desktop";
        }
        return "Unknown";
    };
    ClientDetector.prototype.isSupportedBrowserVersion = function () {
        return this.notOldFirefox() && this.notOldChrome();
    };
    ClientDetector.prototype.notOldFirefox = function () {
        // issue only occurs for old Firefox browsers
        // https://github.com/tutao/tutanota/issues/835
        return this.browser !== "Firefox" /* BrowserType.FIREFOX */ || this.browserVersion > 40;
    };
    ClientDetector.prototype.notOldChrome = function () {
        return this.browser !== "Chrome" /* BrowserType.CHROME */ || this.browserVersion > 55;
    };
    ClientDetector.prototype.needsMicrotaskHack = function () {
        return (this.isIos() ||
            this.browser === "Safari" /* BrowserType.SAFARI */ ||
            (this.browser === "Firefox" /* BrowserType.FIREFOX */ && this.browserVersion <= 60) ||
            (this.browser === "Chrome" /* BrowserType.CHROME */ && this.browserVersion < 59));
    };
    ClientDetector.prototype.needsExplicitIDBIds = function () {
        return this.browser === "Safari" /* BrowserType.SAFARI */ && this.browserVersion < 12.2;
    };
    ClientDetector.prototype.browserData = function () {
        return {
            needsMicrotaskHack: this.needsMicrotaskHack(),
            needsExplicitIDBIds: this.needsExplicitIDBIds(),
            indexedDbSupported: this.indexedDb()
        };
    };
    return ClientDetector;
}());
exports.ClientDetector = ClientDetector;
exports.client = new ClientDetector();
