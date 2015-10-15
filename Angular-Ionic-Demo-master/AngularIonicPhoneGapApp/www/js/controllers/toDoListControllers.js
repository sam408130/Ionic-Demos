/**
 * Created by Amit.Gupta on 3/10/2015.
 */

var app = angular.module('starter');

app.controller('PlaylistsCtrl', function($scope,$ionicPopup,$timeout) {
    $scope.counter = 6;
    $scope.data = "";
    $scope.playlists = [
        { title: 'Pay Bills', id: 1 },
        { title: 'Doctor Visit', id: 2 },
        { title: 'Plan Holidays', id: 3 },
        { title: 'Call Neighbour', id: 4 },
        { title: 'Call Lawyer', id: 5 },
        { title: 'Buy New Iphone', id: 6 }
    ];
    $scope.isEdit = false;
    $scope.editBtnTxt = "Edit";

    $scope.onEdit = function(){
        console.log("HI");
        if($scope.isEdit){
            $scope.isEdit = false;
            $scope.editBtnTxt = "Edit";

        }else {
            $scope.editBtnTxt = "Done";
            $scope.isEdit = true;
        }
        console.log("Edit Txt is :"+$scope.editBtnTxt);
    }

    $scope.removeAll = function(){
        $scope.playlists = [];
    }

    // Triggered on a button click, or some other target
    $scope.showAddPopUp = function() {
        // An elaborate, custom popup
        $scope.data = {};
        var myPopup = $ionicPopup.show({
            template: '<input type="text" placeholder="000" ng-model="data.item">',
            title: 'Enter To-Do Item',
            //subTitle: 'Item',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.data.item) {
                            console.log('Saved!..');
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                        } else {
                            console.log('Saved!');
                            $scope.counter++;
                            var temp = { title: $scope.data.item, id: $scope.counter }
                            $scope.playlists.push(temp);
                            return $scope.data.item;
                        }
                    }
                }
            ]
        });
        myPopup.then(function(res) {
            console.log('Tapped!', res);
        });
        //$timeout(function() {
        //  myPopup.close(); //close the popup after 3 seconds for some reason
        //}, 3000);
    };



});


    app.controller('PlaylistCtrl', function($scope, $stateParams) {

    });
