# modelproxy-engine-fetch

使用fetch来调用接口的engine。

## 支持的设置

1. settings.timeout 设置超时时间，默认为5s。
2. settings.cache   设置缓存，key为fullPath+method，类型为Promise。没有持久化。

## demo

```typescript

    import { FetchEngine } from 'modelproxy-engine-fetch';

    const reactEngine = new FetchEngine();

    reactEngine.init();
    /**
    * 请求真正的数据接口
    * 判断http的状态码，如果不是200，直接抛出错误
    * 判断数据的code字段，如果不是200，抛出错误
    * 返回数据
    */
    reactEngine.use(async (ctx, next) => {
        if (ctx.result.status !== 200) {
            throw new Error(ctx.result.statusText);
        }

        // 这里需要clone一个fetch，不然多次调用会报错（body stream already read）
        ctx.result = await ctx.result.clone();
        ctx.result = await ctx.result.json();

        if (ctx.result.code !== 200) {
            throw new Error(ctx.result.message);
        }
        await next();
    });

    const proxy = new modelProxy.Proxy();
    const proxyDefault = { engine: "react", mockDir: "/mock", state: __DEV__ ? "dev" : "prod" };

    proxy.addEngines({"react":reactEngine});

```

## Licence

MIT