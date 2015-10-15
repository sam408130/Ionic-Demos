# Ionic-Demos

###Ionic 

[Ionic](http://ionicframework.com/) 的介绍请看官网, 还有[Ionichina](http://ionichina.com/)（一个Ionic中文论坛）

###个人情况
回想七月份一个月，那真是忙成狗，一个月的时间做出了一个app：[门客](http://itunes.apple.com/app/id1032920599?mt=8)（2.0版本已经提交审核啦！），8月份开始研究Hybrid开发，两个月的时间用IonicFramework做了两个应用，详情请关注微信：天天有活，里面有商家端和用工端，产品还比较丑陋，还会继续维护更新。

###Ionic Demos
上面近30个ionic demo是我在这两个月的学习中接触到得，其中Ionic-cnodejs , ioniclub , front-page需要重点看，入门极好的demo

###总结内容
本身对html , css ， js都不熟，以下是学习过程中总结的一些内容，如果你觉得太low, 请勿喷


网站部署
-----

链接到服务器
```ssh dingsai@***.***.**.***```


网站根目录在```/src/www/jobWeb/```


如果有更新：

1. 将文件复制到服务器上：
    
    ```scp -r jobWeb/ dingsai@***.***.**.***:```
2. 登录服务器，以下命令在服务器上执行

    ```sudo chown www-data -R ~/jobWeb```

    ```sudo mv /srv/www/jobWeb/ /srv/www/jobWeb.bak```

    ```sudo mv ~/jobWeb/ /srv/www/```
    
最后确认没问题的话，/srv/www/jobWeb.bak就可以删掉了


注意，他们似乎没有做首页，所以我配置了访问 / 会自动跳转到 ```/listBox/list_1.html```，因此必须存在这个文件。如果不存在这个文件，需要其他文件做首页的话，修改 ```/etc/nginx/conf.d/default.conf``` ，依葫芦画瓢。改好配置文件，运行 ```sudo nginx -t``` 检查一下配置文件语法，没问题的话 ```sudo service nginx reload``` 重启一下nginx就好了


```/srv/www``` 是 root 的，你没有权限直接往里面拷贝


```scp -r jobWeb/ dingsai@***.***.**.***:```
这条命令拷上去之后，jobWeb 目录的属主是你，需要改成 ```www-data```，以避免nginx读不了

chown 是 change owner 的意思

-R 是 recursive ，对目录以及里面的内容全部修改


grunt 
------
安装依赖可以使用配置文件package.json

```
{
  "name": "PlanxSite",
  "version": "0.0.1",
  "description": "Site for Planx",
  "scripts": {
    "start": "node node_modules/http-server/bin/http-server -p 8000 -c-1"
  },
  "license": "UNLICENSED",
  "private": true,
  "dependencies": {},
  "devDependencies": {
    "grunt": "^0.4.5",
    "grunt-bower-install-simple": "^0.9.3",
    "grunt-bump": "0.0.15",
    "grunt-changelog": "^0.2.2",
    "grunt-contrib-clean": "^0.6.0",
    "grunt-contrib-concat": "^0.5.0",
    "grunt-contrib-copy": "^0.5.0",
    "grunt-contrib-cssmin": "^0.14.0",
    "grunt-contrib-htmlmin": "^0.3.0",
    "grunt-contrib-less": "^1.0.1",
    "grunt-contrib-sass": "^0.9.1",
    "grunt-contrib-uglify": "^0.5.1",
    "grunt-contrib-watch": "^0.6.1",
    "grunt-newer": "^1.1.1",
    "grunt-recess": "^1.0.0",
    "grunt-swig": "^0.2.1",
    "gruntfile-gtx": "^0.3.0",
    "http-server": "^0.6.1",
    "require-directory": "^2.0.0"
  }
}

使用 npm install 安装

```


leancloud javascript sdk
-----
```
<script src="https://leancloud.cn/scripts/lib/av-0.5.0.min.js"></script>
```
在run中添加id，key
```
angular.module('Oddjobs',['ionic', 'ngCordova','ngResource','angularMoment', 'Oddjobs.services','Oddjobs.controllers','ionic-datepicker'])

.run(function($ionicPlatform, $rootScope, $state, $ionicLoading, $log,
	My, User){

  AV.initialize('******','*******')
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });
```

发送短信验证码(需要先打开leancloud应用设置里的验证注册用户手机号码，和启用账号无关短信验证服务)
```
  $scope.sendCode = function(){

      AV.Cloud.requestSmsCode($scope.signupParams.username).then(function(){
          $ionicLoading.show({
            template:'验证码已发送!'
          })
      }, function(err){
        //发送失败
      });
      $timeout(function(){
        $ionicLoading.hide()
      },1000);


  }
  
```

验证码验证登录
```
      user.signUpOrlogInWithMobilePhone({
        mobilePhoneNumber:$scope.signupParams.username,
        smsCode:$scope.signupParams.verify_code,
        username:$scope.signupParams.username,
        password:$scope.signupParams.password,
        realname:$scope.signupParams.realname,
        usertype:'worker'
      },{
        success:function(user){
          $scope.LoginState = true
        },
        error:function(err){
          console.dir(err)
        }
      });
```

alert,类似于HUD
```
      $ionicLoading.show({
          template:"成功退出"
      })
      $timeout(function () {
          $ionicLoading.hide();
      }, 1000)
```


angularjs calendar 
------

安装
```
bower install flex-calendar --save
cd ../flex-calendar/..
bower install

```

Add to index.html

```
<link rel="stylesheet" href="bower_components/flex-calendar.css">
<script type="text/javascript" src="bower_components/angular-translate/angular-translate.min.js.js"></script>
<script type="text/javascript" src="bower_components/flex-calendar.js"></script>

```

Inject ```flex-calendar``` and ```pascalprecht.translate``` into your main module:

```angular.module('App', ['flexcalendar' , 'pascalprecht.translate'])```

Add <flex-calendar options="options" events="events"></flex-calendar> directive to your html file.

```<flex-calendar options="options" events="events"></flex-calendar>```

Flex Calendar takes a few options:
```
app.controller('myController', ['$scope', function($scope) {
  "use strict";
  // With "use strict", Dates can be passed ONLY as strings (ISO format: YYYY-MM-DD)
  $scope.options = {
    defaultDate: "2015-08-06",
    minDate: "2015-01-01",
    maxDate: "2015-12-31",
    disabledDates: [
        "2015-06-22",
        "2015-07-27",
        "2015-08-13",
        "2015-08-15"
    ],
    dayNamesLength: 1, // 1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names. Default is 1.
    mondayIsFirstDay: true,//set monday as first day of week. Default is false
    eventClick: function(date) {
      console.log(date);
    },
    dateClick: function(date) {
      console.log(date);
    },
    changeMonth: function(month, year) {
      console.log(month, year);
    },
  };

  $scope.events = [
    {foo: 'bar', date: "2015-08-18"},
    {foo: 'bar', date: "2015-08-20"}
  ];
}]);

```


linux 安装npm环境
----

```
    sudo apt-get update
    sudo apt-get install node.js
    sudo apt-get install npm
    
    将安装好的node.js加入环境
    sudo ln -s /usr/bin/nodejs /usr/bin/node
    
    进入ionic app文件夹
    npm install -g cordova  ionic
    npm install
    
```
gulp
---

gulp 用于js,css代码的打包，ugly，等安全性措施

```
    sudo npm insatll -g gulp
```   

install locally:

```
    sudo npm install --save-dev gulp

```


安装依赖

```
npm install gulp-jshint gulp-sass gulp-concat gulp-uglify gulp-rename gulp-watch gulp-minify-css gulp-notify gulp-filter gulp-clean  --save-dev 

```

编辑gulpfile.js

```
// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'scripts']);
    gulp.watch('scss/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['lint', 'sass', 'scripts', 'watch']);

```


Now, let’s break this down and review what each part does.

Core & Plugins

```
// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
```
This includes the gulp core and plugins associated with the tasks that we will be performing. Next, we setup each of our separate tasks. These tasks are lint, sass, scripts and default.

Lint Task
// Lint Task
```
gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
```
Our lint task checks any JavaScript file in our js/ directory and makes sure there are no errors in our code.

Sass Task
```
// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('css'));
});
```
The sass task compiles any of our Sass files in our scss/ directory into .css and saves the compiled .css file in our css/ directory.

Scripts Task
```
// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});
```
The scripts task concatenates all JavaScript files in our js/ directory and saves the ouput to our dist/ directory. Then gulp takes that concatenated file, minifies it, renames it and saves it to the dist/ directory alongside the concatenated file.

Watch Task
```
// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'scripts']);
    gulp.watch('scss/*.scss', ['sass']);
});
```
The watch task is used to run tasks as we make changes to our files. As you write code and modify your files, the gulp.watch() method will listen for changes and automatically run our tasks again so we don't have to continuously jump back to our command-line and run the gulp command each time.

Default Task
```
// Default Task
gulp.task('default', ['lint', 'sass', 'scripts', 'watch']);
```
Finally, we have our default task which is basically a wrapper to our other tasks. This will be the task that is ran upon entering gulp into the command line without any additional parameters.

Now, all we have left to do is run gulp. Switch back over to your command-line and type:
```
gulp
```
This will call gulp and run everything we have defined in our default task. So, in other words It’s the same thing as running:
```
gulp default
```
Additionally, we don’t have to run the default task. We could run any of the tasks we defined at any time. Simply call gulp and then specify the task you would like to run directly afterward. For example, we can run our sass task manually at any time like so:
```
gulp sass
```



Ionic as a web server
----
You gonna need send all your project files (www folder) and dependencies to an web server.

You can try.

Local
```
    $ cd [ionic project]
    $ ionic platform add browser
    $ cd [ionic project]/platforms/browser/
```
and move your www folder to your server [webapp] folder.

Server

In your server:

1.Install Node.js

Install connect and serve-static
```
$ cd [webapp] $ npm install connect serve-static
```
Create server.js file
```
var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(8080)
```
Run serve
```
$ node server.js &
```
Browser

Now you can go to http://yourdomain:8080/index.html



Ionic Alert
---
AngularJs中得Alert:
    
    ```
    var confirmPopup = $ionicPopup.confirm({
        title: '已招聘'+numPassing+'/'+num_required+',未招满',
        template: '停止招聘将无法重新开启，确定要关闭吗？'
    });
    confirmPopup.then(function(res) {
        if(res) {
            object.set('status','stopped');
            object.save().then(function(){
                    HUD('停止招聘！');
            })
        }else{
        
        }
    });
    
    
    其中
    
    var HUD = function(template){

        $ionicLoading.show({
            template:template
        });

        $timeout(function(){
            $ionicLoading.hide();
        },1500);
    };
    
    
    ```


nginx 的安装和配置
---

Install with brew

Use brew to install the nginx with command:

``` $ brew install nginx ```

After install run:

```$ sudo nginx```

The default place of nginx.conf on Mac after installing with brew is:

``` /usr/local/etc/nginx/nginx.conf ```

Changing the default port

The nginx default port is 8080, we shall change it to 80. First stop the nginx server if it is running by:

```$ sudo nginx -s stop```

Then open nginx.conf with:

```$ vim /usr/local/etc/nginx/nginx.conf```


创建conf配置文件，指向索要托管的文件夹：

```

server {
    listen 8100 ;
    server_name employer.51duangong;

    root /srv/www/employer;

    index index.html;
    autoindex on;

    try_files $uri $uri/ @proxy;

    location @proxy {
	proxy_pass http://****;
    }

}


server {
    listen 8101 ;
    server_name employee.51duangong;

    root /srv/www/employee;

    index index.html;
    autoindex on;
    location @proxy {
	proxy_pass http://****;
    }

}

```
重启nginx

``` sudo service nginx reload ```
