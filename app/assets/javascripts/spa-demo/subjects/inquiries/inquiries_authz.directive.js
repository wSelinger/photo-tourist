(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .directive("sdInquiriesAuthz", InquiriesAuthzDirective);

  InquiriesAuthzDirective.$inject = [];

  function InquiriesAuthzDirective() {
    var directive = {
        bindToController: true,
        controller: InquiriesAuthzController,
        controllerAs: "vm",
        restrict: "A",
        link: link
    };
    return directive;

    function link(scope, element, attrs) {
      console.log("InquiriesAuthzDirective", scope);
    }
  }

  InquiriesAuthzController.$inject = ["$scope",
                                   "spa-demo.subjects.InquiriesAuthz"];
  function InquiriesAuthzController($scope, InquiriesAuthz) {
    var vm = this;
    vm.authz={};
    vm.authz.canUpdateItem = canUpdateItem;
    vm.newItem=newItem;

    activate();
    return;
    //////////
    function activate() {
      vm.newItem(null);
    }

    function newItem(item) {
      InquiriesAuthz.getAuthorizedUser().then(
        function(user){ authzUserItem(item, user); },
        function(user){ authzUserItem(item, user); });
    }

    function authzUserItem(item, user) {
      console.log("new Item/Authz", item, user);

      vm.authz.isAuthenticated = InquiriesAuthz.isAuthenticated();
      vm.authz.canQuery      = InquiriesAuthz.canQuery();
      vm.authz.canCreate = InquiriesAuthz.canCreate();
      if (item && item.$promise) {
        vm.authz.canUpdate     = false;
        vm.authz.canDelete     = false;
        vm.authz.canGetDetails = false;
        vm.authz.canUpdateOrganizerFields = false;
        vm.authz.canUpdateInternalFields = false;
        item.$promise.then(function(){ checkAccess(item); });
      } else {
        checkAccess(item)
      }
    }

    function checkAccess(item) {
      vm.authz.canUpdate     = InquiriesAuthz.canUpdate(item);
      vm.authz.canDelete     = InquiriesAuthz.canDelete(item);
      vm.authz.canGetDetails = InquiriesAuthz.canGetDetails(item);
      vm.authz.canUpdateOrganizerFields = InquiriesAuthz.canUpdateOrganizerFields(item);
      vm.authz.canUpdateInternalFields = InquiriesAuthz.canUpdateInternalFields(item);
      console.log("checkAccess", item, vm.authz);
    }

    function canUpdateItem(item) {
      return InquiriesAuthz.canUpdate(item);
    }
  }
})();
