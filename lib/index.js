"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
function toStringSafe(val, defaultValue = '') {
    if (_.isString(val)) {
        return val;
    }
    if (_.isNil(val)) {
        return '' + defaultValue;
    }
    if (val instanceof Error) {
        return `[${val.name}] ${val.message}${_.isNil(val.stack) ? '' : ("\n\n" + val.stack)}`;
    }
    if (_.isFunction(val['toString'])) {
        return '' + val.toString();
    }
    return '' + val;
}
exports.toStringSafe = toStringSafe;
//# sourceMappingURL=index.js.map