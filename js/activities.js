$(function(){
	$("#activity-type").live('change', function(){
		//console.log('change to: '+$(this).val() );
		if( $(this).val() == "text" ){
			$("#link-holder").hide();
		}else{
			$("#link-holder").show();
		}
	});
});