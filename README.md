# 联调准备 
1,安装nei  
请安装最新版本nei

```
npm install nei -g
```
由于目前nei版本在ftl渲染插件上有些问题，目前使用可以安装如下测试版本
```
sudo npm install "NEYouFan/nei-toolkit#fmpp" -g
```
2，安装edu-nei-mock   

```
npm install edu-nei-mock -g
```


# 联调的姿势：
以cp工程，使用test-web1的数据为例：  
####  1，绑定host  
我们需要绑定两个域名

```
#联调时访问的域名
127.0.0.1 cplocal.study.163.com

#数据来源的域名
10.165.124.34 cp.study.163.com
```
#### 2，确保登录  
如果联调的工程是需要登录信息的，请先确保登录，能正确拿到数据和对应的权限

#### 3，启动nei服务器mock

#### 4，在对应的工程根目录执行：

```
edu-nei-mock -p 'http://cp.study.163.com/' -m pc
```
-p  <mockpath>:需要代理的工程线上域名 

工程名| 域名
---|---
云课堂主站web端 | http://study.163.com/
云课堂主站wap端 | http://m.study.163.com/
云课堂-yooc平台 | http://mooc.study.163.com/
cp主站 | http://cp.study.163.com/
admin管理后台 | http://admin.study.163.com/

-m, <mode>:启动时，模拟的ua调试信息

启动模式| 说明
---|---
pc | pc端模拟
mobile | wap端模拟
weixin-a | 微信内-安卓手机
weixin-i | 微信内-苹果手机
app-a | 云课堂APP内-安卓手机
app-i | 云课堂APP内-苹果手机

#### 5，根据nei启动端口访问：
http://cplocal.study.163.com:8002/{id}  
比如，我可以访问
http://cplocal.study.163.com:8002/1014290573

这个时候就可以愉快的联调了。


- 如果联调阶段，希望访问的是某位后端同学数据，，那么绑定这位后端同学机器的host即可
- 如果我们想查看一下线上的问题把对应的host去掉，直接使用线上的ip解析就行



# 已解决的问题： 
#### 前后端分离方案选择
1，联调环境代码不打包，遇到的问题
- study.163.com域名对应两个工程，无法配置多ftl映射
- 

#### 前后端分离如何处理study、yooc老的java框架工程
1.从老工程中分理出前端文件  
2.处理ftl的路径  
由于study中ftl路径的解析很多依赖于后端的框架，然而nei启动的时候，是直接读取ftl的路径，所以
需要一个脚本，去把这些路径转换为nei能直接使用的view路径。buildView.js by lxx  
3.同步正在开发的老工程和新分离工程的代码

#### 如何mock大量ftl中回填的复杂数据
工程中有很多后端回填的复杂数据结构，但是通常情况下，我们不会去修改，只是启动页面去开发组件或者模块。所以去mock大量的后端回填数据，是很费精力的。  
nei提供了modelServer工程,帮助我们去拿测试环境，或者线上环境的ftl回填model数据
```
modelServer: {
        // 完整的主机地址，包括协议、主机名、端口
        host: 'http://cp.study.163.com/',
        // 查询参数，键值对
        queries: {format:'json'},
        // 自定义请求头，键值对
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36"
        },
        // path 可以是字符串，也可以是函数；默认不用传，即使用 host + 页面path + queries 的值
        // 如果是函数，则使用函数的返回值，传给函数的参数 options 是一个对象，它包含 host、path（页面path）、queries、headers 等参数
        // 如果 path 的值为假值，则使用 host + 页面path + queries 的值；
        // 如果 path 的值是相对地址，则会在前面加上 host
        
    },
```

#### 如何代理接口
nei提供的routes，穷举了mock工程下，所有路由的列表
```
    /* 路由 */
    routes: {
        //"ALL /api/*": "代理所有接口, 这里输入代理服务器地址",
        "GET /user/setting.htm": { name: '设置页面', index: 0, list: [{"id":14197,"path":"views/user/setting"}] },
        "POST /j/search/hotwords.json": { path: 'post/j/search/hotwords.json/data', id: 50203, group: '默认分组' },
        "POST /j/order/changeAccountSysOrder.do": { path: 'post/j/order/changeAccountSysOrder.do/data', id: 52189, group: '默认分组' },
        "POST /j/order/bindTelPhoneToAccount.do": { path: 'post/j/order/bindTelPhoneToAccount.do/data', id: 52463, group: '默认分组' },
        "GET /index/": { name: '首页', index: 0, list: [{"id":14104,"path":"views/index"}] },
        "POST /dwr/call/plaincall/UserCenterBean.myCouponCount.dwr": { path: 'post/dwr/call/plaincall/UserCenterBean.myCouponCount.dwr/data', id: 52899, group: '公用接口' },
        "POST /dwr/call/plaincall/ShopCartBean.getCount.dwr": { path: 'post/dwr/call/plaincall/ShopCartBean.getCount.dwr/data', id: 52759, group: '公用接口' },
        "ALL /j/*": 'http://study.163.com/',
        "ALL /p/*": 'http://study.163.com/',
        "*.dwr ": 'http://study.163.com/',
    },
```

从上述的配置中，我们可以看出，一个接口，可以有多重数据来源：
- 测试环境或者线上
- 本地mock
我们也可以把所有接口都代理到测试环境，或者在开发的时候，只代理某一个接口到本地，都是可行的。

#### 如何在nei中mock，dwr接口
DWR is a Java library that enables Java on the server and JavaScript in a browser to interact and call each other as simply as possible

除了看起来像是直接传输java对象之外，它还自带csrf校验，完善的异常处理机制等

楠哥dwr介绍：http://ks.netease.com/blog?id=3318  
其实，就是返回了一段js，然后全局环境下执行这段代码。
所以在nei的dwr返回接口中，对返回的请求做相应的解析即可
```
module.exports = function (json, req) {
    "use strict";
    req.res.contentType('text/javascript;charset=UTF-8');
    let body = {};
    req.body.split('\n').forEach(function(paramPair){
        let p = paramPair.split('=');
        if((/^\d+$/).test(p[1])){
            p[1] = parseInt(p[1]);
        }else if(/^\d+\.\d+$/.test(p[1])){
            p[1] = parseFloat(p[1]);
        }
        body[p[0]] = p[1];
    });
    console.log(body);
return `//#DWR-INSER
//#DWR-REPLY
dwr.engine._remoteHandleCallback('${body['batchId']}','${body['c0-id']}',${json.result})` ;
        }
```

这样dwr接口也可以在nei中mock了，对于返回的数据，统一用result包装。

简化联调使用流程，
提供了一个edu-nei-mock插件，主要帮助我们干以下几件事情：
1，更新nei的配置文件，帮助联调环境准备
- 更新modelServer配置
- 更新routes代理接口
- 更新reload值，避免nei一直监听文件改动

2，处理dwr接口，能使用nei的mock数据处理dwr接口



# 后续要解决的问题：  
1，复杂dwr接口的解析工作  