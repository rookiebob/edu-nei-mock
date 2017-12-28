const fs = require('fs');

//处理本地mock的dwr数据
const updateDwrData = (dwrInterfacePath) => {

    const cb = "\`//#DWR-INSER\n//#DWR-REPLY\ndwr.engine._remoteHandleCallback('\${body['batchId']}','\${body['c0-id']}',${json.result})\`";

    fs.writeFileSync(dwrInterfacePath,`module.exports = function (json, req) {
            "use strict";
            req.res.contentType('text/javascript;charset=UTF-8');
            let body = {};
            req.body.split('\\n').forEach(function(paramPair){
                let p = paramPair.split('=');
                if((/^\\d+$/).test(p[1])){
                    p[1] = parseInt(p[1]);
                }else if(/^\\d+\\.\\d+$/.test(p[1])){
                    p[1] = parseFloat(p[1]);
                }
                body[p[0]] = p[1];
            });
            console.log(body);
        return ${cb} ;
        }`)
}


module.exports = updateDwrData;