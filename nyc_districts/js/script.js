var width = window.innerWidth,
	height = window.innerHeight;

var svg = d3.select( "body" )
	.append( "svg" )
	.attr( "width", width )
	.attr( "height", height );

var projection = d3.geo.albers()
	.scale( 190000 )
	.rotate( [ 71.057, 0 ] )
	.center( [ 0, 42.313 ] )
	.translate( [ width / 2, height / 2 ] );

var geoPath = d3.geo.path()
	.projection( projection );

var g = svg.append( "g" );

g.selectAll( "path" )
	.data( neighborhoods_json.features )
	.enter()
	.append( "path" )
	.attr( "d", geoPath )
	.attr( "class", "neighborhoods" )
	.on( 'mouseover', function ( d ) {
		d3.select( 'h2' ).text( d.properties.NAME );
		d3.select( this ).attr( 'class', 'neighborhood hover' );
	} )
	.on( 'mouseout', function ( d ) {
		d3.select( 'h2' ).text( '' );
		d3.select( this ).attr( 'class', 'neighborhoods' );
	} );
// .on( "hover", function () {
// 	d3.select( this ).fill( "darkslateblue" );
// .on( "click", function () {
// d3.select( this ).remove();
// d3.select( this ).fill: darkslateblue;
// } );