function DSSN(){
	// events
	this.READY = "DSSNReady";
	
	// data
	this.user;

	// rdf2json converter uri
	this.rdf2json = "http://rdf2json.aksw.org/?url=";
	// server proxy
	this.ajaxproxy = "http://localhost/MobileDSSN/serverside/proxy.php?url=";
}

DSSN.prototype.loadProfile = function(resourceURI){
	// rdf-json uri
	var loadingURI = this.rdf2json+encodeURIComponent(resourceURI);
	
	// get vars from instance
	var self = this;
	var rdf2json = this.rdf2json;
	
	// create main rdf db
	var db = $.rdf();
	db.prefix('foaf', 'http://xmlns.com/foaf/0.1/');
	db.prefix('aair', 'http://xmlns.notu.be/aair#');
	db.prefix('dssn', 'http://purl.org/net/dssn/');
	
	// get profile
	$.getJSON(loadingURI, function(data){
		// load data into main db
		db.load(data);
		
		// get depiction
		var pics = self.getValuesForProperty(db, "foaf:depiction");
		//$("#user_image").attr('src', pics[0]);
		
		// get name
		var nicks = self.getValuesForProperty(db, "foaf:nick");
		//$("#user_name").text(names[0]);
		
		//get bday
		var bdays = self.getValuesForProperty(db, "foaf:birthday");
		//$("#user_bday").text(bdays[0]);
		
		//get weblog
		var weblogs = self.getValuesForProperty(db, "foaf:weblog");
		//$("#user_weblog").html("<a href='"+weblogs[0]+"'>"+weblog[0]+"</a>");
		
		// get activity streams
		var streams = self.getValuesForProperty(db, "dssn:activityFeed");
		
		// get knows uris
		var knows = self.getValuesForProperty(db, "foaf:knows");

		// create user object		
		self.user = {
			'nicks': nicks,
			'pics': pics,
			'bdays': bdays,
			'weblogs': weblogs,
			'streams': streams,
			'knows': knows
		};
		$(document).trigger(self.READY, [self.user]);
	})
}

/** 
 * Gets all values for property from given DB
 */
DSSN.prototype.getValuesForProperty = function(db, property){
	var values = [];
	// get depiction
	db.where("?s "+property+" ?property").each(function(){
		var property = this.property.value.toString();
		values.push(property);
	});
	
	return values;
}

/** 
 * Gets all foaf:knows persons from given db
 */
DSSN.prototype.getKnowsPeople = function(knows){
	var rdf2json = this.rdf2json;
	var self = this;
	
	var res = [];
	
	var i = knows.length;
	$.each(knows, function(index, value){
		var user = value;
		var dataURL = rdf2json+encodeURIComponent(user);
		$.getJSON(dataURL, function(data){
			var userdb = $.rdf();
			userdb.load(data);
			userdb.prefix('foaf', 'http://xmlns.com/foaf/0.1/');
			userdb.prefix('aair', 'http://xmlns.notu.be/aair#');
			
			var names = self.getValuesForProperty(userdb, "foaf:nick");
			$.each(names, function(i, val){
				res.push({name:val, uri:value});
			});
			
			if( --i == 0 ) $(document).trigger(self.READY, [res]);
		});
	});
}

DSSN.prototype.loadFeed = function(uri){
	var reqURL = this.ajaxproxy+uri;
	
	var self = this;
	
	// load feed
	$.getFeed({
        url: reqURL,
        success: function(feed) {
        	var data = {
        		'title': feed.title,
        		'link': feed.link,
        		'items': feed.items
        	}
        
            $(document).trigger(self.READY, [data]);
        }
    });
}
