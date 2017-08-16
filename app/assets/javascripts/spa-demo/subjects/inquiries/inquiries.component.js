(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .component("sdInquirySelector", {
      templateUrl: inquirySelectorTemplateUrl,
      controller: InquirySelectorController,
      bindings: {
        authz: "<"
      }
    })
    .component("sdInquiryEditor", {
      templateUrl: inquiryEditorTemplateUrl,
      controller: InquiryEditorController,
      bindings: {
        authz: "<"
      },
      require: {
        inquiriesAuthz: "^sdInquiriesAuthz"
      }
    });

  inquirySelectorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function inquirySelectorTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.inquiry_selector_html;
  }

  inquiryEditorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function inquiryEditorTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.inquiry_editor_html;
  }

  InquirySelectorController.$inject = ["$scope",
                                     "$stateParams",
                                     "spa-demo.authz.Authz",
                                     "spa-demo.subjects.Inquiry"];
  function InquirySelectorController($scope, $stateParams, Authz, Inquiry) {
    var vm=this;
    vm.$onInit = function() {
      console.log("InquirySelectorController",$scope);
      $scope.$watch(function(){ return Authz.getAuthorizedUserId(); },
                    function(){
                      if (!$stateParams.id) {
                        vm.items = Inquiry.query();
                      }
                    });
    }
    return;
    //////////////
  }

  InquiryEditorController.$inject = ["$scope","$q",
                                   "$state", "$stateParams",
                                   "spa-demo.authz.Authz",
                                   "spa-demo.subjects.Inquiry"
                                   ];
  function InquiryEditorController($scope, $q, $state, $stateParams,
                                 Authz, Inquiry) {
    var vm=this;
    vm.create = create;
    vm.clear  = clear;
    vm.update  = update;
    vm.remove  = remove;

    vm.$onInit = function() {
      console.log("InquiryEditorController",$scope);
      $scope.$watch(function(){ return Authz.getAuthorizedUserId(); },
                    function(){
                      if ($stateParams.id) {
                        reload($stateParams.id);
                      } else {
                        newResource();
                      }
                    });
    }
    return;
    //////////////
    function newResource() {
      console.log("newResource()");
      vm.item = new Inquiry();
      vm.inquiriesAuthz.newItem(vm.item);
      return vm.item;
    }

    function reload(inquiryId) {
      var itemId = inquiryId ? inquiryId : vm.item.id;
      console.log("re/loading inquiry", itemId);
      vm.item = Inquiry.get({id:itemId});
      vm.inquiriesAuthz.newItem(vm.item);
    }

    function clear() {
      newResource();
      $state.go(".", {id:null});
    }

    function create() {
      vm.item.$save().then(
        function(){
           $state.go(".", {id: vm.item.id});
        },
        handleError);
    }

    function update() {
      vm.item.errors = null;
      var update=vm.item.$update();
    }

    function remove() {
      vm.item.errors = null;
      vm.item.$delete().then(
        function(){
          console.log("remove complete", vm.item);
          clear();
        },
        handleError);
    }


    function handleError(response) {
      console.log("error", response);
      if (response.data) {
        vm.item["errors"]=response.data.errors;
      }
      if (!vm.item.errors) {
        vm.item["errors"]={}
        vm.item["errors"]["full_messages"]=[response];
      }
      $scope.inquiryform.$setPristine();
    }
  }

})();
