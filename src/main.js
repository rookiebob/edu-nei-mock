const fs = require('fs');
const glob = require('glob');
const path = require('path');
const updateDwrData = require('./updateDwrData');
const updateNeiConfig = require('./updateNeiConfig');

module.exports = function () {
    const pattern = './mock/*/server.config.js';
    const dwrPattern = './mock/**/*.dwr/data.js';
    let NeiConfigPath , NeiConfig;

    function main(){
        const prog = require('commander');
        prog.version('0.0.1')
            .usage('npm run edu-nei-mock')
            .option('-p, --mockpath <mockpath>', '需要代理的路径,比如http://study.163.com/')
            .option('-m, --mode <mode>', '需要启动时，模拟的ua调试信息')
            .parse(process.argv);

        const MOCKPATH = prog.mockpath;
        const UA_MODE = prog.mode;

        console.log(`需要代理的路径是 ${MOCKPATH}`);
        console.log(`需要mock的模式是 ${UA_MODE}`);

        //更新nei的配置文件
        glob(pattern, {nodir: true}, (err, files) => {
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
                //console.log("server.config.js文件的绝对路径是：" + path.resolve('./' , NeiConfigPath));
                //更新nei的配置文件
                updateNeiConfig(NeiConfig , NeiConfigPath , MOCKPATH , UA_MODE);
            }

        });

        //处理本地mock的dwr数据
        if(MOCKPATH){
            glob(dwrPattern, {nodir: true}, (err, files) => {
                if(err){
                    console.log(err);
                }else{
                    if(!files || files.length < 1){
                        console.log("暂无dwr接口需要替换！");
                        return;
                    }
                    files.forEach((_path) => {
                        const dwrPath = path.resolve('./' , _path);
                        console.log("覆盖的dwr路径：%s" , dwrPath);
                        updateDwrData(dwrPath);
                    });
                    console.log('配置已经更新完成，愉快的联调吧！');

                }

            });
        }

    }

    main();
}

