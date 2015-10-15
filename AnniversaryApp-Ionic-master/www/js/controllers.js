angular.module('starter.controllers', [])

.controller('AppCtrl', function($rootScope, $scope, $state, $ionicModal, $timeout, $ionicPopup, categoryService, dateRecordService, loginService) {

  // 所有类别信息
  $scope.categories = categoryService.getCategories();

  // 所有类别的颜色信息
  $scope.categoryColorDict = categoryService.getColorDict();

  // 所有纪录信息
  $scope.dateRecords = dateRecordService.getDateRecords();

  $scope.categorySetting = {
    newCategoryEditing : false,   // 是否处于新添加状态
    selectedCategoryTitle : '全部' // 选中的类别名称
  };

    // 登录信息
    $scope.pattern = {
      password: loginService.getPassword(),
      message : '',
      again : false,
      allowUpdate : false
    };

    var inputEle = angular.element('#new-category-input');

    inputEle.bind('keydown', function(e){
      if(e.which == 13) {
        inputEle.blur();
      }
    });

  $scope.addCategoryClick = function() {
    $scope.categorySetting.newCategoryEditing = true;

    $timeout(function() {
      inputEle.focus();
    }, 200);
  };

  $scope.categoryClick = function(title) {
    $scope.categorySetting.selectedCategoryTitle = title;
  };

  $scope.newCategoryInputOnBlur = function(newCategoryTitle) {
    //console.log('blur : ' + newCategoryTitle);
    if(newCategoryTitle != '') {
      var newCategory = categoryService.newCategory();
      newCategory.id = categoryService.getMaxId() + 1;
      newCategory.title = newCategoryTitle;

      $scope.categories.push(newCategory);
      categoryService.saveCategories($scope.categories);

      // 增加 maxid
      categoryService.setMaxId(newCategory.id);
      // 在颜色词典中增加新增类的颜色
      $scope.categoryColorDict[newCategory.id] = newCategory.color;
    }

    $scope.categorySetting.newCategoryEditing = false;

  };

  $scope.deleteCategoryClick = function(category) {
    // An elaborate, custom popup
    var i = 0, length = 0;
    var myPopup = $ionicPopup.show({
      template: '<ion-checkbox ng-model="categorySetting.deleteCategorySubItem">删除所有的纪录</ion-checkbox>',
      title: '确认是否删除该类别',
      scope: $scope,
      buttons: [
        { text: '取消' },
        {
          text: '<b>确认</b>',
          type: 'button-positive',
          onTap: function(e) {

            var deletedId = category.id;

            length = $scope.dateRecords.length;

            // 删除该分类下所有的纪录项
            if($scope.categorySetting.deleteCategorySubItem) {
              // 删除下面所有的子项
              for(i = length - 1; i >= 0; i--) {
                if(deletedId === $scope.dateRecords[i].categoryId) {
                  deleteNotification($scope.dateRecords[i].id);
                  $scope.dateRecords.splice(i, 1);
                }
              }
            } else {
              // 更新该分类下所有的纪录项为 未分类
              for(i = 0; i < length; i++) {
                if(deletedId === $scope.dateRecords[i].categoryId) {
                  $scope.dateRecords[i].categoryId = 0;
                }
              }
            }

            dateRecordService.saveDateRecords($scope.dateRecords);

            // 删除该分类
            length = $scope.categories.length;
            for(i = 0; i < length; i++) {
              if(deletedId === $scope.categories[i].id) {
                $scope.categories.splice(i, 1);
                break;
              }
            }

            categoryService.saveCategories($scope.categories);
          }
        }
      ]
    });
  };

  function deleteNotification(id) {
    // 取消该项的通知
    window.plugin.notification.local.isScheduled(id, function (isScheduled) {
      if(isScheduled) {
        window.plugin.notification.local.cancel(id);
      }
    });
  }

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/setting.html', {
    scope: $scope
  }).then(function(modal) {
    $rootScope.modals.settingModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/about.html', {
    scope: $scope,
    animation: 'slide-in-right'
  }).then(function(modal) {
    $rootScope.modals.aboutModal = modal;
  });

    $ionicModal.fromTemplateUrl('templates/passwordenable.html', {
      scope: $scope,
      animation: 'slide-in-right'
    }).then(function(modal) {
      $rootScope.modals.passwordEnableModal = modal;
    });

    // 密码设置窗口
    $ionicModal.fromTemplateUrl('templates/setpassword.html', {
      scope: $scope,
      animation: 'slide-in-bottom'
    }).then(function(modal) {
      $rootScope.modals.setPasswordModal = modal;
    });


  $scope.settingClick = function() {
    $rootScope.modals.settingModal.show();
  };

  $scope.aboutClick = function() {
    $rootScope.modals.aboutModal.show();
  };

  $scope.passwordEnableClick = function() {
    $rootScope.modals.passwordEnableModal.show();
  };

  $scope.closeAbout = function() {
    $rootScope.modals.aboutModal.hide();
  };

  $scope.closeSetting = function() {
    $rootScope.modals.settingModal.hide();
  };

  $scope.closePasswordEnable = function() {
    $rootScope.modals.passwordEnableModal.hide();
  };

    // level 0 新设
    // level 1 更改
    // level 2 删除
    var lock, g_level = 0;
  $scope.openSetPassword = function(level) {
    g_level = level;
    $rootScope.modals.setPasswordModal.show().then(function() {
      switch (level) {
        case 0:
          $scope.pattern.message = '请输入新密码';
          break;
        case 1:
        case 2:
          $scope.pattern.message = '请输入现有密码';
          break;
      }

      if(!lock) {
        lock = new PatternLock("#pattern-lock" , {
          onDraw : function(pattern) {

            switch(g_level) {
              case 0:
                setNewPassword(pattern);
                break;
              case 1:
                if(!$scope.pattern.allowUpdate) {
                  $scope.pattern.allowUpdate =  repeatPassword(pattern);
                  if($scope.pattern.allowUpdate) {
                    $scope.pattern.message = '请输入新密码';
                  } else {
                    $scope.pattern.message = '输入错误，请重新输入';
                  }
                } else {
                  setNewPassword(pattern);
                }
                break;
              case 2:
                if(repeatPassword(pattern)) {
                  $scope.pattern.password = '';
                  $scope.pattern.message = '';
                  $rootScope.modals.setPasswordModal.hide();
                  $scope.pattern.again = false;
                  $scope.pattern.allowUpdate = false;
                  loginService.setPassword('');
                }
                break;
            }
            lock.reset();
            $scope.$apply();
          }
        });
      }
    });

  };

    function setNewPassword(password) {
      if(!$scope.pattern.again) {
        $scope.pattern.password = password;
        $scope.pattern.message = '请再输入一次';
        $scope.pattern.again = true;
      } else {
        if(password == $scope.pattern.password) {
          $scope.pattern.message = '';
          $rootScope.modals.setPasswordModal.hide();
          $scope.pattern.again = false;
          $scope.pattern.allowUpdate = false;
          loginService.setPassword(password);
        } else {
          $scope.pattern.message = '输入不正确，请重新输入';
        }
      }
    }

    function repeatPassword(password) {
      return password == $scope.pattern.password;
    }
})


