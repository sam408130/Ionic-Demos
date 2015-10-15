angular.module('starter.services', [])
  .factory('GhostDB', ['$q', '$cordovaSQLite', 'DB_NAME', 'AES_ENCRYPT_KEY', function($q, $cordovaSQLite, DB_NAME, AES_ENCRYPT_KEY) {
    var db = null;
    function encrypt(pwd) {
      return CryptoJS.AES.encrypt(pwd, AES_ENCRYPT_KEY);
    }

    function decrypt(pwd) {
      return CryptoJS.AES.decrypt(pwd, AES_ENCRYPT_KEY).toString(CryptoJS.enc.Utf8);
    }

    var exports = {
      setup: function() {
        var defer = $q.defer();
        db = $cordovaSQLite.openDB(DB_NAME, 1);
        $cordovaSQLite.execute(db, 'select count(*) as count from sqlite_master where type="table" and name="blog"').then(function(res) {
          defer.resolve(res.rows.item(0)['count'] !== 0);
        }).catch(defer.reject);
        return defer.promise;
      },
      init: function() {
        var defer = $q.defer();
        db = $cordovaSQLite.openDB(DB_NAME, 1);
        $cordovaSQLite.execute(db, 'create table blog(site varchar(50), username varchar(50), password varchar(50))').then(function() {
          $cordovaSQLite.execute(db, 'insert into blog values("", "", "")').then(defer.resolve, defer.reject);
        });
        return defer.promise;
      },
      updateSite: function(site) {
        db = $cordovaSQLite.openDB(DB_NAME, 1);
        $cordovaSQLite.execute(db, 'update blog set site = "' + site + '"').catch(function(error) {
          alert('DB保存失败');
          alert(JSON.stringify(error));
        });
      },
      updateLoginInfo: function(username, password) {
        db = $cordovaSQLite.openDB(DB_NAME, 1);
        $cordovaSQLite.execute(db, 'update blog set username = "' + username + '", password = "' + encrypt(password) + '"').catch(function(error) {
          alert('DB保存失败');
          alert(JSON.stringify(error));
        });
      },
      getSaved: function() {
        var defer = $q.defer();
        db = $cordovaSQLite.openDB(DB_NAME, 1);
        $cordovaSQLite.execute(db, 'select site, username, password from blog').then(function(data) {
          var data = data.rows.item(0);
          defer.resolve({
            blog: {site: data.site},
            user: {username: data.username, password: decrypt(data.password)}
          });
        }).catch(function(error) {
          alert('获取保存的数据失败！');
          alert(JSON.stringify(error));
          defer.reject();
        });
        return defer.promise;
      },
      removeUserInfo: function() {
        var defer = $q.defer();
        db = $cordovaSQLite.openDB(DB_NAME, 1);
        $cordovaSQLite.execute(db, 'update blog set username="", password=""').then(defer.resolve, defer.reject);
        return defer.promise;
      },
      removeDB: function() {
        $cordovaSQLite.deleteDB(DB_NAME).then(function(){alert('数据库已删除！')})
      }
    };
    return exports;
  }])

  .factory('GhostOauth', ['$q', '$http', '$rootScope', function($q, $http, $rootScope) {
    function apiCommon(url, method, data) {
      var baseUrl = $rootScope.blog.site + '/ghost/api/v0.1';
      var defer = $q.defer();
      var option = {
        method: method ? method: 'get',
        url: baseUrl + url,
        headers: {}
      };
      if (data && method === 'post') {
        option['data'] = data;
      }
      $http(option)
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(err){
          defer.reject(err);
        });
      return defer.promise;
    }

    var exports = {
      checkSite: function(site) {
        var defer = $q.defer();
        $http({method: 'get', url: site + '/favicon.ico'})
          .success(defer.resolve)
          .error(function() {
            defer.reject('连接不到你的博客哎~请先检查网络，然后查看你输入的地址是否正确并确保你的博客能够访问');
          });
        return defer.promise;
      },
      loginWidthStored: function() {
        var defer = $q.defer();
        if ($rootScope.user.username && $rootScope.user.password) {
          this.login($rootScope.user.username, $rootScope.user.password).then(defer.resolve, defer.reject);
        } else {
          defer.reject();
        }
        return defer.promise;
      },
      login: function(username, password) {
        var defer = $q.defer();
        $http({method: 'post', url: $rootScope.blog.site + '/ghost/api/v0.1/authentication/token',
            data: 'grant_type=password&username=' + username + '&password=' + password + '&client_id=ghost-admin'
          })
        .success(defer.resolve).error(defer.reject);
        return defer.promise;
      },
      getSetting: function() {
        return apiCommon('/settings');
      },
      getPosts: function(tag, user) {
        return apiCommon('/posts?include=tags,author');
      },
      getPost: function(id) {
        return apiCommon('/posts/' + id + '?include=tags,author');
      },
      getTags: function() {
        return apiCommon('/tags');
      },
      getUsers: function() {
        return apiCommon('/users');
      }
    };
    return exports;
  }]);