define(['app'], function(app)
{
    app.directive('compareTo', ['$parse', function ($parse){
        var link = function($scope, $element, $attrs, ctrl) {
        var validate = function(viewValue) {
            var comparisonModel = $attrs.compareTo;

            if(!viewValue || !comparisonModel){
                // It's valid because we have nothing to compare against
                ctrl.$setValidity('compareTo', true);
            }

            // It's valid if model is lower than the model we're comparing against
            ctrl.$setValidity('compareTo', viewValue == comparisonModel );
            return viewValue;
        };

        ctrl.$parsers.unshift(validate);
        ctrl.$formatters.push(validate);

        $attrs.$observe('compareTo', function(comparisonModel){
            return validate(ctrl.$viewValue);
        });

    };

    return {
        require: 'ngModel',
        link: link
    };
    }]);
});