/**
 * 事件列表页
 */
.controller('RecordListCtrl', function($scope, $state, $stateParams) {

  var categoryId = parseInt($stateParams.categoryId);

  $scope.customFilter = function(record) {
    return categoryId < 1 || record.categoryId === categoryId;
  };

  $scope.addNewRecordClick = function() {
    console.log($scope.pattern.password);
    $state.go('app.editrecord', {});
  };

  $scope.formatDate = function(date) {

    var m_date = moment(date);
    return m_date.format('YYYY年MM月DD日');
  };

  $scope.diffDate = function(date) {
    var m_date = moment(date);
    var m_now = moment(moment().format('YYYY-MM-DD'));

    var diffDays = m_now.diff(m_date, 'days');

    return Math.abs(diffDays);

  };

  $scope.diffDateClass = function(date) {
    var m_date = moment(date);
    var m_now = moment();

    var diffDays = m_now.diff(m_date, 'days');

    return diffDays > 0 ? 'energized' : 'positive';
  };

  $scope.diffDateString = function(date) {
    var m_date = moment(date);
    var m_now = moment();

    var diffDays = m_now.diff(m_date, 'days');

    return diffDays > 0 ? '已过天数' : '剩余天数';
  };

})

/**
 * 添加新事件或者编辑事件页面
 */
