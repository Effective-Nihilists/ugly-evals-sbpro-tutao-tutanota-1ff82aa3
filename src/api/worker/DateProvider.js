"use strict";
exports.__esModule = true;
exports.LocalTimeDateProvider = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var LocalTimeDateProvider = /** @class */ (function () {
    function LocalTimeDateProvider() {
    }
    LocalTimeDateProvider.prototype.getStartOfDayShiftedBy = function (shiftByDays) {
        return (0, tutanota_utils_1.getStartOfDay)((0, tutanota_utils_1.getDayShifted)(new Date(), shiftByDays));
    };
    return LocalTimeDateProvider;
}());
exports.LocalTimeDateProvider = LocalTimeDateProvider;
