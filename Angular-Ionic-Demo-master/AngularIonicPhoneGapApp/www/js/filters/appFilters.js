/**
* Created by Amit.Gupta on 3/10/2015.
*/

var app = angular.module('starter');
app.filter('filterEmployeesByName1', function () {
    return function (items, search) {
        var searchKeyWord = null;
        if (search === '' || search == undefined || search == null) {
            return items;
        } else {
            searchKeyWord = search;
        }
        return items.filter(function (element, index, array) {
            if (element.firstName.indexOf(searchKeyWord) > -1) {
                return;
            }
        });
    };
});
