$(function(){
	// do rendering on show
	$("#profileEditPage").live('pageshow', function(){
		var props = dssn.userData.attributes;
		
		console.log(props);
	});
});