var http = require('http');
var fs = require('fs');
var glob = require('glob');
var path = require('path');

module.exports = function () {
    var pattern = './mock/*/server.config.js';
    var NeiConfigPath , NeiConfig , routes , MOCKPATH;

    function main(){
        var prog = require('commander');
        prog.version('0.0.1')
            .usage('npm run edu-neo-mock')
            .option('-p, --mockpath <mockpath>', '需要代理的路径,比如http://study.163.com/')
            .parse(process.argv);

        // check arguments
        if (!prog.mockpath){
            prog.help();
            return;
        }

        MOCKPATH = prog.mockpath;
        console.log("需要代理的路径是 %s" , MOCKPATH);

        glob(pattern, {nodir: true}, function (err, files) {
            if(err){
                console.log(err);
            }else{
                console.log("server.config.js文件的路径是：" + files[0]);
                NeiConfigPath = files[0];
                NeiConfig = require(path.resolve('./' , NeiConfigPath));
                console.log("server.config.js文件的绝对路径是：" + path.resolve('./' , NeiConfigPath));
                updateNeiConfig(NeiConfig);
            }

        });
    }




    function updateNeiConfig(NeiConfig){
        for(var key in NeiConfig){
            if (NeiConfig.hasOwnProperty(key)) {
                console.log(key + '的值为：' + NeiConfig[key]);
            }
        }
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

        console.log(NeiConfig.routes);

        //不监听文件变化强制刷新
        NeiConfig.reload =  false;
        NeiConfig.modelServer = {
            host: MOCKPATH,
            queries: {edu_format:'json'},
            headers: {}
        };

        //console.log(`var path = require('path'); \n module.exports = ${JSON.stringify(NeiConfig,null,4)}`);
        fs.writeFileSync(NeiConfigPath, `var path = require('path'); \n module.exports = ${JSON.stringify(NeiConfig,null,4)}`);
    }


    main();
}

