"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 为fetch增加超时的功能
 * 1、新建一个取消的promise
 * 2、使用Promise.race来判断先执行完毕的promise
 * 3、返回新的promise
 * @param fetchPromise fetch的promise
 * @param timeout 超时时间
 */
exports.fetchDec = function (fetchPromise, timeout) {
    var abortFn;
    var abortPromise = new Promise(function (resolve, reject) {
        abortFn = function () {
            reject(new Error("timeout\uFF08" + timeout + "\uFF09"));
        };
    });
    var abortablePromise = Promise.race([
        fetchPromise,
        abortPromise
    ]);
    var timeid = setTimeout(function () {
        abortFn();
    }, timeout);
    abortablePromise.then(function () {
        clearTimeout(timeid);
    }, function () {
        clearTimeout(timeid);
    });
    return abortablePromise;
};
//# sourceMappingURL=fetch.decorator.js.map