const fs = require('fs');
const uaList = require('./ua.json');


//更新nei的配置文件
const updateNeiConfig = (NeiConfig ,NeiConfigPath , MOCKPATH = 'http://study.163.com/' ,  UA_MODE = 'pc') => {

    const routes = {
        "ALL /j/*" : MOCKPATH,
        "ALL /p/*": MOCKPATH,
        "*.dwr": MOCKPATH
    }

    //代理全局请求
    delete(NeiConfig.routes[routes[0]]);
    delete(NeiConfig.routes[routes[1]]);
    delete(NeiConfig.routes[routes[2]]);
    NeiConfig.routes =  Object.assign(routes , NeiConfig.routes);

    //console.log(NeiConfig.routes);

    //不监听文件变化强制刷新
    NeiConfig.reload =  false;
    NeiConfig.modelServer = {
        host: MOCKPATH,
        queries: {edu_format:'json'},
        headers: {
            "User-Agent": uaList[UA_MODE]
        }
    };

    console.log('***********nei配置信息如下**************');
    Object.keys(NeiConfig).forEach((key) =>{
        console.log(key + '的值为：' + NeiConfig[key]);
    })
    console.log('***********nei配置信息End**************');

    //console.log(`var path = require('path'); \n module.exports = ${JSON.stringify(NeiConfig,null,4)}`);
    fs.writeFileSync(NeiConfigPath, `var path = require('path'); \n module.exports = ${JSON.stringify(NeiConfig,null,4)}`);
}


module.exports = updateNeiConfig;