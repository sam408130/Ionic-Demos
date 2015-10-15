/**
 * Created by heqichang on 14/11/27.
 */

angular.module('starter.services', [])

//类别
.factory('categoryService', function() {

    var defatulColors = randomColor({luminosity: 'light', count : 2});

    var defaultCategories = [
      { id: 1, title: '纪念日', totalNumber: 1, color: defatulColors[0] },
      { id: 2, title: '生日', totalNumber: 1, color: defatulColors[1] }
    ];

    var getCategories = function() {
      var categoriesString = window.localStorage['categories'];
      if (categoriesString) {
        var categories = angular.fromJson(categoriesString);

        return categories;
      } else {
        // 存储默认类别
        saveCategories(defaultCategories);
      }

      return defaultCategories;
    };

    var getColorDict = function() {
      var categories = getCategories();
      var colorDict = {};
      for(var i = 0, length = categories.length; i < length; i++) {
        var categoryId = categories[i].id;
        var color = categories[i].color;
        colorDict[categoryId] = color;
      }

      return colorDict;
    };

    //保存类别
    var saveCategories = function (categories) {
      window.localStorage['categories'] = angular.toJson(categories);
    };


    return {
      getCategories: getCategories,
      saveCategories: saveCategories,
      getColorDict: getColorDict,

      //获取最后插入的事件Id（模拟自增）
      getMaxId: function () {
        return parseInt(window.localStorage['maxCategoryId']) || 2;
      },

      //存储最后插入的事件Id（模拟自增）
      setMaxId: function (index) {
        window.localStorage['maxCategoryId'] = index;
      },

      newCategory: function() {
        var color = randomColor();

        return {
          id : 0,
          title : '',
          totalNumber : 0,
          color : color
        }
      }
    };

})

// 日期纪录
.factory('dateRecordService', function() {
  var defaultRecords = [
    { id : 1, categoryId : 2, title : '我的生日', date : '2014-12-01', top : false, alarm : false, alarmTime : '00:00', repeat : 0},
    { id : 2, categoryId : 1, title : 'App发布日期', date : '2014-11-01', top : false, alarm : false, alarmTime : '00:00', repeat : 0}
  ];

  var getDateRecords = function() {
    var dateRecordsString = window.localStorage['dateRecords'];
    if (dateRecordsString) {
      var dateRecords = angular.fromJson(dateRecordsString);
      return dateRecords;
    } else {
      // 存储默认纪录日期
      saveDateRecords(defaultRecords)
    }

    return defaultRecords;
  };

  var saveDateRecords = function(dateRecords) {
    window.localStorage['dateRecords'] = angular.toJson(dateRecords);
  };

  return {
    getDateRecords : getDateRecords,
    saveDateRecords : saveDateRecords,

    //获取最后插入的事件Id（模拟自增）
    getMaxId: function () {
      return parseInt(window.localStorage['maxDateRecordId']) || 2;
    },

    //存储最后插入的事件Id（模拟自增）
    setMaxId: function (index) {
      window.localStorage['maxDateRecordId'] = index;
    },

    newRecord: function () {
      return {
        id : 0,
        categoryId : 0,
        title : '',
        date : moment().format('YYYY-MM-DD'),
        top : false,
        alarm : false,
        alarmTime : '00:00', // ios中 time input中的格式
        repeat : 0  // 0 - null , 1 - 'daily', 2 - 'weekly',  3 - 'monthly', 4 - 'yearly'
      };
    }
  }
})

.factory('loginService', function() {
    return {
      getPassword: function() {
        return window.localStorage['login'] ? window.localStorage['login'] : '';
      },
      setPassword: function(password) {
        window.localStorage['login'] = password;
      }
    }
  });