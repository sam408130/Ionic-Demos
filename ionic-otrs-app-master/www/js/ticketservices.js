//Ticket服务实现，业务逻辑
'use strict';

angular.module('otrsapp.ticketservices', ['otrsapp.common']).factory('TicketService', function ($q, $window, CommonService, AuthService) {
  var getByid = function ($http, ticketId, sessionId, ifAll) {
    var deferred = $q.defer();
    var request = $http({
      method: "post",
      url: wsUrl,
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      data: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
        'xmlns:tic="http://www.otrs.org/TicketConnector/"> ' +
        '<soapenv:Header/>' +
        '<soapenv:Body>' +
        '<TicketGet>' +
        '  <tic:SessionID>' + sessionId + '</tic:SessionID>' +
        '  <tic:TicketID>' + ticketId + '</tic:TicketID>' +
        '  <tic:AllArticles>' + ifAll + '</tic:AllArticles>' +
        '</TicketGet>' +
        '</soapenv:Body>' +
        '</soapenv:Envelope>'
    });
    var tickets = null;
    request.success(
      function (html) {
        var xml = null;
        var domParser = new DOMParser();
        xml = domParser.parseFromString(html, 'text/xml').
        childNodes[0].
        childNodes[0].
        childNodes[0].
        childNodes[0];
        var jsonObject = CommonService.xml2json(xml);
        if (typeof jsonObject.ErrorCode != 'undefined') {
          AuthService.logout($window);
          deferred.reject('会话过期，请重新登录');
        } else {
          var status = '';
          if (jsonObject.StateType.Text == 'closed') {
            status = '完成';
          } else if (jsonObject.StateType.Text == 'new') {
            status = '新建';
          } else if (jsonObject.StateType.Text == 'open') {
            status = '处理中'
          } else {
            status = '挂起';
          }
          var Articles = [];
          if (jsonObject.Article instanceof Array) {
            Articles = jsonObject.Article;
          } else {
            Articles.push(jsonObject.Article);
          }
          if (ifAll == 1) {
            tickets = {
              id: jsonObject.TicketID.Text,
              title: jsonObject.Title.Text,
              description: Articles[0].Body.Text.substr(0, 20),
              status: status,
              created: jsonObject.Created.Text,
              queue: jsonObject.Queue.Text.replace('队列', ''),
              articles: Articles
            };
          } else {
            tickets = {
              id: jsonObject.TicketID.Text,
              title: jsonObject.Title.Text,
              description: jsonObject.Title.Text,
              status: status,
              created: jsonObject.Created.Text,
              queue: jsonObject.Queue.Text.replace('队列', ''),
              articles: ''
            };
          };
          deferred.resolve(tickets);
        }
      }
    ).error(function (status) {
      deferred.reject(status);
    });
    return deferred.promise;
  };


  var getAll = function ($http, sessionId, customId) {
    var deferred = $q.defer();
    var request = $http({
      method: "post",
      url: wsUrl,
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      data: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
        'xmlns:tic="http://www.otrs.org/TicketConnector/"> ' +
        '<soapenv:Header/>' +
        '<soapenv:Body>' +
        '<TicketSearch>' +
        '  <tic:SessionID>' + sessionId + '</tic:SessionID>' +
        '  <tic:CustomerUserID>' + customId + '</tic:CustomerUserID>' +
        '</TicketSearch>' +
        '</soapenv:Body>' +
        '</soapenv:Envelope>'
    });
    request.success(
      function (html) {
        var xml = null;
        var domParser = new DOMParser();
        xml = domParser.parseFromString(html, 'text/xml').
        childNodes[0].
        childNodes[0].
        childNodes[0];
        var jsonObject = CommonService.xml2json(xml).TicketID;
        if (typeof jsonObject == 'undefined') {
          AuthService.logout($window);
          deferred.reject('会话过期，请重新登录');
        } else {
          deferred.resolve(jsonObject);
        }
      }
    ).error(function (status) {
      deferred.reject(status);
    });
    return deferred.promise;
  };

  var getOne = function ($http, ticketId, sessionId, customId) {
    var deferred = $q.defer();
    var tickets = null;
    var promise = getByid($http, ticketId, sessionId, customId);
    promise.then(function (data) {
      tickets = data;
      deferred.resolve(tickets);
    });
    return deferred.promise;
  };

  var createTicket = function ($http, sessionId, customId, title, body) {
    var deferred = $q.defer();
    var request = $http({
      method: "post",
      url: wsUrl,
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      data: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
        'xmlns:tic="http://www.otrs.org/TicketConnector/"> ' +
        '<soapenv:Header/>' +
        '<soapenv:Body>' +
        '<TicketCreate>' +
      //'<tic:SessionID>' + sessionId + '</tic:SessionID>' +
      //'<tic:CustomerUserID>' + customId + '</tic:CustomerUserID>' +
      '<tic:UserLogin>test</tic:UserLogin>' +
        '<tic:Password>test</tic:Password>' +
        '<tic:Ticket>' +
        '<tic:Title>' + title + '</tic:Title>' +
        ' <tic:QueueID>6</tic:QueueID>' +
        '<tic:PriorityID>2</tic:PriorityID>' +
        '<tic:TypeID>24</tic:TypeID>' +
        '<tic:StateID>1</tic:StateID>' +
        '<tic:OwnerID>1</tic:OwnerID>' +
        '<tic:LockID>1</tic:LockID>' +
        '<tic:CustomerUser>' + customId + '</tic:CustomerUser>' +
        '</tic:Ticket>' +
        '<tic:Article>' +
        '<tic:From>' + customId + '</tic:From>' +
        '<tic:Subject>用户提交</tic:Subject>' +
        '<tic:Body>' + body + '</tic:Body>' +
        '<tic:Charset>utf8</tic:Charset>' +
        '<tic:MimeType>text/plain</tic:MimeType>' +
        '</tic:Article>' +
        '</TicketCreate>' +
        '</soapenv:Body>' +
        '</soapenv:Envelope>'
    });
    request.success(
      function (html) {
        var xml = null;
        var domParser = new DOMParser();
        xml = domParser.parseFromString(html, 'text/xml').
        childNodes[0].
        childNodes[0].
        childNodes[0];
        var jsonObject = CommonService.xml2json(xml).TicketID;
        if (typeof jsonObject == 'undefined') {
          AuthService.logout($window);
          deferred.reject('会话过期，请重新登录');
        } else {
          deferred.resolve(jsonObject);
        }
      }
    ).error(function (status) {
      deferred.reject(status);
    });
    return deferred.promise;
  };

  var getOne = function ($http, ticketId, sessionId, customId) {
    var deferred = $q.defer();
    var tickets = null;
    var promise = getByid($http, ticketId, sessionId, customId);
    promise.then(function (data) {
      tickets = data;
      deferred.resolve(tickets);
    });
    return deferred.promise;
  };

  var updateTicket = function ($http, ticketId, sessionId, customId, body) {
    var deferred = $q.defer();
    var request = $http({
      method: "post",
      url: wsUrl,
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      data: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
        'xmlns:tic="http://www.otrs.org/TicketConnector/"> ' +
        '<soapenv:Header/>' +
        '<soapenv:Body>' +
        '<TicketUpdate> ' +
      //'<tic:SessionID>' + sessionId + '</tic:SessionID>' +
      '<tic:TicketID>' + ticketId + '</tic:TicketID>' +
      //'<tic:CustomerUserID>' + customId + '</tic:CustomerUserID>' +
      '<tic:UserLogin>test</tic:UserLogin>' +
        '<tic:Password>test</tic:Password>' +
        '<tic:Ticket>' +
        '<tic:PriorityID>5</tic:PriorityID>' +
        '</tic:Ticket>' +
        '<tic:Article>' +
        '<tic:From>' + customId + '</tic:From>' +
        '<tic:Subject>用户反馈</tic:Subject>' +
        '<tic:Body>' + body + '</tic:Body>' +
        '<tic:Charset>utf8</tic:Charset>' +
        '<tic:MimeType>text/plain</tic:MimeType>' +
        '</tic:Article>' +
        '</TicketUpdate>' +
        '</soapenv:Body> ' +
        '</soapenv:Envelope>'
    });
    request.success(
      function (html) {
        deferred.resolve('updated');
      }
    ).error(function (status) {
      deferred.reject(status);
    });
    return deferred.promise;
  };

  return {
    getByStartAndEnd: function ($http, sessionId, customId, start, end, step) {
      var deferred = $q.defer();
      var ticketsearch = [];
      getAll($http, sessionId, customId).then(function (jsonObject) {
        var ticketIdList = [];
        if (jsonObject instanceof Array) {
          ticketIdList = jsonObject;
        } else {
          ticketIdList.push(jsonObject);
        }
        var j = ticketIdList.length;
        //结束位不能超过长度
        if (end > j) {
          end = j;
        }
        //开始位不能大于结束位
        if (start >= end) {
          start = end - step;
          if (start < 0) {
            start = 0;
          }
        }
        console.log('起始位置:' + start + ' 结束位置：' + end);
        //for 循环同步方法:定义promise数组，将每次循环返回值（promise）压入promise数组
        //$q.all的回调里，返回上层的承诺deferred.resolve(ticketsearch);
        var promiseFor = [];
        for (var i = start; i < end; i++) {
          promiseFor.push(getByid($http, ticketIdList[i].Text, sessionId, 0).then(function (data) {
            ticketsearch.push(data);
          }));
        }
        $q.all(promiseFor).then(function () {
          //for 产生的数据由于执行顺序的问题，结果可能不是按顺序排列的，所以要重新排序列
          ticketsearch.sort(function sortByid(ta, tb) {
            return tb.id - ta.id;
          });
          deferred.resolve(ticketsearch);
        });
      }, function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    },
    get: function ($http, ticketId, sessionId) {
      return getOne($http, ticketId, sessionId, 1);
    },
    updateTicket: function ($http, ticketId, sessionId, customId, body) {
      return updateTicket($http, ticketId, sessionId, customId, body);
    },
    createTicket: function ($http, sessionId, customId, title, body) {
      return createTicket($http, sessionId, customId, title, body);
    }
  }
});