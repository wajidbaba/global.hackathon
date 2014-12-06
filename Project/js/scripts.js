$(document).ready(function(){

	$('#search').keypress(function (e) {
		if (e.which == 13) {
			var service = $('#search').val();
			$.getJSON('https://tosdr.org/api/1/service/'+service+'.json').done(function(data){
	  			$.each(data.pointsData,function(){
	  				if ( this.tosdr.point === "good" ){
	  					$('#results').append('' + 
							'<div class="result">' + 
            					'<h2>' + 
                					'<span class="label label-success"><span class="glyphicon glyphicon-ok"></span></span>' +
                					this.title +
                				'</h2>' +
                				'<p>' +
                					this.tosdr.tldr +
                				'</p>' +
                			'</div>' +
	  					'');
	  				} else if ( this.tosdr.point === "bad" ){
	  					$('#results').append('' + 
							'<div class="result">' + 
            					'<h2>' + 
                					'<span class="label label-warning"><span class="glyphicon glyphicon-warning-sign"></span></span>' +
                					this.title +
                				'</h2>' +
                				'<p>' +
                					this.tosdr.tldr +
                				'</p>' +
                			'</div>' +
	  					'');
	  				} else {
	  					$('#results').append('' + 
							'<div class="result">' + 
            					'<h2>' + 
                					'<span class="label label-danger"><span class="glyphicon glyphicon-remove"></span></span>' +
                					this.title +
                				'</h2>' +
                				'<p>' +
                					this.tosdr.tldr +
                				'</p>' +
                			'</div>' +
	  					'');
	  				}
	  			})
			});
			return false;
		}
	});

});
