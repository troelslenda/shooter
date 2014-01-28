jQuery(function(){

	function updateScore(){
		entries = $('.history li:not(.exclude) .score');
		score = 0;
		x = 0;
		shots = 0;
		$(entries).each(function(){
			val = $(this).html();
			
			if(val == 'x'){
				val = 10;
				x = x + 1;
			}
			shots = shots + 1;
			score = score + parseInt(val);
		});

		if(score > 0 && !$('.controls .score')[0]){
			control = $('<li>',{class:'score'}).html('Score: ');
			$('<span>',{class: 'total'}).appendTo(control);
			control.appendTo($('.controls'));
		}
		if(x > 0 && !$('.controls .bulls')[0]){
			$('.total').after('/' + '<span class="bulls"></span>' );
		}
		if(shots > 1 && !$('.controls .shots')[0]){
			$('.controls li.score').append(' of ');
			$('<span>',{class: 'shots'}).appendTo($('.controls li.score'));
		}
		if(!$('.controls .clear')[0]){
			$('<li>',{class: 'clear'}).html('Nulstil').appendTo($('.controls'));
		}
		if(!$('.controls .send')[0]){
			$('<li>',{class: 'send'}).html('Send').appendTo($('.controls'));
		}


		$('.controls .total').html(score);
		$('.controls .bulls').html(x);
		$('.controls .shots').html(shots);

	}
  function loadHistory() {
    var series = [];
    var dateHeader = '';

    $.getJSON('register.php?action=readAll', function(data) {

      // clean null values and other lines that do not contain the attrib name
      $(data).each(function(){
        if(this.name){
          series.push(this);
        }
      });
      // sort by time stamp
      series.sort(function(a,b){
        return b.time - a.time;
      });

      //data = series;

      list = $('<ul>');
      $(series).each(function(){
        bulls = 0;
        total = 0;
        $(this.shots).each(function(){
          shot = this;
          if(shot == 'x') {
            bulls++;
            shot = 10;
          }
          total = total + parseInt(shot);
        });
        if(this.name){
          dat = new Date(this.time*1000);
          if(dateHeader != dat.getDate() + ' / ' + (parseInt(dat.getMonth())+1) + ' / ' + dat.getFullYear()){
            dateHeader = dat.getDate() + ' / ' + (parseInt(dat.getMonth())+1) + ' / ' + dat.getFullYear();
            $('<li>').html(dateHeader).appendTo(list);
          }

          $('<li>').html(this.name +' (' + this.type + ') Total: ' + total  + ' / Bulls : ' + bulls ).appendTo(list);
        }
      });

      $('.page > .result-shower').html(list);

      // console.log(data);
    });
  }

  function enterShoot() {

    $.getJSON('register.php?action=readAll_shooter', function(data) {
      var select = $('<select>', {'class' : 'choose_shooter'});
      $(data).each(function(){
        if (this.name) {
          var option = $('<option>',{value: this.name}).html(this.name);
          option.appendTo(select);
        }
      });
      console.log('hest');
      $('.shooters').html(select);

    });



      var pos = {};
    var type = '';

    /*$('body').bind("touchstart", function (e) {
      pos = {
        'x': e.originalEvent.touches[0].screenX,
        'y': e.originalEvent.touches[0].screenY,
      }
    });*/


    $('.history li').live('touchend',function(e){
/*      end = e.originalEvent.changedTouches[0];
      if (end.screenX != pos.x) {
        return;
      }
      if (end.screenY != pos.y) {
        return;
      }*/

      if($(this).hasClass('exclude')){
        $(this).removeClass('exclude');
      }
      else{
        $(this).addClass('exclude');
      }
      updateScore();
    });

    $('.panel li').bind('touchstart',function(){
      newitem = $('<li>');
      $('<div>',{class: 'shotno'}).html(($('.history li').length+1)).appendTo(newitem);
      $('<div>',{class: 'score'}).html($(this).html()).appendTo(newitem);

      newitem.prependTo($('.history'));
      updateScore();
    });

    $('.controls .clear').live('touchstart',function(){
      $('.history li').remove();
      updateScore();
    });
    /*$('.type li').live('touchstart',function(){

    });*/
    $('.controls .send').live('touchstart',function(){
      $('.controls, .panel').hide();

      var shooter = localStorage.getItem("std_shooter");


      $('select.choose_shooter').val(shooter);


      $('.shooters').show();
      $('.type').show();
    });
    $('.type li').live('touchstart',function(){
      /*if(!$('.type li.exclude').length){
        return;
      }*/
      $(this).siblings().removeClass('exclude');
      $(this).addClass('exclude');


      localStorage.setItem("std_shooter", $('select.choose_shooter option:selected').val());

      console.log($(this).html());
      updateScore();
      shotsarray = new Array();
      $('.history li:not(.exclude)').each(function(){
        score = $('.score',this).html();
        shotsarray.push(score);
      });
      $.get("register.php", { action: 'add', type: $('.type li.exclude').html(), name: $('select.choose_shooter option:selected').val(), shots: shotsarray },
        function(data){
          console.log(data);
          $('.message').show().html(data).delay(1000).fadeOut('slow',function(){
            $(this).html(' ');
          });

        });
      //window.location.href='mailto:troelslenda@gmail.com?subject=Skyderesultater for ' + $(this).html() +'&body=Point:'+$('.total').html()+' Krydser: '+$('.bulls').html();
      $('.history li').remove();
      $('.type li').removeClass('exclude');
      updateScore();
      $('.controls, .panel').show();
      $('.shooters').hide();
      $('.type').hide();
    });
  }


$('.add_shooter').click(function(){
  $.get("register.php", { action: 'add_shooter', name: $('.shooter_name').val() },
    function(data){
      console.log(data);
      $('.shooter_name').val('')
      $('.message').show().html(data).delay(1000).fadeOut('slow',function(){

      });

    });

  });



  $('.menu a[href="#results"]').click(function(e){
    e.preventDefault();
    $('.page > *').hide();
    $('.result-shower').show();
    loadHistory();
  });
  $('.menu a[href="#collect"]').click(function(e){
    e.preventDefault();
    $('.page > *').hide();
    $('.collect').show();

  });
  $('.menu a[href="#settings"]').click(function(e){
    e.preventDefault();
    $('.page > *').hide();
    $('.settings').show();

  });

  $('.page > *').hide();
  $('.collect').show();
  enterShoot();

});

