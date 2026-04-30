"use strict";
exports.__esModule = true;
exports.pureComponent = void 0;
function pureComponent(factory) {
    return {
        view: function (vnode) {
            return factory(vnode.attrs, vnode.children);
        }
    };
}
exports.pureComponent = pureComponent;
