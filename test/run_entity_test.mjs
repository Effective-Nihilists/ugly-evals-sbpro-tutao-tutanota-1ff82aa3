import { JSDOM } from "jsdom";
import xhr2 from "xhr2";
import crypto_pkg from "crypto";
import express_pkg from "express";
import bodyParser_pkg from "body-parser";

const noOp = () => {};

globalThis.browser = () => noOp;
globalThis.node = (func) => func;

var dom = new JSDOM("", { pretendToBeVisual: true });
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame;
globalThis.window = dom.window;
dom.reconfigure({ url: "http://tutanota.com" });
globalThis.window.getElementsByTagName = function() {};
globalThis.window.document.addEventListener = function() {};
globalThis.document = globalThis.window.document;
Object.defineProperty(globalThis, "navigator", {
  value: globalThis.window.navigator,
  writable: true,
  configurable: true
});
const local = {};
globalThis.localStorage = {
  getItem: key => local[key],
  setItem: (key, value) => (local[key] = value),
};
globalThis.btoa = (str) => Buffer.from(str, "binary").toString("base64");
globalThis.atob = (b64) => Buffer.from(b64, "base64").toString("binary");
globalThis.WebSocket = noOp;
globalThis.performance = { now: Date.now, mark: noOp, measure: noOp };
Object.defineProperty(globalThis, "crypto", {
  value: {
    getRandomValues: function (bytes) {
      let randomBytes = crypto_pkg.randomBytes(bytes.length);
      bytes.set(randomBytes);
    },
  },
  writable: true,
  configurable: true,
});
globalThis.XMLHttpRequest = xhr2.default || xhr2;
globalThis.electronMock = { app: {} };
globalThis.express = express_pkg.default || express_pkg;
globalThis.bodyParser = bodyParser_pkg.default || bodyParser_pkg;

const window = globalThis.window;
window.tutao = { appState: { prefixWithoutFile: "./" } };

process.on("unhandledRejection", function (e) {
  console.log("Uncaught (in promise) " + e.stack);
});

await import("./build/EntityRestCacheTest.bundle.js");
