"use strict";
exports.__esModule = true;
exports.createDesktopInterfaces = exports.createNativeInterfaces = void 0;
var NativeInterfaceMain_js_1 = require("./NativeInterfaceMain.js");
var NativePushServiceApp_js_1 = require("./NativePushServiceApp.js");
var FileApp_js_1 = require("../common/FileApp.js");
var Env_js_1 = require("../../api/common/Env.js");
var ProgrammingError_js_1 = require("../../api/common/error/ProgrammingError.js");
var LoginController_js_1 = require("../../api/main/LoginController.js");
var DeviceConfig_js_1 = require("../../misc/DeviceConfig.js");
var WebGlobalDispatcher_js_1 = require("../common/generatedipc/WebGlobalDispatcher.js");
var NativePushFacadeSendDispatcher_js_1 = require("../common/generatedipc/NativePushFacadeSendDispatcher.js");
var FileFacadeSendDispatcher_js_1 = require("../common/generatedipc/FileFacadeSendDispatcher.js");
var ExportFacadeSendDispatcher_js_1 = require("../common/generatedipc/ExportFacadeSendDispatcher.js");
var CommonSystemFacadeSendDispatcher_js_1 = require("../common/generatedipc/CommonSystemFacadeSendDispatcher.js");
var MobileSystemFacadeSendDispatcher_js_1 = require("../common/generatedipc/MobileSystemFacadeSendDispatcher.js");
var ThemeFacadeSendDispatcher_js_1 = require("../common/generatedipc/ThemeFacadeSendDispatcher.js");
var SearchTextInAppFacadeSendDispatcher_js_1 = require("../common/generatedipc/SearchTextInAppFacadeSendDispatcher.js");
var SettingsFacadeSendDispatcher_js_1 = require("../common/generatedipc/SettingsFacadeSendDispatcher.js");
var DesktopSystemFacadeSendDispatcher_js_1 = require("../common/generatedipc/DesktopSystemFacadeSendDispatcher.js");
var InterWindowEventFacadeSendDispatcher_js_1 = require("../common/generatedipc/InterWindowEventFacadeSendDispatcher.js");
var SqlCipherFacadeSendDispatcher_js_1 = require("../common/generatedipc/SqlCipherFacadeSendDispatcher.js");
/**
 * @returns NativeInterfaces
 * @throws ProgrammingError when you try to call this in the web browser
 */
function createNativeInterfaces(mobileFacade, desktopFacade, interWindowEventFacade, commonNativeFacade, cryptoFacade, calendarFacade, entityClient) {
    if ((0, Env_js_1.isBrowser)()) {
        throw new ProgrammingError_js_1.ProgrammingError("Tried to make native interfaces in non-native");
    }
    var dispatcher = new WebGlobalDispatcher_js_1.WebGlobalDispatcher(commonNativeFacade, desktopFacade, interWindowEventFacade, mobileFacade);
    var native = new NativeInterfaceMain_js_1.NativeInterfaceMain(dispatcher);
    var nativePushFacadeSendDispatcher = new NativePushFacadeSendDispatcher_js_1.NativePushFacadeSendDispatcher(native);
    var pushService = new NativePushServiceApp_js_1.NativePushServiceApp(nativePushFacadeSendDispatcher, LoginController_js_1.logins, cryptoFacade, entityClient, DeviceConfig_js_1.deviceConfig, calendarFacade);
    var fileApp = new FileApp_js_1.NativeFileApp(new FileFacadeSendDispatcher_js_1.FileFacadeSendDispatcher(native), new ExportFacadeSendDispatcher_js_1.ExportFacadeSendDispatcher(native));
    var commonSystemFacade = new CommonSystemFacadeSendDispatcher_js_1.CommonSystemFacadeSendDispatcher(native);
    var mobileSystemFacade = new MobileSystemFacadeSendDispatcher_js_1.MobileSystemFacadeSendDispatcher(native);
    var themeFacade = new ThemeFacadeSendDispatcher_js_1.ThemeFacadeSendDispatcher(native);
    var sqlCipherFacade = new SqlCipherFacadeSendDispatcher_js_1.SqlCipherFacadeSendDispatcher(native);
    return {
        native: native,
        fileApp: fileApp,
        pushService: pushService,
        mobileSystemFacade: mobileSystemFacade,
        commonSystemFacade: commonSystemFacade,
        themeFacade: themeFacade,
        sqlCipherFacade: sqlCipherFacade
    };
}
exports.createNativeInterfaces = createNativeInterfaces;
function createDesktopInterfaces(native) {
    if (!(0, Env_js_1.isElectronClient)()) {
        throw new ProgrammingError_js_1.ProgrammingError("tried to create desktop interfaces in non-electron client");
    }
    return {
        searchTextFacade: new SearchTextInAppFacadeSendDispatcher_js_1.SearchTextInAppFacadeSendDispatcher(native),
        desktopSettingsFacade: new SettingsFacadeSendDispatcher_js_1.SettingsFacadeSendDispatcher(native),
        desktopSystemFacade: new DesktopSystemFacadeSendDispatcher_js_1.DesktopSystemFacadeSendDispatcher(native),
        interWindowEventSender: new InterWindowEventFacadeSendDispatcher_js_1.InterWindowEventFacadeSendDispatcher(native)
    };
}
exports.createDesktopInterfaces = createDesktopInterfaces;
