$(document).ready(function(){
	var resourceURI = "http://bob.lod2.eu/id/bob";
	var testURI = "http://localhost/MobileDSSN/rdf2json.php?url="+encodeURIComponent(resourceURI);
	
	var db = $.rdf();
	
	var triple;
	var subj, pred, obj_index;
	var options;
	$.getJSON(testURI, function(data){
		//console.log(data);
		db.load(data);
		
		var activity = db.where("?s <http://purl.org/net/dssn/activityFeed> ?stream");
		activity.each(function(){
			var stream = this.stream.value.toString();
			$("body").html("stream is "+stream);
			console.log(stream)
		})
		
		console.log(activity);
	})
});
