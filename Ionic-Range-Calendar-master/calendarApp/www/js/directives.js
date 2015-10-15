/*
Incluir archivo en el proyecto.
Copiar archivos a lib/js:
 jquery.min.js
 jquery-ui.min.js
 jquery.ui.touch-punch.min.js
 moment+langs.min.js
 jquery.rangecalendar.js
 
e incluirlos.
*/
angular.module('starter.directives', [])
.directive('rangeCal', function($rootScope) {
    return {
        restrict: 'AE',
        scope:{
            now: '@'
        },
        link: function(scope, element, attrs) {
            var triggerRelink = function(){
                $(element).rangeCalendar({
                	lang: attrs.lang,
                    theme: attrs.theme,
                    start: attrs.start,
                    startRangeWidth: parseInt(attrs.startRangeWidth),
                    minRangeWidth: parseInt(attrs.minRangeWidth),
                    maxRangeWidth: parseInt(attrs.maxRangeWidth),
                    changeRangeCallback: function( el, cont, dateProp ) {
                        localStorage.setItem('date-id', JSON.stringify(cont));
                        return false;
                    }
                }).setStartDate(scope.now);
            }

            triggerRelink();                
            $rootScope.$on(attrs.relinkEvent, triggerRelink);
        }
    };
});