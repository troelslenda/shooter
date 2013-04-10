
define([
  'app/views/startscreen'
], function(startScreen){

  AppRouter = Backbone.Router.extend({

    routes: {
      '' : 'startscreen'
    },


    initialize: function(){

      this.on('route:startscreen', function(){
        var startScreen = new startScreen();
      });

      Backbone.history.start({root: '/'});

    }





  });
  return AppRouter;
});