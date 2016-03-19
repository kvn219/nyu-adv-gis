var margin = {
	top: 10,
	right: 20,
	bottom: 30,
	left: 100
};

//Map dimensions (in pixels)
var width = 800,
	height = 600;

var svg = d3.select( "#map" )
	.append( "svg" )
	.attr( "width", width )
	.attr( "height", height )
	.append( "g" )
	.attr( "transform", "translate(" + margin.left + "," + margin.top + ")" );

//Map projection
var projection = d3.geo.conicEqualArea()
	.scale( 77423.06161113291 )
	.center( [ -73.92389357849065, 40.69483904240502 ] ) //projection center
	.parallels( [ 40.496133987610385, 40.91553277650213 ] ) //parallels for conic projection
	.rotate( [ 73.92389357849065 ] ) //rotation for conic projection
	.translate( [ -66755.26684646154, -29714.320463485623 ] ); //translate to center the map in view

var geoPath = d3.geo.path()
	.projection( projection );

queue()
	.defer( d3.json, "data/nyc_school_districts.geojson" )
	.await( ready );

function ready( error, neighborhoods ) {
	svg.append( "g" )
		.selectAll( "path" )
		.data( neighborhoods.features )
		.enter()
		.append( "path" )
		.attr( "d", geoPath )
		.attr( "class", "neighborhood" )
		.on( "mouseover", function ( d ) {
			d3.select( "h2" )
				.text( d.properties[ '@id' ] );
			d3.select( this )
				.attr( "class", "neighborhood hover" );
		} )
		.on( "mouseout", function ( d ) {
			d3.select( "h2" )
				.text( "Select a district" );
			d3.select( this )
				.attr( "class", "neighborhood" );
		} );
}