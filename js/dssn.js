// constructor
function DSSN(){
	// events
	// external done loading event
	this.READY = "DSSNReady";
	// internal done loading event
	this.FINISHED = "DSSNFinished";
		
	// data store
	this.user;
	this.knows;
	this.feed;
	// temp var
	this.temp;
	
	// curren user
	this.userURI;

	// rdf2json converter uri
	this.rdf2json = "http://rdf2json.aksw.org/?url=";
	// server proxy
	this.ajaxproxy = "http://localhost/MobileDSSN/serverside/proxy.php?url=";
}

// local store instance
DSSN.prototype.ls = new Store('dssn');

// user model
DSSN.prototype.userModel = Backbone.Model.extend({
	localStorage: DSSN.prototype.ls ,
	initialize: function(){
		var self = this;
		this.bind('change:id', function(model, id) {
			var lm = self.localStorage.find(model);
			if( typeof lm != 'undefined' ){
				self.attributes = lm;
				self.attributes.local = true;
			}
		});
	},
	defaults: {
		'local': false
	}
});

// foaf:knows collection
DSSN.prototype.knowsCollection = Backbone.Collection.extend({
	model: DSSN.prototype.userModel
});

// loads profile into profile model
DSSN.prototype.loadProfile = function(resourceURI, internal){
	internal = internal || false;
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
	
	var user = new self.userModel();
	user.set({'id': resourceURI});
	
	if( user.get('local') ){
		if( internal ){
			self.temp = user;
			self.trigger(self.FINISHED);
		}else{
			self.user = user;
			self.trigger(self.READY);
		}
	}else{
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
			user.set({
				'uri': resourceURI,
				'nicknames': nicks,
				'userpics': pics,
				'birthdays': bdays,
				'weblogs': weblogs,
				'streams': streams,
				'knows': knows
			});
			user.save();
			
			if( internal ){
				self.temp = user;
				self.trigger(self.FINISHED);
			}else{
				self.user = user;
				self.trigger(self.READY);
			}
		});
	};
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
	
	self.knows = new self.knowsCollection();
	
	var i = knows.length-1;

	self.bind(self.FINISHED, function(event){
		self.knows.add(self.temp);
			
		if( --i < 0 ){
			self.unbind(self.FINISHED);
			self.trigger(self.READY);
		}else{
			self.loadProfile(knows[i], true);
		}
	});
		
	self.loadProfile(knows[i], true);
}

DSSN.prototype.loadFeed = function(uri){
	var reqURL = this.ajaxproxy+uri;
	
	var self = this;
	
	// load feed
	$.getFeed({
        url: reqURL,
        success: function(feed) {
        	self.feed = {
        		'title': feed.title,
        		'link': feed.link,
        		'items': feed.items
        	}
        
            self.trigger(self.READY);
        }
    });
}

// create new dssn controller
var dssn = new DSSN();
// extend with events
_.extend(dssn, Backbone.Events);
