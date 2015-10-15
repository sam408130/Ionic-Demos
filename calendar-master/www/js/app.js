// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ui.calendar'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.service('Events',function($rootScope){
  var events=[]

  return {
    loadEvents:function(){
      events=[{
        title:'medicine',
        start:'2015-08-20'
      },{
        title:'examination',
        start:'2015-08-20'
      },{
        title:'cost',
        start:'2015-08-16'
      },{
        title:'examination',
        start:'2015-08-17'
      },{
        title:'cost',
        start:'2015-08-12'
      },{
        title:'examination',
        start:'2015-08-20'
      },{
        title:'examination',
        start:'2015-08-20'
      },{
        title:'examination',
        start:'2015-08-20'
      }]

      $rootScope.$broadcast('events_get')
    },

    getAllEvents:function(){
      return events
    },

    getEventsByDate:function(date){
      return events.filter(function(e){
        return e.start===date
      })
    }
  }
})

.controller('myController',function($scope,Events){

  Events.loadEvents()

  var getToday=function(){
    var today=new Date() 
    var year=today.getFullYear()
    var month=today.getMonth()+1
    var date=today.getDate()
    return month>10? year+'-'+month+'-'+date:year+'-0'+month+'-'+date
  }

  $scope.select_date=getToday()
  var getColorByTitle=function(title){
    if(title==='medicine'){
      return 'red'
    }
    else if(title==='cost'){
      return 'yellow'
    }
    else if(title==='examination'){
      return 'green'
    }
    else{
      return 'blue'
    }
  }
  $scope.events_in_select_date=Events.getEventsByDate($scope.select_date)

  $scope.eventSources={
    events:Events.getAllEvents().map(function(e){
      var temp={
        title:e.title,
        start:e.start,
        color:getColorByTitle(e.title)
      }
      return temp
    }),
    textColor: 'black'
  }

  $scope.alertEventOnClick=function(date,jsEvent,view){
    $scope.select_date=date.format()
    $scope.events_in_select_date=Events.getEventsByDate($scope.select_date)
  }

  $scope.uiConfig = {
     calendar:{
       height: 450,
       editable: true,
       header:{
         left: '',
         center: 'title',
         right: 'today prev,next'
       },
       dayClick: $scope.alertEventOnClick,
     }
   }
})
