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

                  _.find(series.attributes,function(serie){
                    if(playerid == serie.player_id){
                      // Get date and add two hours?!
                      var date = new Date(serie.date);
                      date.setMilliseconds(date.getMilliseconds()+7200000);
                      //console.log();
                      var prettydate = prettyDate(date.toISOString());
                      player.set({
                        last_serie_date: prettydate ,
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
          router.navigate('new',{trigger:true})
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

  var Series = Backbone.Collection.extend({
    url:'/Series'
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
  var Round = Backbone.Model.extend({
    url : '/Rounds'
  });
  var RegisterRound = Backbone.View.extend({
    initialize : function(){
      this.options.shots = [];
    },
    el: '.page',
    render: function(options){

      var template = _.template($('#register-round-list').html());
      this.$el.html(template);
    },
    events: {
      'touchend .add-score': 'appendShot',
      'click .reset-score': 'resetShots',
      'click .submit-score': 'submitShots'
    },
    appendShot : function(event){
      var point = $(event.currentTarget).attr('data-val');
      this.options.shots.push(point);
      this.updateDisplayedScore();
      event.preventDefault();
    },
    resetShots : function (event){
      this.options.shots = [];
      this.updateDisplayedScore();
      event.preventDefault();
    },
    updateDisplayedScore: function (){
      console.log(this.options.shots);
      // Calculate the total score and bulls
      var sum = 0;
      var bulls = 0;
      $.each(this.options.shots,function(){
        sum+=parseInt(this == 'x' ? 10 : this) || 0;
        this == 'x' ? bulls++:null;
      });
      $('.totalscore').html(sum);
      $('.bulls').html(bulls);
      $('.numberofshots').html(this.options.shots.length);
    },
    submitShots: function(event){
      event.preventDefault();
      console.log(this.options);
      var round = new Round();
      round.save(this.options, {
        success: function(round){
          router.navigate('',{trigger:true})
        }
      });
    }
  });
  var RegisterRound = new RegisterRound();

  var ResultsOverview = Backbone.View.extend({
    el: '.page',
    render: function(){
      var that = this;
      var serie = new Series();
      var player = new Players();
      serie.fetch({
        success: function() {
          player.fetch({
            success: function(){
              // series and players loaded.

              _.find(serie.models,function(serie){
                //var serie = serie;
                _.find(player.models,function(player){
                  //console.log(player.get('_id').$oid);
                  if (player.get('_id').$oid == serie.get('player_id')) {
                    serie.set({
                      'playername' : player.get('firstname'),
                      playerno : player.get('number')
                    });
                  }
                });
              });
              var template = _.template($('#show-results-overview').html(),{series: serie.models});
              that.$el.html(template);
            }
          });

        }});

    }

  });

  var ResultsOverview = new ResultsOverview();



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
       'start_new_serie/:id' : 'newSerie',
       'results' : 'ResultsOverview',
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
    RegisterRound.options.serieid = id;
    RegisterRound.options.roundtype = type;
    RegisterRound.render();

  });
  router.on('route:newSerie',function(id,type){
    newSerie.render({id:id});
  });
  router.on('route:ResultsOverview',function(){
    ResultsOverview.render();
  });

  // Inorder for routers to work, we need history.
  Backbone.history.start();

});