$(function(){
	var excludeProps = ['id', 'local', 'foaf:knows'];

	// do rendering on show
	$("#profileEditPage").live('pagebeforeshow', function(){
		var props = dssn.userData.attributes;
		
		var render = [];
		var item;
		console.log(props);
		for(var propname in props){
			if(excludeProps.indexOf(propname) == -1){
				console.log(propname, props[propname]);
				for(var i = 0; i < props[propname].length; i++){
					item = {
						id: propname.replace(":", ""),
						label: propname,
						predicate: propname,
						type: ( props[propname][i].indexOf("http:") != -1 ? "url" : "text" ),
						value: props[propname][i]
					};
					render.push(item);
				}
			}
		} 
		
		console.log(render);
		
		// render data
		$("#editTemplate").tmpl(render).appendTo("#content");
		
		// redraw page
		$("#profileEditPage").page('destroy').page();
	});
});

/*
<div data-role="fieldcontain">
				<label for="${id}">${label}:</label>
				<input type="${type}" name="${id}" id="${id}" data-predicate="${predicate}" value="${value}"  />
			</div>	
*/