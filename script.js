$(function(){

  /**
   * Model definitions
   * -----------------
   */

  /**
   * The player object
   * @property name. The name of the player.
   * @property number. The number of the player.
   */
  var Player = Backbone.Model.extend({
    urlRoot : '/Players',
  });

  var Players = Backbone.Collection.extend({
    url: '/Players',
    initialize: function() {
       // Fill players with series.
    }
  });

  var ChoosePlayer = Backbone.View.extend({
    el: '.page',

    // fetch players and make a list.
    render: function(){
      var that = this;
      var players = new Players();
      players.fetch({
        success: function (players){
          var players = players;
          var series = new Serie();
          _.find(players.models,function(player){

            var playerid = player.attributes._id.$oid;

            series.fetch({
              data:{
                q : '{player_id:"' +  player.attributes._id.$oid + '"}'
              },
              success: function(series){

                //console.log(series);
                //return;


                  _.find(series.attributes,function(serie){
                    //console.log(serie);
                    if(playerid == serie.player_id){
                      player.set({
                        last_serie_date: serie.date,
                        last_serie_id: serie._id.$oid
                      });
                    }

                  });

                var template = _.template($('#show-player-list').html(), {players:players.models});
                that.$el.html(template);
              }
            });
          });
        }
      })
    }
  });
  var ChoosePlayer = new ChoosePlayer();

  var editPlayer = Backbone.View.extend({
    el: '.page',
    render : function (options) {
      var that = this;
      if (options.id) {
        // fetch player.
        var player = new Player({id: options.id});
        player.fetch({
          success: function(player) {
            var template = _.template($('#edit-user-template').html(), {player: player});
            that.$el.html(template);
          }
        });
      }
      else{
        var template = _.template($('#edit-user-template').html(), {player: null});
        this.$el.html(template);
        // render empty form.
      }
    },
    events: {
      'submit .edit-user-form': 'saveUser'
    },
    saveUser: function(event) {
      var details = $(event.currentTarget).serializeObject();
      var player = new Player();
      player.save(details, {
        success: function(player){
          //router.navigate('new_score/' + player.attributes._id.$oid,{trigger:true})
        }
      });
      event.preventDefault();
    }
  });
  var editPlayer = new editPlayer();

  /**
   * The Serie object
   * @type {*}
   */
  var Serie = Backbone.Model.extend({
    urlRoot : '/Series'
  });

  var newSerie = Backbone.View.extend({
    el: '.page',
    render : function (options) {
      var template = _.template($('#create-serie-list').html(), {
        player: options.id,
        date : new Date()
      });
      this.$el.html(template);
    },
    events: {
      'submit .new-serie-form': 'createSerie'
    },
    createSerie: function(event){
      var details = $(event.currentTarget).serializeObject();
      var serie = new Serie();
      serie.save(details, {
        success: function(serie){
          console.log(serie);
          router.navigate('new_score/' + serie.attributes._id.$oid,{trigger:true})
        }
      });
      console.log(details);




      event.preventDefault();
    }
  });
  var newSerie = new newSerie();



  /**
   * @property rounds. A collection of rounds
   * @property timestamp. When was the serie initiated.
   * @property type. Is this TJ pistol? 15m indoor? rifle? This should reflect
   * in the scoresheet aswell.
   */
  var RoundType = Backbone.Model.extend({
    urlRoot : '/RoundTypes'
  });
  var RoundTypes = Backbone.Collection.extend({
    url:'/RoundTypes'
  });

  var ChooseRoundType = Backbone.View.extend({
    el: '.page',
    render: function(options){
      var that = this;
      var types = new RoundTypes();
      var serieid = options.id;
      types.fetch({
        success: function (roundtypes){
          var template = _.template($('#roundtype-list').html(), {roundtypes: roundtypes.models,serieid:serieid});
          that.$el.html(template);
        }
      });
    }
  });
  var ChooseRoundType = new ChooseRoundType();

  var editRoundType = Backbone.View.extend({
    el: '.page',
    render: function(){
      console.log('hest');
      var template = _.template($('#edit-serie-type-template').html(), {});
      this.$el.html(template);
    },
    events: {
      'submit .edit-serie-form': 'saveRoundType'
    },
    saveRoundType: function(event){
      var details = $(event.currentTarget).serializeObject();
      var roundtype = new RoundType();
      roundtype.save(details, {
        success:function(serie){
          router.navigate('',{trigger:true});
        }
      });
      event.preventDefault();
    }
  });
  var editRoundType = new editRoundType();

  /**
   * @property
   * @property shots. A collection of shots, that can have diffrent values. Values should
   * translateable, ie. X = 10
   */
  var Round = Backbone.Model;



  /**
   * @property value
   */
  var shot = Backbone.Model;


  $.ajaxPrefilter(function(options, originalOptions, jqXHR){
    options.url = 'https://api.mongolab.com/api/1/databases/shooterv3/collections' + options.url + '?apiKey=50392416e4b05405e515d962';
  });

  $.fn.serializeObject = function(){
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
      if (o[this.name]) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });
    return o;
  };


  var startScreen = Backbone.View.extend({
    el: '.page',
    render : function (){
      this.$el.html($('#startscreen-template').html());
    }

  });
  var startScreen = new startScreen();


  // Define router.
  var Router = Backbone.Router.extend({
     routes: {
       '' : 'startscreen',
       'new' : 'choosePlayer',
       'new_score/:id' : 'newScore',
       'edit/:id': 'editPlayer',
       'new_player' : 'editPlayer',
       'new_serie_type' : 'editRoundType',
       'scoring/:id/:type_id' : 'Scoring',
       'start_new_serie/:id' : 'newSerie'
     }
  });

  // Initiate router.
  var router = new Router();
  router.on('route:startscreen',function(){
    startScreen.render();
  });
  router.on('route:choosePlayer',function(){
    ChoosePlayer.render();
  });
  router.on('route:editPlayer',function(id){
    //console.log('hest');
    editPlayer.render({id: id});
  });
  router.on('route:editRoundType',function(){
    //console.log('NEW SCORE SHEET');
    editRoundType.render();
  });
  router.on('route:newScore',function(id){
    ChooseRoundType.render({id: id});
  });
  router.on('route:Scoring',function(id,type){
    console.log(id + ' - ' + type);
  });
  router.on('route:newSerie',function(id,type){
    newSerie.render({id:id});
  });

  // Inorder for routers to work, we need history.
  Backbone.history.start();

});