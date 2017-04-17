此项目为[GHOST博客](https://ghost.org/)手机客户端开发尝试，使用的是[Ionic](http://ionicframework.com/)+[Cordova](http://ionicframework.com/)混合开发。

# 关于项目
本来是打算使用AppCan开发的，但偶然间看到Ionic(famo.us感觉太复杂了...)，觉得还不错，便开始了填坑之旅。  
由于ionic使用的是Angularjs开发的，而自己这方面不是很擅长，会有不少做的不完善的地方，欢迎大家指正，欢迎各种PullRequest。  

# 关于GHOST博客
GHOST博客是轻量级的博客，使用`nodejs`开发，可以一键部署或者自己在服务器上部署。  
GHOST提供基于Oauth2的认证体系，关于开发时的API请参考我的博客[Ghost开发之API](http://www.net2blog.com/ghost-api/)，其中很多接口未作详细使用说明  
目前0.1.0版本只完成了部分功能，包括获取文章列表，获取标签列表和用户列表，展示文章详情，其余的待后续完善  

# 测试账号
之前做的时候都是用的自己的博客做的测试，但是其他人使用的时候并没有GHOST博客，因此这里给出一个测试用的博客以及账号密码。

博客地址(site): http://os.net2blog.com  
用户名(username): test@test.com  
密码(password): test1234  

# 应用截图
[http://ghost-client.github.io/ghost-ionic/](http://ghost-client.github.io/ghost-ionic/)

# 使用步骤
1.如未安装nodejs，请先安装[nodejs](https://nodejs.org/)  
2.如果未安装ionic和cordova请先安装  
```shell
npm install -g ionic cordova
```
如果是mac，可以再安装模拟器  
```shell
npm install -g ios-sim
```
3.进入项目根目录，执行命令  
```shell
npm install
```
4.添加平台，4 5两步中请根据实际情况更改，安卓版本为`android`，IOS版本为`ios`，另外windows系统上不能添加ios平台  
```shell
ionic platform add ios
```
5.构建  
```shell
ionic build ios
```
6.补充
如果想调试安卓平台，可以将手机(Android4.1以上)的开发者选项打开，用USB连接上手机，运行  
```shell
adb devices
```
请确保已经安装`adb`，运行后可以查看到手机ID，复制此ID，运行  
```shell
ionic run android --target=YOUR_ID
```
7.调试
建议使用GapDebug进行调试，谁用谁知道，安装后第一次运行需要翻墙  
地址[https://www.genuitec.com/products/gapdebug/](https://www.genuitec.com/products/gapdebug/)  
更多介绍和使用方式请参考[http://ionicframework.com/docs/guide/](http://ionicframework.com/docs/guide/)

# 已知问题
1.从文章列表切换至文章详情后，感觉详情界面有点卡，再返回的时候感觉更卡  
2.Loading的时候返回键无法取消掉，这个不知道算不算BUG  
