"use strict";

var app = angular.module('ionic-calendar', ['ionic'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {

        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'CalendarEventController'
    })
        .state('app.demo1', {
            url: "/demo1",
            views: {
                'menuContent': {
                    templateUrl: "templates/demo1.html"
                }
            }
        })
        .state('app.demo2', {
            url: "/demo2",
            views: {
                'menuContent': {
                    templateUrl: "templates/demo2.html",
                }
            }
        })
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/demo1');
});

app.service("EventService",
    function ($http, $q) {

        // Return public API.
        return ({
            getEvents: getEvents,
        });


        // ---
        // PUBLIC METHODS.
        // ---


        // I get all of the events in the remote collection.
        function getEvents() {

            var request = $http({
                method: "get",
                url: "js/events.json",
                params: {
                    action: "get"
                }
            });

            return (request.then(handleSuccess, handleError));

        }


        // ---
        // PRIVATE METHODS.
        // ---


        // I transform the error response, unwrapping the application dta from
        // the API response payload.
        function handleError(response) {

            // The API response from the server should be returned in a
            // nomralized format. However, if the request was not handled by the
            // server (or what not handles properly - ex. server error), then we
            // may have to normalize it on our end, as best we can.
            if (!angular.isObject(response.data) ||
                !response.data.message
            ) {

                return ($q.reject("An unknown error occurred."));

            }

            // Otherwise, use expected error message.
            return ($q.reject(response.data.message));

        }


        // I transform the successful response, unwrapping the application data
        // from the API response payload.
        function handleSuccess(response) {
            var res = null;
            try {
                res = JSON.parse(response.data);
            } catch (e) {

            }
            return (response.data);

        }

    }
);

app.controller("CalendarEventController", function ($scope, EventService) {

    EventService.getEvents().then(function (events) {
        $scope.events = events;

    });
});

app.controller('CalendarPopupController', function ($scope, $ionicPopup, $timeout) {

    // Triggered on a button click, or some other target
    $scope.showPopup = function ($event, day) {
        $scope.data = {}

        if (day.events.length > 0) {
            //show popup only if events on day cell

            var $element = $event.currentTarget;

            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                templateUrl: 'templates/calendar/calendar-event-popup-template.html',
                title: '' + day.date,
                subTitle: '',
                scope: $scope,
                buttons: [{
                    text: '<b>Close</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        return 'cancel button'
                    }
                }, ]
            });
            myPopup.then(function (res) {

            });
        }

    };

    $scope.sendEvent = function () {
        var startDate = new Date(2014, 10, 15, 18, 30, 0, 0, 0); // beware: month 0 = january, 11 = december
        var endDate = new Date(2014, 10, 15, 19, 30, 0, 0, 0);
        var title = "My nice event";
        var location = "Home";
        var notes = "Some notes about this event.";
        var success = function (message) {
            alert("Success: " + JSON.stringify(message));
        };
        var error = function (message) {
            alert("Error: " + message);
        };

        window.plugins.calendar.createEventInteractively(title,location,notes,startDate,endDate,success,error);
    }

});

var language = {

    d0: 'Sun',
    d1: 'Mon',
    d2: 'Tue',
    d3: 'Wed',
    d4: 'Thu',
    d5: 'Fri',
    d6: 'Sat',

    thisMonth: "Today",
    prevMonth: "<< Prev",
    nextMonth: "Next >>",

};
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];




// get month name
Date.prototype.getMonthName = function () {
    var currentDate = new Date();
    var month = monthNames[this.getMonth()];
    return month < 10 ? '0' + month : month;

}

Date.prototype.getMonthFormatted = function () {
    var month = this.getMonth() + 1;
    return month < 10 ? '0' + month : month;
}


app.directive('ngHtml', function () {
    return function (scope, element, attrs) {
        scope.$watch(attrs.ngHtml, function (value) {
            element[0].innerHTML = value;
        });
    }
});


