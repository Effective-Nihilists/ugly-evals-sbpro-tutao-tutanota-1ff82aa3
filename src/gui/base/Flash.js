"use strict";
exports.__esModule = true;
exports.flashOutElement = exports.flashOut = exports.flashIn = exports.removeFlash = exports.addFlash = void 0;
var Animations_1 = require("../animation/Animations");
var ClientDetector_1 = require("../../misc/ClientDetector");
var Env_1 = require("../../api/common/Env");
(0, Env_1.assertMainOrNodeBoot)();
var flashedIn = new Map(); // currently flashed in element -> target opacity value
var PREVENT = function (e) { return e.preventDefault(); };
var eventListenerArgs = ClientDetector_1.client.passive()
    ? {
        passive: true
    }
    : false;
function addFlash(target) {
    if (ClientDetector_1.client.isDesktopDevice()) {
        target.addEventListener("mousedown", flashIn, eventListenerArgs);
        target.addEventListener("mouseup", flashOut, eventListenerArgs);
        target.addEventListener("dragstart", PREVENT, ClientDetector_1.client.passive()
            ? {
                passive: false
            }
            : false);
        target.addEventListener("mouseleave", flashOut, eventListenerArgs);
    }
    else {
        target.addEventListener("touchstart", flashIn, eventListenerArgs);
        target.addEventListener("touchend", flashOut, eventListenerArgs);
        target.addEventListener("touchcancel", flashOut, eventListenerArgs);
    }
}
exports.addFlash = addFlash;
function removeFlash(target) {
    if (ClientDetector_1.client.isDesktopDevice()) {
        target.removeEventListener("mousedown", flashIn, eventListenerArgs);
        target.removeEventListener("mouseup", flashOut, eventListenerArgs);
        target.removeEventListener("dragstart", PREVENT);
        target.removeEventListener("mouseleave", flashOut, eventListenerArgs);
    }
    else {
        target.removeEventListener("touchstart", flashIn, eventListenerArgs);
        target.removeEventListener("touchend", flashOut, eventListenerArgs);
        target.removeEventListener("touchcancel", flashOut, eventListenerArgs);
    }
}
exports.removeFlash = removeFlash;
function flashIn(event) {
    var target = event.currentTarget;
    var computedValue = getComputedOpacity(target); // use the computed value as begin value because hover only changes the computed opacity
    // keep the opacity value for the flash animation to avoid flicker on element
    Animations_1.animations.add(target, (0, Animations_1.opacity)(computedValue, 0.4, true));
    flashedIn.set(target, computedValue);
}
exports.flashIn = flashIn;
function flashOut(event) {
    var target = event.currentTarget;
    var computedValue = flashedIn.get(target);
    if (computedValue) {
        flashOutElement(target, computedValue);
    }
}
exports.flashOut = flashOut;
function flashOutElement(target, computedOpacity) {
    if (computedOpacity) {
        flashedIn["delete"](target);
        // don't keep the opacity value after the animation. hover on elements won't work otherwise.
        Animations_1.animations
            .add(target, (0, Animations_1.opacity)(0.4, computedOpacity, false), {
            delay: 300
        })
            .then(function () { return (target.style.opacity = ""); });
    }
}
exports.flashOutElement = flashOutElement;
function getComputedOpacity(target) {
    var computedValue = 0;
    if (window.getComputedStyle) {
        computedValue = Number(window.getComputedStyle(target).opacity);
    }
    else if (target.currentStyle) {
        computedValue = Number(target.currentStyle.opacity);
    }
    return computedValue;
}