.controller('EditRecordCtrl', function($scope, $timeout, $stateParams, $ionicNavBarDelegate, $ionicActionSheet, $ionicPopup, categoryService, dateRecordService) {

    var recordId = parseInt($stateParams.recordId);

    $scope.repeatSetting = [
      { id : 0, title : '无重复', name : ''},
      { id : 1, title : '每天重复', name : 'daily'},
      { id : 2, title : '每周重复', name : 'weekly'},
      { id : 3, title : '每月重复', name : 'monthly'},
      { id : 4, title : '每年重复', name : 'yearly'}
    ];


  // 是否 新增事件 或者 编辑事件
  $scope.pageTitle = '编辑事件';
  $scope.isAddingRecord = false;

  // 要编辑的原始纪录
  $scope.originRecord = null;

  // 与该页绑定的临时纪录
  $scope.newRecord = dateRecordService.newRecord();

  if(recordId) {
    var length = $scope.dateRecords.length;
    for(var i = 0; i < length; i++) {
      if(recordId === $scope.dateRecords[i].id) {
        $scope.originRecord = $scope.dateRecords[i];
        break;
      }
    }

    for(var key in $scope.originRecord) {
      $scope.newRecord[key] = $scope.originRecord[key];
    }
  } else {
    $scope.pageTitle = '新增事件';
    $scope.isAddingRecord = true;
  }

  // 判断是否有权限提醒，如果没有则不显示提醒项设置
  window.plugin.notification.local.hasPermission(function (granted) {
    if(!granted) {
      $scope.newRecord.alarm = false;
      $scope.$apply();
    }
  });


  $scope.saveDateRecord = function() {

    if($scope.isAddingRecord) {
      // 新增纪录
      // 如果没有填写title，弹出警告，停留在原页
      if($scope.newRecord.title === '') {
        var alertPopup = $ionicPopup.alert({
          title: '警告',
          template: '请填写名称'
        });
        return;
      }

      // 更新id
      $scope.newRecord.id = dateRecordService.getMaxId() + 1;
      dateRecordService.setMaxId($scope.newRecord.id);

      $scope.dateRecords.push($scope.newRecord);

      // 更新类别总数
      var categoryId = $scope.newRecord.categoryId ? $scope.newRecord.categoryId : 0;
      if(categoryId !== 0) {
        var length = $scope.categories.length;
        for(var i = 0; i < length; i++) {
          if(categoryId === $scope.categories[i].id) {
            $scope.categories[i].totalNumber++;
            categoryService.saveCategories($scope.categories);
            break;
          }
        }
      }

      if($scope.newRecord.alarm) {
        setAlarm($scope.newRecord);
      }

    } else {

      /**
       * 编辑 提醒 的条件
       * 1. 取消提醒
       * 2. 更改日期 时间 名称 重复 之后需要更新提醒
       * 3. 开启提醒
       */
      if($scope.originRecord.alarm) {

        if($scope.newRecord.alarm) {
          // 修改提醒
          var originTitle = $scope.originRecord.title;
          var newTitle = $scope.newRecord.title;
          var originDate = $scope.originRecord.date;
          var newDate = $scope.newRecord.date;
          var originAlarmTime = $scope.originRecord.alarmTime;
          var newAlarmTime = $scope.newRecord.alarmTime;

          var originRepeat = $scope.originRecord.repeat;
          var newRepeat = $scope.newRecord.repeat;

          if(originTitle !== newTitle
            || originDate !== newDate
            || originAlarmTime !== newAlarmTime
            || originRepeat !== newRepeat) {
            setAlarm($scope.newRecord);
          }
        } else {
          // 取消提醒
          window.plugin.notification.local.cancel($scope.originRecord.id);
        }
      } else {
        // 开启提醒
        if($scope.newRecord.alarm) {
          setAlarm($scope.newRecord);
        }
      }

      /**
       * 编辑 类别 变更
       */
      var newCategoryId = $scope.newRecord.categoryId ? $scope.newRecord.categoryId : 0;
      if(newCategoryId !== 0 && $scope.originRecord.categoryId !== newCategoryId) {
        var length = $scope.categories.length;
        for(var i = 0; i < length; i++) {
          if($scope.originRecord.categoryId === $scope.categories[i].id) {
            $scope.categories[i].totalNumber--;
          } else if(newCategoryId === $scope.categories[i].id) {
            $scope.categories[i].totalNumber++;
          }
        }
        categoryService.saveCategories($scope.categories);
      }

      /**
       * 编辑 保存 所有项
       */
      for(var key in $scope.originRecord) {
        $scope.originRecord[key] = $scope.newRecord[key];
      }
    }

    //console.log($scope.newRecord.date);

    // 最后保存至localstore，返回上页
    dateRecordService.saveDateRecords($scope.dateRecords);
    $ionicNavBarDelegate.back();
  };


  $scope.deleteDateRecord = function() {

    $ionicActionSheet.show({
      destructiveText: '删除',
      titleText: '你确定吗?',
      cancelText: '取消',
      cancel: function() {
        // add cancel code..
      },
      destructiveButtonClicked: function() {

        // 取消该项的通知
        window.plugin.notification.local.isScheduled(recordId, function (isScheduled) {
          if(isScheduled) {
            window.plugin.notification.local.cancel(recordId);
          }
        });

        // 更新类别总数
        if($scope.originRecord.categoryId !== 0) {
          var categoryLength = $scope.categories.length;
          for(var i = 0; i < categoryLength; i++) {
            if($scope.originRecord.categoryId === $scope.categories[i].id) {
              $scope.categories[i].totalNumber--;
              categoryService.saveCategories($scope.categories);
              break;
            }
          }
        }

        // 删除该项
        var recordLength = $scope.dateRecords.length;
        for(var i = 0; i < recordLength; i++) {
          if(recordId === $scope.dateRecords[i].id) {
            $scope.dateRecords.splice(i, 1);
            break;
          }
        }

        dateRecordService.saveDateRecords($scope.dateRecords);
        $ionicNavBarDelegate.back();

        return true;
      }
    });
  };

  $scope.checkAlarmClick = function($event) {
    if($scope.newRecord.alarm) {
      $scope.newRecord.alarm = false;
    } else {
      $event.preventDefault();
      window.plugin.notification.local.hasPermission(function (granted) {
        if(granted) {
          $scope.newRecord.alarm = true;
          $scope.$apply();
        } else {
          $scope.newRecord.alarm = false;
          $scope.$apply();

          $ionicPopup.alert({
            title: '无法提醒',
            template: '请在[设置][通知]中允许该App接收通知'
          });
        }
      });
    }
  };

    function setAlarm(record) {
      var title = record.title;
      var date = record.date;
      var time = record.alarmTime;
      var alarmDate = moment(date + ' ' + time).toDate();
      var repeat = parseRepeat(record.repeat);

      var alarmId = window.plugin.notification.local.add({
        id:      record.id,
        title:   '纪念日提醒',
        message: title,
        repeat:  repeat,
        date:    alarmDate
      });
    }

    function parseRepeat(id) {

      var result = '';

      for(var i = 0, length = $scope.repeatSetting.length; i < length; i++) {
        if(id === $scope.repeatSetting[i].id) {
          result = $scope.repeatSetting[i].name;
          break;
        }
      }

      return result;
    }
})

.controller('loginCtrl', function($scope, $state, loginService) {

    $scope.pattern = {
      message : '请输入密码',
      password : loginService.getPassword()
    };

    if($scope.pattern.password == '') {
      $state.go('app.recordlists', {categoryId : 0});
      return;
    }

    var lock = new PatternLock('#pattern-lock', {
      onDraw:function(pattern){
        if(pattern == $scope.pattern.password) {
          $state.go('app.recordlists', {categoryId : 0});
        } else {
          lock.reset();
          $scope.pattern.message = '密码错误，请重新输入';
          $scope.$apply();
        }
      }
    });
  })
;


