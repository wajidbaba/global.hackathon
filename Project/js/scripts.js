$(document).ready(function(){

	var tos = getParam('search');
	if ( tos !== null ){
		analyze(tos);
		$('#search').val(tos);
	}

	$('#search').keypress(function (e) {
		if (e.which == 13) {
			var tos = $('#search').val();
			if ( tos === "" ){
				location.href = location.href.split("?")[0];
			} else {
				location.href = location.href+'?search='+tos;
			}
			return false;
		}
	});

	$('#link2results a').on('click',function(e){
		e.preventDefault();
		$.ajax({
			type: 'GET',
			url: 'https://d702e9dc-619fec6b2bb0.my.apitools.com/write/get?url='+tos,
			beforeSend: function(xhr){
				xhr.setRequestHeader('X-Mashape-Key','ieeRodAhB6msh7pNcf1KHusSKhESp1njNqkjsnfkVPPsYlHdJx')
			},
			success: function(data){
				if ( data.success ) {
					$('#link2results > input')
					.css({
						padding: '5px',
						border: '1px solid #eee',
						height: 'auto'
					})
					.val(data.data.url)
					.animate({width:180},'fast',function(){
						$('#link2results > input').select();
						$('#link2results > input').tooltip('show');
					})
					.blur(function(){
						$('#link2results > input').animate({width:0},'fast',function(){
							$('#link2results > input').attr('style','').val('');
						});
						$('#link2results > input').tooltip('hide');
					});
				} else {
					console.log(data)
				}
			},
			error: function(error){
				console.log(error);
			},
			complete: function(){
				console.log('Call to runa.ga complete!');
			}
		})
		return false;
	});

	$('[data-toggle="tooltip"]').tooltip();

});

function analyze(tos){
	$('#link2results').hide();	
	$.getJSON('https://tosdr.org/api/1/service/'+tos+'.json').done(function(data){
		console.log(data.pointsData);
		$('#results').empty();
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
				} else if ( this.tosdr.point === "neutral" ){
					$('#results').append('' + 
					'<div class="result">' + 
						'<h2>' + 
	    					'<span class="label label-info"><span class="glyphicon glyphicon-flag"></span></span>' +
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
			});
		$('#link2results').show();
	});	
}

// From StackOverflow username: David
// http://stackoverflow.com/a/11582513/142225
function getParam(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}