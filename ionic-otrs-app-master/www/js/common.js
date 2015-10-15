//XML转JSON
'use strict';

angular.module('otrsapp.common', [])

.factory('CommonService', function () {
  return {
    xml2json: function (xml) {
      var obj = {};
      if (xml.childNodes.length > 0) {
        for (var i = 0; i < xml.childNodes.length; i++) {
          var item = xml.childNodes[i];
          var nodeName = item.nodeName;
          if(item.nodeType==3){
              nodeName = 'Text'  ;
          }
          if (typeof (obj[nodeName]) == "undefined") {
            obj[nodeName] = this.xml2json(item);
          } else {
            if (typeof (obj[nodeName].push) == "undefined") {
              var old = obj[nodeName];

              obj[nodeName] = [];
              obj[nodeName].push(old);
            }
            obj[nodeName].push(this.xml2json(item));
          }
        }
      } else {
        obj = xml.textContent;
      }
      return obj;
    }
  }
});