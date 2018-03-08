import { ModelProxy, BaseEngine } from "modelproxy";
import { IProxyCtx } from "modelproxy/out/models/proxyctx";
import { IInterfaceModel } from "modelproxy/out/models/interface";

import * as fetch from "isomorphic-fetch";

import { fetchDec } from "./fetch.decorator";

export class FetchEngine extends BaseEngine {
    /**
     * 初始化中间件
     * 处理参数params，data，header等数据
     */
    public init(): void {
        this.use(async (ctx: IProxyCtx, next: Function) => {
            let formData = new FormData();
            let bodyParams = new URLSearchParams();
            let { executeInfo = {}, instance = {} } = ctx;
            let body, headers: any = { "X-Requested-With": "XMLHttpRequest" };
            let { timeout = 5000, headers: originHeaders = {}, type = "", fetch: fetchOptions = {} } = executeInfo.settings || {};

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

            for (const key in executeInfo.data) {
                if (executeInfo.data.hasOwnProperty(key)) {
                    let data = executeInfo.data[key];

                    formData.append(key, data);
                    bodyParams.append(key, data);
                }
            }

            // 发送请求
            ctx.result = await fetchDec(fetch(this.getFullPath(instance as any, executeInfo), Object.assign({}, {
                body: ["GET", "OPTIONS", "HEAD"].indexOf((instance.method as any).toUpperCase()) === -1 ? body : null,
                credentials: "same-origin",
                headers: headers,
                method: instance.method as any,
            }, fetchOptions)), timeout);

            await next();
        });
    }

    /**
     * 调用接口代理方法
     * @param instance 接口的信息
     * @param options  调用接口的参数
     */
    public async proxy(instance: IInterfaceModel, options: any): Promise<any> {
        const fn = this.callback(() => {
            // console.log();
        });
        const ctx: IProxyCtx = {
            executeInfo: options,
            instance: instance,
        };

        await fn(ctx);

        if (ctx.isError) {
            throw ctx.err;
        }

        return ctx.result;
    }
}