var calendarLinkFunction = function (scope, element, attrs) {

    scope.$watch('events', function (newValue, oldValue) {
        if (newValue) {
            newValue = JSON.parse(newValue);
            refreshCalendar(newValue);
        }
    }, true);


    var contentObj = scope.content;
    var targetMonth = parseInt(scope.assignedMonth, 10),
        targetYear = parseInt(scope.assignedyear, 10);

    if (!isNaN(targetMonth) &&
        !isNaN(targetYear) &&
        targetMonth > 0 &&
        targetMonth < 12
    ) {
        scope.currentDate = new Date(targetYear, targetMonth, 0);
    } else {
        scope.currentDate = new Date();
    }

    scope.today = new Date();
    scope.language = language;
    scope.navigate = {};


    // month between 1 and 12
    var daysInMonth = function (month, year) {
        return new Date(year, month, 0).getDate();
    }

    scope.navigate.prevMotnth = function () {
        scope.currentDate.setMonth(scope.currentDate.getMonth() - 1);
        refreshCalendar();
    }
    scope.navigate.nextMotnth = function () {
        scope.currentDate.setMonth(scope.currentDate.getMonth() + 1);
        refreshCalendar();
    }
    scope.navigate.thisMotnth = function () {
        scope.currentDate = new Date();
        refreshCalendar();
    }

    // month between 1 ~ 12
    var getDateContent = function (year, month, date) {
        if (contentObj != null && contentObj[year] != null &&
            contentObj[year][month] != null &&
            contentObj[year][month][date] != null) {
            return contentObj[year][month][date].join("<br/>");
        }
        return "";
    }

    // month between 1 ~ 12
    var monthGenegrator = function (month, year, events) {
        var monthArray = [];
        var firstDay = new Date(year, month - 1, 1, 0, 0, 0, 0);
        //  weekDay between 1 ~ 7 , 1 is Monday, 7 is Sunday
        var firstDayInFirstweek = (firstDay.getDay() > 0) ? firstDay.getDay() : 7;
        var daysOfMonth = daysInMonth(month, year);
        var prevDaysOfMonth = daysInMonth(month - 1, year);

        var recordDate = 0; //record which day obj already genegrate

        //first week row
        monthArray.push(weekGenegrator(year, month, recordDate - firstDayInFirstweek, daysOfMonth, prevDaysOfMonth, events));

        recordDate = 7 - firstDayInFirstweek;
        //loop for following week row           
        while (recordDate < daysOfMonth - 1) {
            monthArray.push(weekGenegrator(year, month, recordDate, daysOfMonth));
            recordDate += 7;
        }

        //set isToday
        if (scope.currentDate.getMonth() == scope.today.getMonth() &&
            scope.currentDate.getFullYear() == scope.today.getFullYear()) {
            var atWeek = Math.ceil((scope.today.getDate() + firstDayInFirstweek - 1) / 7) - 1;
            var atDay = (scope.today.getDate() + firstDayInFirstweek - 2) % 7;
            monthArray[atWeek][atDay].isToday = true;
        }

        return monthArray;
    }

    //month between 1~12
    var weekGenegrator = function (year, month, startDate, daysOfMonth, prevDaysOfMonth, events) {
        var week = [];

        for (var i = 1; i <= 7; i++) {
            var
                realDate,
                outmonth = false,
                content = "";

            if (startDate + i < 0) {
                realDate = prevDaysOfMonth + startDate + i + 1;
                outmonth = true;
            } else if (startDate + i + 1 > daysOfMonth) {
                realDate = startDate + i - daysOfMonth + 1;
                outmonth = true;
            } else {
                realDate = startDate + i + 1;
                content = getDateContent(year, month, realDate);
            }

            var fullDate = year + "-" + month + "-" + realDate;
            var dayEvents = [];

            //debugger;
            if (events) {

                for (var m = 0; m < events.length; m++) {
                    if (events[m].start === fullDate && !outmonth) {
                        dayEvents.push(events[m]);
                    }
                }

            }

            week.push({
                "outmonth": outmonth,
                "day": i,
                "content": content,
                "date": realDate,
                "fullDate": fullDate,
                "events": dayEvents

            });

        }
        return week;
    }

    var refreshCalendar = function (events) {
        scope.month = monthGenegrator(scope.currentDate.getMonth() + 1, scope.currentDate.getFullYear(), events);
    }

    refreshCalendar();
}

app.directive("calendar", function () {
    return {
        restrict: "EA",
        scope: {
            content: '=calendarContent',
            assignedMonth: '=calendarMonth',
            assignedyear: '=calendarYear',
            events: '@'
        },
        replace: true,
        link: calendarLinkFunction,
        templateUrl: 'templates/calendar/calendar-template.html'
    }
});