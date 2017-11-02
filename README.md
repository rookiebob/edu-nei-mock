# edu-nei-mock
再教育产品处理前后端分离的过程中，使用了nei的解决方案，结合教育老工程的一些特点，
本插件主要用于更新nei的配置文件，帮助联调环境准备，解决了如下问题：

- 更新modelServer配置
- 更新routes代理接口
- 更新reload值，避免nei一直监听文件改动
- 更新dwr接口回调数据转换，处理dwr接口，能使用nei的mock数据处理dwr接口



# 联调准备 
1,安装nei  
目前稳定的nei版本是3.6.0，请确保版本号高于这个版本

```
npm install nei -g
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
edu-nei-mock -p 'http://cp.study.163.com/'
```
-p  <mockpath>:需要代理的工程线上域名 

工程名| 域名
---|---
云课堂主站web端 | http://study.163.com/
云课堂主站wap端 | http://m.study.163.com/
云课堂-yooc平台 | http://mooc.study.163.com/
cp主站 | http://cp.study.163.com/
admin管理后台 | http://admin.study.163.com/

#### 5，根据nei启动端口访问：
http://cplocal.study.163.com:8002/{id}  
比如，我可以访问
http://cplocal.study.163.com:8002/1014290573

这个时候就可以愉快的联调了。


- 如果联调阶段，希望访问的是某位后端同学数据，，那么绑定这位后端同学机器的host即可
- 如果我们想本地看一下线上的问题，同理，把对应的host去掉就行



# 已解决的问题： 
1，更新nei的配置文件，帮助联调环境准备
- 更新modelServer配置
- 更新routes代理接口
- 更新reload值，避免nei一直监听文件改动
- 更新dwr接口回调数据转换

2，处理dwr接口，能使用nei的mock数据处理dwr接口

