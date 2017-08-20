(function() {
  "use strict";

  angular
    .module("spa-demo.authn")
    .component("sdSignup", {
      templateUrl: templateUrl,
      controller: SignupController,
    });


  templateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function templateUrl(APP_CONFIG) {
    return APP_CONFIG.authn_signup_html;
  }

  SignupController.$inject = ["$scope","$state","spa-demo.authn.Authn","spa-demo.layout.DataUtils", "spa-demo.subjects.Image"];
  function SignupController($scope, $state, Authn, DataUtils, Image) {
    var vm=this;
    vm.signupForm = {}
    vm.image_content = null;
    vm.signup = signup;
    vm.setImageContent = setImageContent;

    vm.$onInit = function() {
      console.log("SignupController",$scope);
    }
    return;
    //////////////
    function signup() {
      console.log("signup...");
      $scope.signup_form.$setPristine();
      Authn.signup(vm.signupForm).then(
        function(response){
          vm.id = response.data.data.id;
          console.log("signup complete", response.data, vm);
          if (vm.image_content) {
            var image = new Image();
            image.creator_id = vm.id;
            image.user_id = vm.id;
            image.image_content = vm.image_content;
            image.$save().then(
              function(response) {
                console.log(response);
                $state.go("home");
              },
              function(errorResponse) {
                console.log(errorResponse);
              }
            );
          } else {
            $state.go("home");
          }
        },
        function(response){
          vm.signupForm["errors"]=response.data.errors;
          console.log("signup failure", response, vm);
        }
      );
    }

    function setImageContent(dataUri) {
      console.log("setImageContent", !dataUri || dataUri.length);
      vm.image_content = DataUtils.getContentFromDataUri(dataUri);
    }
  }
})();
