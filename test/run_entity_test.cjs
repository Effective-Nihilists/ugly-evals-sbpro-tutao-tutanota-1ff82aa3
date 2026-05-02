const { JSDOM } = require("jsdom");
const xhr2 = require("xhr2");
const crypto_pkg = require("crypto");

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
const win = globalThis.window;
win.tutao = { appState: { prefixWithoutFile: "./" } };

process.on("unhandledRejection", function (e) {
  console.log("Uncaught (in promise) " + e.stack);
});

require("./build/EntityRestCacheTest.bundle.cjs");
