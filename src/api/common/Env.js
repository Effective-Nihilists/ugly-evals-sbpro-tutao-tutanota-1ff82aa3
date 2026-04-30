"use strict";
//@bundleInto:common-min
exports.__esModule = true;
exports.assertOfflineStorageAvailable = exports.isOfflineStorageAvailable = exports.bootFinished = exports.assertWorkerOrNode = exports.assertMainOrNodeBoot = exports.assertMainOrNode = exports.isDesktopMainThread = exports.isTest = exports.isWorker = exports.isWorkerOrNode = exports.isMainOrNode = exports.isElectronClient = exports.isAdminClient = exports.isWebClient = exports.isMain = exports.ifDesktop = exports.isBrowser = exports.isDesktop = exports.isApp = exports.isAndroidApp = exports.isIOSApp = exports.isTutanotaDomain = exports.getPaymentWebRoot = exports.getWebRoot = exports.getHttpOrigin = exports.getWebsocketOrigin = exports.Mode = exports.LOGIN_TITLE = void 0;
// keep in sync with LaunchHtml.js meta tag title
var ProgrammingError_js_1 = require("./error/ProgrammingError.js");
exports.LOGIN_TITLE = "Mail. Done. Right. Tutanota Login & Sign up for an Ad-free Mailbox";
exports.Mode = Object.freeze({
    Browser: "Browser",
    App: "App",
    Test: "Test",
    Playground: "Playground",
    Desktop: "Desktop",
    Admin: "Admin"
});
function getWebsocketOrigin() {
    return getHttpOrigin()
        // replaces http: with ws: and https: with wss:
        .replace(/^http/, "ws")
        // for ios app custom protocol
        .replace(/^api/, "ws");
}
exports.getWebsocketOrigin = getWebsocketOrigin;
/** Returns the origin which should be used for API requests. */
function getHttpOrigin() {
    if (env.staticUrl) {
        if (isIOSApp()) {
            // http:// -> api:// and https:// -> apis://
            return env.staticUrl.replace(/^http/, "api");
        }
        else {
            return env.staticUrl;
        }
    }
    else {
        return location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");
    }
}
exports.getHttpOrigin = getHttpOrigin;
/**
 * root used for gift cards and as the webauthn registered domain
 */
function getWebRoot() {
    var origin = getHttpOrigin();
    return origin + (origin.includes("localhost") || origin.includes("local.tutanota.com") ? "/client/build" : "");
}
exports.getWebRoot = getWebRoot;
function getPaymentWebRoot() {
    if (env.staticUrl === "mail.tutanota.com") {
        return "https://pay.tutanota.com";
    }
    else if (env.staticUrl === "test.tutanota.com") {
        return "https://pay.test.tutanota.com";
    }
    else {
        return getWebRoot();
    }
}
exports.getPaymentWebRoot = getPaymentWebRoot;
function isTutanotaDomain() {
    // *.tutanota.com or without dots (e.g. localhost). otherwise it is a custom domain
    return location.hostname.endsWith("tutanota.com") || location.hostname.indexOf(".") === -1;
}
exports.isTutanotaDomain = isTutanotaDomain;
function isIOSApp() {
    if (isApp() && env.platformId == null) {
        throw new ProgrammingError_js_1.ProgrammingError("PlatformId is not set!");
    }
    return env.mode === exports.Mode.App && env.platformId === "ios";
}
exports.isIOSApp = isIOSApp;
function isAndroidApp() {
    if (isApp() && env.platformId == null) {
        throw new ProgrammingError_js_1.ProgrammingError("PlatformId is not set!");
    }
    return env.mode === exports.Mode.App && env.platformId === "android";
}
exports.isAndroidApp = isAndroidApp;
function isApp() {
    return env.mode === exports.Mode.App;
}
exports.isApp = isApp;
function isDesktop() {
    return env.mode === exports.Mode.Desktop;
}
exports.isDesktop = isDesktop;
function isBrowser() {
    return env.mode === exports.Mode.Browser;
}
exports.isBrowser = isBrowser;
function ifDesktop(obj) {
    return isDesktop() ? obj : null;
}
exports.ifDesktop = ifDesktop;
var worker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
var node = typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node !== "undefined";
function isMain() {
    return !worker && !node;
}
exports.isMain = isMain;
function isWebClient() {
    return env.mode === exports.Mode.Browser;
}
exports.isWebClient = isWebClient;
function isAdminClient() {
    return env.mode === exports.Mode.Admin;
}
exports.isAdminClient = isAdminClient;
function isElectronClient() {
    return isDesktop() || isAdminClient();
}
exports.isElectronClient = isElectronClient;
function isMainOrNode() {
    return !worker || node || env.mode === exports.Mode.Test;
}
exports.isMainOrNode = isMainOrNode;
function isWorkerOrNode() {
    return worker || node || env.mode === exports.Mode.Test;
}
exports.isWorkerOrNode = isWorkerOrNode;
function isWorker() {
    return worker;
}
exports.isWorker = isWorker;
function isTest() {
    return env.mode === exports.Mode.Test;
}
exports.isTest = isTest;
function isDesktopMainThread() {
    return node && typeof env !== "undefined" && (env.mode === exports.Mode.Desktop || env.mode === exports.Mode.Admin);
}
exports.isDesktopMainThread = isDesktopMainThread;
var boot = !isDesktopMainThread() && !isWorker();
var assertionsEnabled = typeof NO_THREAD_ASSERTIONS === "undefined" || !NO_THREAD_ASSERTIONS;
function assertMainOrNode() {
    if (!assertionsEnabled)
        return;
    if (!isMainOrNode()) {
        throw new Error("this code must not run in the worker thread");
    }
    if (boot) {
        throw new Error("this main code must not be loaded at boot time");
    }
}
exports.assertMainOrNode = assertMainOrNode;
function assertMainOrNodeBoot() {
    if (!assertionsEnabled)
        return;
    if (!isMainOrNode()) {
        throw new Error("this code must not run in the worker thread");
    }
}
exports.assertMainOrNodeBoot = assertMainOrNodeBoot;
function assertWorkerOrNode() {
    if (!assertionsEnabled)
        return;
    if (!isWorkerOrNode()) {
        throw new Error("this code must not run in the gui thread");
    }
}
exports.assertWorkerOrNode = assertWorkerOrNode;
function bootFinished() {
    boot = false;
}
exports.bootFinished = bootFinished;
/**
 * Whether or not we will be using an offline cache (doesn't take into account if credentials are stored)
 */
function isOfflineStorageAvailable() {
    return !isBrowser();
}
exports.isOfflineStorageAvailable = isOfflineStorageAvailable;
function assertOfflineStorageAvailable() {
    if (!isOfflineStorageAvailable()) {
        throw new Error("Offline storage is not available");
    }
    return isDesktop();
}
exports.assertOfflineStorageAvailable = assertOfflineStorageAvailable;
