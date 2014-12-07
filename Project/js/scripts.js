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
			url: 'https://d702e9dc-619fec6b2bb0.my.apitools.com/write/get?url='+location.href,
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

	$('#feedbackModal').on('show.bs.modal',function(){
		$('#turnOnFM').on('click',function(e){
			e.preventDefault();

			// Setup new buttons in footer
			$('#footer .enable-feedback-mode').addClass('hidden');
			$('#footer .feedback-mode-actions').removeClass('hidden');
			$('#footer .feedback-mode-actions .btn-default').on('click',function(e){
				e.preventDefault();
				$('#results .feedback-overlay').remove();
				$('#footer .enable-feedback-mode').removeClass('hidden');
				$('#footer .feedback-mode-actions').addClass('hidden');
				return false;
			});
			$('#footer .feedback-mode-actions .btn-info').on('click',function(e){
				e.preventDefault();
				// Gather feedback
				var urlFeedback = {};
				var resultFeedback = {}
				$('#results .result').each(function(){
					if ( $(this).data('rating') !== $(this).data('feedback') ){
						 resultFeedback[$(this).data('id')] = {
							rating: $(this).data('rating'),
							feedback: $(this).data('feedback')
						}
						urlFeedback[$('#search').val()] = resultFeedback;
					} else {
						return true;
					}
				});
				feedback = JSON.stringify(urlFeedback);
				// Submit to Sprint.ly
				$.ajax({
					type: 'POST',
					url: 'https://sprint.ly/api/products/26087/items.json',
					data: {
						type: 'defect',
						title: 'User Feedback '+Date.now(),
						description: feedback,
					},
					beforeSend : function(xhr) {
				 		 xhr.setRequestHeader('Authorization', 'Basic ' + btoa('jbonds@gmail.com:kCM4Kcyjk49E6zpmhfxRpMYQhe72kfda'));
					},
					success: function(data){
						$('#results .feedback-overlay').remove();
						$('#footer .enable-feedback-mode').removeClass('hidden');
						$('#footer .feedback-mode-actions').addClass('hidden');
						$('#footer .get-involved h3').after('<p><em>Thanks for your feedback!</em></p>');
					},
					error: function(error){
						console.log(error)
					},
					complete: function(){ console.log('Feedback add complete!'); }
				});
				// Turn off Feedback Mode
				$('#results .feedback-overlay').remove();
				$('#footer .enable-feedback-mode').removeClass('hidden');
				$('#footer .feedback-mode-actions').addClass('hidden');
				return false;
			});
			
			// Setup hover for each result
			$('#results .result').each(function(){
				var $r = $(this);
				$r.append('<div class="feedback-overlay"><a class="up" href="#"><span class="glyphicon glyphicon-arrow-up"></span></a><a class="down" href="#"><span class="glyphicon glyphicon-arrow-down"></span></a>');
				var $f = $(this).find('.feedback-overlay');
				$('.up',$f).on('click',function(e){ 
					e.preventDefault();
					$(this).animate({opacity:0},0,function(){
						$(this).animate({opacity:1},500);
					});
					var curFeedback = parseInt($r.data('feedback'));
					$r.data('feedback',curFeedback+1);
					return false;
				});
				$('.down',$f).on('click',function(e){
					e.preventDefault();
					$(this).animate({opacity:0},0,function(){
						$(this).animate({opacity:1},500);
					});
					var curFeedback = parseInt($r.data('feedback'));
					$r.data('feedback',curFeedback-1);
					return false;
				});
			});

			// Close this modal
			$('#feedbackModal').modal('hide');

			return false;
		});
	});

	$('[data-toggle="tooltip"]').tooltip();

});

function analyze(tos){
	$('#link2results').hide();	
	$.getJSON('https://106c0301-619fec6b2bb0.my.apitools.com/1/service/'+tos+'.json').done(function(data){
		console.log(data.pointsData);
		$('#results').empty();
			$.each(data.pointsData,function(){
				if ( this.tosdr.point === "good" ){
					$('#results').append('' + 
					'<div class="result" data-id="'+this.id+'" data-rating="3" data-feedback="3">' + 
						'<h2>' + 
	    					'<span class="label label-success"><span class="glyphicon glyphicon-ok"></span></span>' +
	    					this.title +
	    				'</h2>' +
	    				'<p>' +
	    					this.tosdr.tldr +
	    				'</p>' +
	    			'</div>' +
					'');
				} else if ( this.tosdr.point === "neutral" ){
					$('#results').append('' + 
					'<div class="result" data-id="'+this.id+'" data-rating="2" data-feedback="2">' + 
						'<h2>' + 
	    					'<span class="label label-primary"><span class="glyphicon glyphicon-flag"></span></span>' +
	    					this.title +
	    				'</h2>' +
	    				'<p>' +
	    					this.tosdr.tldr +
	    				'</p>' +
	    			'</div>' +
					'');
				} else if ( this.tosdr.point === "bad" ){
					$('#results').append('' + 
					'<div class="result" data-id="'+this.id+'" data-rating="1" data-feedback="1">' + 
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
					'<div class="result" data-id="'+this.id+'" data-rating="0" data-feedback="0">' + 
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