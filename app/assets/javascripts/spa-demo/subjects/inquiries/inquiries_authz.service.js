(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .factory("spa-demo.subjects.InquiriesAuthz", InquiriesAuthzFactory);

  InquiriesAuthzFactory.$inject = ["spa-demo.authz.Authz",
                                "spa-demo.authz.BasePolicy"];
  function InquiriesAuthzFactory(Authz, BasePolicy) {
    function InquiriesAuthz() {
      BasePolicy.call(this, "Inquiry");
    }

      //start with base class prototype definitions
    InquiriesAuthz.prototype = Object.create(BasePolicy.prototype);
    InquiriesAuthz.constructor = InquiriesAuthz;

      //override and add additional methods
    InquiriesAuthz.prototype.canCreate=function() {
      //console.log("ItemsAuthz.canCreate");
      return Authz.isAuthenticated();
    };

    InquiriesAuthz.prototype.canQuery=function() {
      //console.log("ItemsAuthz.canCreate");
      return Authz.isAuthenticated();
    };

    InquiriesAuthz.prototype.canUpdate=function(item) {
      return Authz.isAdmin() || Authz.isOrganizer(item);
    };

    InquiriesAuthz.prototype.canUpdateOrganizerFields=function(item) {
      return Authz.isOrganizer(item);
    };

    InquiriesAuthz.prototype.canUpdateInternalFields=function(item) {
      return Authz.isAdmin();
    };

    return new InquiriesAuthz();
  }
})();
