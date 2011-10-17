$(function(){
	var counter;

	$("#sync").live('vclick', function(){
		// show loader
		$.mobile.showPageLoadingMsg();
	
		var network = dssn.knows;
		
		counter = network.length;
		
		network.each(function(item){
			var name = item.get("foaf:nick")[0],
			var photo = item.get("foaf:depiction")[0],
			var weblog = item.get("foaf:weblog")[0],
			var bday = item.get("foaf:birthday")[0]
			
			// create contact
			var contact = navigator.contacts.create({"displayName": name});
			contact.birthday = bday;
			// urls
			var urls = [new ContactField('url', weblog, true)];
			contact.urls = urls;
			// photos
			var photos = [new ContactField('photo', photo, true)];
			contact.photos = photos;
			
			// save to device
			contact.save(onSaveComplete, onSaveError);
			
			counter--;
		});
	});
	
	var onSaveComplete = function(){
		if(counter <= 0){
			$.mobile.changePage("network.html");
			alert("Contacts synced!");
		}
	}
	
	var onSaveError = function(error){
		switch(error.code){
			case ContactError.UNKNOWN_ERROR:
				alert("Could not save contact! Unknown Error!");
				break;
			case ContactError.INVALID_ARGUMENT_ERROR:
				alert("Could not save contact! Invalid argument Error!");
				break;
			case ContactError.TIMEOUT_ERROR:
				alert("Could not save contact! Timeout Error!");
				break;
			case ContactError.PENDING_OPERATION_ERROR:
				alert("Could not save contact! Pending operation Error!");
				break;
			case ContactError.IO_ERROR:
				alert("Could not save contact! IO Error!");
				break;
			case ContactError.NOT_SUPPORTED_ERROR:
				alert("Could not save contact! Not supported Error!");
				break;
			case ContactError.PERMISSION_DENIED_ERROR:
				alert("Could not save contact! Unknown Error!");
				break;
		}
	}
});