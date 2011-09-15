$(function(){
	var excludeProps = ['id', 'local', 'foaf:knows'];

	// do rendering on show
	$("#profileEditPage").live('pagebeforeshow', function(){
		var props = dssn.userData.attributes;
		var render = [];
		var item;
		
		for(var propname in props){
			if(excludeProps.indexOf(propname) == -1){
				for(var i = 0; i < props[propname].length; i++){
					item = {
						id: propname.replace(":", ""),
						label: propname.split(":")[1],
						predicate: propname,
						type: ( props[propname][i].indexOf("http:") != -1 ? "url" : "text" ),
						value: props[propname][i]
					};
					render.push(item);
				}
			}
		} 
		
		// render data
		$("#editTemplate").tmpl(render).appendTo("#content");
		
		// redraw page
		$("#profileEditPage").page('destroy').page();
	});
	
	$("#save").live('vclick', function(){
		// tripple arrays
		var toSave = [];
		var toDel = [];
		// user uri
		var subject = dssn.userURI;
		// update endpoint
		var epurl = dssn.userData.get("dssn:updateService")[0];
		// get default graph uri
		var graph = epurl.split('?')[1].replace("default-graph-uri=", "");
		
		$("#profileEditPage input").each(function(index,item){
			var defaultValue = $(item).data('value');
			var predicate = $(item).data('pred');
			var changedValue = $(item).val();
			
			if( changedValue != defaultValue ){
				dssn.updateLocalProfile(predicate, defaultValue, changedValue);
				
				toSave.push({s:subject, p:predicate, o:changedValue});
				toDel.push({s:subject, p:predicate, o:defaultValue});
			}
		});
		
		// form insert
		var addQuery = "INSERT DATA INTO <"+graph+"> { ";
		for(var i = 0; i < toSave.length; i++){
			if( toSave[i].o.indexOf('http:') != -1 ){
				addQuery += "<"+toSave[i].s+"> <"+dssn.prepareNs(toSave[i].p)+"> <"+toSave[i].o+"> . ";
			}else{
				addQuery += "<"+toSave[i].s+"> <"+dssn.prepareNs(toSave[i].p)+"> \""+toSave[i].o+"\" . ";
			}
		}
		// end insert
		addQuery += "} ";
		
		// form delete
		var delQuery = "DELETE DATA FROM <"+graph+"> { "
		for(var i = 0; i < toDel.length; i++){
			if( toDel[i].o.indexOf('http:') != -1 ){
				delQuery += "<"+toDel[i].s+"> <"+dssn.prepareNs(toDel[i].p)+"> <"+toDel[i].o+"> . ";
			}else{
				delQuery += "<"+toDel[i].s+"> <"+dssn.prepareNs(toDel[i].p)+"> \""+toDel[i].o+"\" . ";
			}
		}
		// end delete 
		delQuery += "} ";
		
		// create url &
		// form url with ajax proxy
		var url = dssn.ajaxproxy+encodeURIComponent( epurl + "&query=" + encodeURIComponent( delQuery ) );
		$.getJSON(url, function(data){
			console.log(data);
		});
		
		// create url &
		// form url with ajax proxy
		var url = dssn.ajaxproxy+encodeURIComponent( epurl + "&query=" + encodeURIComponent( addQuery ) );
		$.getJSON(url, function(data){
			console.log(data);
		});
		
		// save local
		dssn.userData.save();
		dssn.user = dssn.userData;
		
		console.log(dssn.userData, dssn.user);
		
		$.mobile.changePage("profile.html");
	});
});

/*

<script id="editTemplate" type="text/x-jquery-tmpl">
			<div data-role="fieldcontain">
				<label for="${id}">${label}:</label>
				<input type="${type}" name="${id}" id="${id}" data-value="${value}" data-pred="${predicate}" value="${value}"  />
			</div>	
		</script>




*/