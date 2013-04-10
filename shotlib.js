/**
 * Created with JetBrains PhpStorm.
 * User: trogels
 * Date: 1/18/13
 * Time: 5:22 PM
 * To change this template use File | Settings | File Templates.
 */

//var data = [];

/**
 *
 * Registery process.
 *
 * Choose shooter.
 * Create shooter.
 * Choose serie based on creation time or create new.
 * Create new scoring serie in serie.
 * Score.
 * Save.
 *
 *
 * @type {Object}
 */

var selectedShooter = '';


// define the anatomy of a shootserie.
var serie = {
  shoots: {},
  init: function(){

  }
}

var shotLib = {
  data : {},
  init: function(){
    shotLib.loadData();

  },
  // Fetch the datascructure as stored.
  loadData: function(){
    $.getJSON('register.php?action=readAll&file=data', function(data) {
      shotLib.data = data;
    });
  },
  saveData: function(){

  },
  getShooters : function (){
    shooters = [];
    //console.log(shotLib.data[0]);
    $(shotLib.data).each(function(){
      //console.log(this);
      shooters.push(this.name);
    });
    return shooters;
  }
};


var view = {
  buildShootersSelect: function(){
    list = $('<ul>', {class: 'shooters'});
    $(shotLib.getShooters()).each(function(){
      $('<li>').text(this).click('controller.selectShooter').appendTo(list);
    });
    return list;
  }

};

var controller = {
  selectShooter: function(){
    console.log(this);
    selectedShooter = 'hest';
  }
};