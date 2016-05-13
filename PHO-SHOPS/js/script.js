var myMapData = [
	{
		name: "PHO #1",
		coord: [ 40.71577741296778, -74.00184631347656 ]
  },
	{
		name: "PHO #79",
		coord: [ 40.747777160820704, -73.98605346679688 ]
  },
	{
		name: "PHO #54",
		coord: [ 40.714736512395284, -73.93352508544922 ]
  },
];

var eastRiver = [ 40.706913, -73.987513 ];
var upperWestSide = [ 40.788129, -73.974509 ];
var myZoom = 11;

//create layer for base map
var layer = L.tileLayer( 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
} );

//now the fun stuff:  leaflet!
var map = L.map( 'mapNYC' ).setView( eastRiver, myZoom );
map.addLayer( layer );

myMapData.forEach( function ( element ) {
	var marker = L.marker( element.coord ).addTo( map );
	marker.bindPopup( "<b>Want some noddle soup?</b><br>Check out " + element.name );
} );