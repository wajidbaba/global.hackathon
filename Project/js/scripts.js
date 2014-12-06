$(document).ready(function(){

	$('#search').keypress(function (e) {
		if (e.which == 13) {
			var service = $('#search').val();
			$.getJSON('https://tosdr.org/api/1/service/'+service+'.json').done(function(data){
	  			$('#result').text(JSON.stringify(data),undefined,3);
			});
			return false;
		}
	});

});
