var http = require('http');
var fs = require('fs');
var glob = require('glob');
var path = require('path');

module.exports = function () {
    var pattern = './mock/*/server.config.js';
    var dwrPattern = './mock/**/*.dwr/data.js';
    var NeiConfigPath , NeiConfig , routes , MOCKPATH;

    function main(){
        var prog = require('commander');
        prog.version('0.0.1')
            .usage('npm run edu-nei-mock')
            .option('-p, --mockpath <mockpath>', '需要代理的路径,比如http://study.163.com/')
            .parse(process.argv);

        // check arguments
        if (!prog.mockpath){
            prog.help();
            return;
        }

        MOCKPATH = prog.mockpath;
        console.log("需要代理的路径是 %s" , MOCKPATH);

        //更新nei的配置文件
        glob(pattern, {nodir: true}, function (err, files) {
            if(err){
                console.log(err);
            }else{
                if(!files || files.length < 1){
                    console.log("请确保server.config.js文件存在。如有问题请重新build当前nei工程");
                    return;
                }
                //console.log("server.config.js文件的路径是：" + files[0]);
                NeiConfigPath = files[0];
                NeiConfig = require(path.resolve('./' , NeiConfigPath));
                console.log("server.config.js文件的绝对路径是：" + path.resolve('./' , NeiConfigPath));
                updateNeiConfig(NeiConfig);
            }

        });

        //处理本地mock的dwr数据
        glob(dwrPattern, {nodir: true}, function (err, files) {
            if(err){
                console.log(err);
            }else{
                if(!files || files.length < 1){
                    console.log("暂无dwr接口需要替换！");
                    return;
                }
                files.forEach(function(_path){
                    var dwrPath = path.resolve('./' , _path);
                    console.log("覆盖的dwr路径：%s" , dwrPath);
                    updateDwrData(dwrPath)
                });
                console.log('配置已经更新完成，愉快的联调吧！');

            }

        });
    }



    //更新nei的配置文件
    function updateNeiConfig(NeiConfig){

        routes = {
            "ALL /j/*" : MOCKPATH,
            "ALL /p/*": MOCKPATH,
            "*.dwr": MOCKPATH
        }

        if(NeiConfig.routes["ALL /j/*"] || NeiConfig.routes["ALL /p/*"] || NeiConfig.routes["*.dwr"]){
            NeiConfig.routes =  Object.assign(NeiConfig.routes ,routes);
        }else{
            NeiConfig.routes =  Object.assign(routes , NeiConfig.routes);
        }

        //console.log(NeiConfig.routes);

        //不监听文件变化强制刷新
        NeiConfig.reload =  false;
        NeiConfig.modelServer = {
            host: MOCKPATH,
            queries: {edu_format:'json'},
            headers: {}
        };

        console.log('***********nei配置信息如下**************');
        for(var key in NeiConfig){
            if (NeiConfig.hasOwnProperty(key)) {
                console.log(key + '的值为：' + NeiConfig[key]);
            }
        }
        console.log('***********nei配置信息End**************');

        //console.log(`var path = require('path'); \n module.exports = ${JSON.stringify(NeiConfig,null,4)}`);
        fs.writeFileSync(NeiConfigPath, `var path = require('path'); \n module.exports = ${JSON.stringify(NeiConfig,null,4)}`);
    }

    //处理本地mock的dwr数据
    function updateDwrData(dwrInterfacePath){

        var cb = "\`//#DWR-INSER\n//#DWR-REPLY\ndwr.engine._remoteHandleCallback('\${req.body['batchId']}','\${req.body['c0-id']}','\${JSON.stringify(json)}')\`";

        fs.writeFileSync(dwrInterfacePath,`module.exports = function (json, req) {
        req.res.contentType('text/javascript;charset=UTF-8'); 
        return ${cb};`)
    }


    main();
}

