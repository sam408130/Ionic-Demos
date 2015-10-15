var module = angular.module('starter');

module.factory('userFactory', function(){

    var fac = {};

    fac.users = ['John', 'James', 'Jake'];

    return fac;

});