(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .factory("spa-demo.subjects.Inquiry", InquiryFactory);

  InquiryFactory.$inject = ["$resource", "spa-demo.config.APP_CONFIG"];
  function InquiryFactory($resource, APP_CONFIG) {
    var service = $resource(APP_CONFIG.server_url + "/api/inquiries/:id",
      { id: '@id' },
      {
        update: {method: "PUT"},
        save:   {method: "POST" }
      });
    return service;
  }
})();
