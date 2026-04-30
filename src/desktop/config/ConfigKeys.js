"use strict";
// @bundleInto:common
exports.__esModule = true;
exports.BuildConfigKey = exports.DesktopConfigEncKey = exports.DesktopConfigKey = void 0;
var DesktopConfigKey;
(function (DesktopConfigKey) {
    DesktopConfigKey["heartbeatTimeoutInSeconds"] = "heartbeatTimeoutInSeconds";
    DesktopConfigKey["defaultDownloadPath"] = "defaultDownloadPath";
    DesktopConfigKey["enableAutoUpdate"] = "enableAutoUpdate";
    DesktopConfigKey["showAutoUpdateOption"] = "showAutoUpdateOption";
    DesktopConfigKey["runAsTrayApp"] = "runAsTrayApp";
    DesktopConfigKey["lastBounds"] = "lastBounds";
    DesktopConfigKey["pushEncSessionKeys"] = "pushEncSessionKeys";
    DesktopConfigKey["scheduledAlarms"] = "scheduledAlarms";
    DesktopConfigKey["lastProcessedNotificationId"] = "lastProcessedNotificationId";
    DesktopConfigKey["lastMissedNotificationCheckTime"] = "lastMissedNotificationCheckTime";
    DesktopConfigKey["desktopConfigVersion"] = "desktopConfigVersion";
    DesktopConfigKey["mailExportMode"] = "mailExportMode";
    DesktopConfigKey["spellcheck"] = "spellcheck";
    DesktopConfigKey["selectedTheme"] = "selectedTheme";
    DesktopConfigKey["themes"] = "themes";
    DesktopConfigKey["webConfigLocation"] = "webConfigLocation";
})(DesktopConfigKey = exports.DesktopConfigKey || (exports.DesktopConfigKey = {}));
var DesktopConfigEncKey;
(function (DesktopConfigEncKey) {
    DesktopConfigEncKey["sseInfo"] = "sseInfo";
})(DesktopConfigEncKey = exports.DesktopConfigEncKey || (exports.DesktopConfigEncKey = {}));
var BuildConfigKey;
(function (BuildConfigKey) {
    BuildConfigKey["pollingInterval"] = "pollingInterval";
    BuildConfigKey["checkUpdateSignature"] = "checkUpdateSignature";
    BuildConfigKey["appUserModelId"] = "appUserModelId";
    BuildConfigKey["initialSseConnectTimeoutInSeconds"] = "initialSseConnectTimeoutInSeconds";
    BuildConfigKey["maxSseConnectTimeoutInSeconds"] = "maxSseConnectTimeoutInSeconds";
    BuildConfigKey["defaultDesktopConfig"] = "defaultDesktopConfig";
    BuildConfigKey["webAssetsPath"] = "webAssetsPath";
    BuildConfigKey["preloadjs"] = "preloadjs";
    BuildConfigKey["iconName"] = "iconName";
    BuildConfigKey["fileManagerTimeout"] = "fileManagerTimeout";
    BuildConfigKey["pubKeys"] = "pubKeys";
    BuildConfigKey["updateUrl"] = "updateUrl";
})(BuildConfigKey = exports.BuildConfigKey || (exports.BuildConfigKey = {}));
