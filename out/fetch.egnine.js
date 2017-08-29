"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var modelproxy_1 = require("modelproxy");
var isomorphic_fetch_1 = require("isomorphic-fetch");
var fetch_decorator_1 = require("./fetch.decorator");
var FetchEngine = (function (_super) {
    __extends(FetchEngine, _super);
    function FetchEngine() {
        return _super.call(this) || this;
    }
    /**
     * 初始化中间件
     * 处理参数params，data，header等数据
     */
    FetchEngine.prototype.init = function () {
        var _this = this;
        this.use(function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var formData, bodyParams, _a, executeInfo, _b, instance, body, headers, _c, _d, timeout, _e, originHeaders, _f, type, key, data, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        formData = new FormData();
                        bodyParams = new URLSearchParams();
                        _a = ctx.executeInfo, executeInfo = _a === void 0 ? {} : _a, _b = ctx.instance, instance = _b === void 0 ? {} : _b;
                        headers = { "X-Requested-With": "XMLHttpRequest" };
                        _c = executeInfo.settings || {}, _d = _c.timeout, timeout = _d === void 0 ? 5000 : _d, _e = _c.headers, originHeaders = _e === void 0 ? {} : _e, _f = _c.type, type = _f === void 0 ? "" : _f;
                        // 根据type来设置不同的header
                        switch (type) {
                            case "params":
                                headers = Object.assign({}, {
                                    "Accept": "application/json",
                                    "Content-Type": "application/json"
                                }, headers);
                                body = bodyParams;
                                break;
                            case "formdata":
                                body = formData;
                                break;
                            default:
                                headers = Object.assign({}, {
                                    "Accept": "application/json",
                                    "Content-Type": "application/json"
                                }, headers);
                                body = JSON.stringify(executeInfo.data || {});
                                break;
                        }
                        headers = Object.assign({}, headers || {}, originHeaders);
                        for (key in executeInfo.data) {
                            if (executeInfo.data.hasOwnProperty(key)) {
                                data = executeInfo.data[key];
                                formData.append(key, data);
                                bodyParams.append(key, data);
                            }
                        }
                        // 发送请求
                        _g = ctx;
                        return [4 /*yield*/, fetch_decorator_1.fetchDec(isomorphic_fetch_1.default(this.getFullPath(instance, executeInfo), {
                                body: ["GET", "OPTIONS", "HEAD"].indexOf(instance.method.toUpperCase()) === -1 ? body : null,
                                credentials: "same-origin",
                                headers: headers,
                                method: instance.method,
                            }), timeout)];
                    case 1:
                        // 发送请求
                        _g.result = _h.sent();
                        return [4 /*yield*/, next()];
                    case 2:
                        _h.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    /**
     * 调用接口代理方法
     * @param instance 接口的信息
     * @param options  调用接口的参数
     */
    FetchEngine.prototype.proxy = function (instance, options) {
        return __awaiter(this, void 0, void 0, function () {
            var fn, ctx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fn = this.callback(function () {
                            // console.log();
                        });
                        ctx = {
                            executeInfo: options,
                            instance: instance,
                        };
                        return [4 /*yield*/, fn(ctx)];
                    case 1:
                        _a.sent();
                        if (ctx.isError) {
                            throw ctx.err;
                        }
                        return [2 /*return*/, ctx.result];
                }
            });
        });
    };
    return FetchEngine;
}(modelproxy_1.BaseEngine));
exports.FetchEngine = FetchEngine;
//# sourceMappingURL=fetch.egnine.js.map