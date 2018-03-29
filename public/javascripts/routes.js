
define([], function(){
    return {
        defaultRoutePath:'/',
        routes:{
            '/home':{
                templateUrl:'/views/home.html',
                dependencies:['controllers/HomeController']
            },
            '/login':{
                templateUrl:'/views/login.html',
                dependencies:[
                    'controllers/UserController',
                    'directives/CompareTo'
                ]
            },
            '/dishes':{
                templateUrl:'/views/dishes.html',
                dependencies:['controllers/DishesController']
            },
            '/orders':{
                templateUrl:'/views/orders.html',
                dependencies:['controllers/OrdersController']
            }
        }
    }
})