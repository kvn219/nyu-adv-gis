var basemapUrl = 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';
var attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';

//initialize map1
var map1 = L.map( 'map1', {
	scrollWheelZoom: false
} ).setView( [ 40.706913, -73.987513 ], 5 );

//CartoDB Basemap
L.tileLayer( basemapUrl, {
	attribution: attribution
} ).addTo( map1 );

//load external geojson
$.getJSON( 'data/cities.geojson', function ( data ) {
	console.log( data );

	//define two different styles
	var lived_style = {
		radius: 10,
		fillColor: "#3366ff",
		color: "#FFF",
		weight: 2,
		opacity: 1,
		fillOpacity: 0.8
	};

	var not_lived_style = {
		radius: 10,
		fillColor: "#ff3300",
		color: "#FFF",
		weight: 2,
		opacity: 1,
		fillOpacity: 0.8
	};


	L.geoJson( data, {
		//calling L.geoJson with pointToLayer as an option will automatically add markers to the map from our data
		pointToLayer: function ( feature, latlng ) {

			console.log( feature );
			if ( feature.properties.chris_lived_here == "true" ) {
				return L.circleMarker( latlng, lived_style );

			} else {
				return L.circleMarker( latlng, not_lived_style );
			}
		}
	} ).addTo( map1 );







} );

//map2 simply shows a geojson layer with polygons using NYC NTA data

//initialize map2
var map2 = L.map( 'map2', {
	scrollWheelZoom: false
} ).setView( [ 40.767802, -73.953266 ], 10 );

//CartoDB Basemap
L.tileLayer( basemapUrl, {
	attribution: attribution
} ).addTo( map2 );


$.getJSON( 'data/city_council.geojson', function ( nabe_data ) {
	L.geoJson( nabe_data ).addTo( map2 );
} )


//map 3 is a rebuild of this leaflet choropleth demo: http://leafletjs.com/examples/choropleth.html

//initialize map3
var map3 = L.map( 'map3', {
	scrollWheelZoom: false
} ).setView( [ 40.767802, -73.953266 ], 9 );

//CartoDB Basemap
L.tileLayer( basemapUrl, {
	attribution: attribution
} ).addTo( map3 );

var geojson;

//this function takes a value and returns a color based on which bucket the value falls between
function getColor( d ) {
	return d > 700000 ? '#0000cc' :
		d > 600000 ? '#BD0026' :
		d > 500000 ? '#E31A1C' :
		d > 350000 ? '#FC4E2A' :
		d > 300000 ? '#FD8D3C' :
		d > 250000 ? '#FEB24C' :
		d > 200000 ? '#FED976' :
		'#FFEDA0';
}

//this function returns a style object, but dynamically sets fillColor based on the data
function style( feature ) {
	return {
		fillColor: getColor( feature.properties.SUM_HH_pop ),
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7
	};
}

//this function is set to run when a user mouses over any polygon
function mouseoverFunction( e ) {
	var layer = e.target;

	layer.setStyle( {
		weight: 5,
		color: '#666',
		dashArray: '',
		fillOpacity: 0.7
	} );

	if ( !L.Browser.ie && !L.Browser.opera ) {
		layer.bringToFront();
	}

	//update the text in the infowindow with whatever was in the data
	console.log( layer.feature.properties.SUM_HH_pop );
	$( '#infoWindow' ).text( 'Total Household Population: ' + layer.feature.properties.SUM_HH_pop );

}

//this runs on mouseout
function resetHighlight( e ) {
	geojson.resetStyle( e.target );
}

//this is executed once for each feature in the data, and adds listeners
function onEachFeature( feature, layer ) {
	layer.on( {
		mouseover: mouseoverFunction,
		mouseout: resetHighlight
			//click: zoomToFeature
	} );
}


//all of the helper functions are defined and ready to go, so let's get some data and render it!

//be sure to specify style and onEachFeature options when calling L.geoJson().
$.getJSON( 'data/ny_county.geojson', function ( state_data ) {
	geojson = L.geoJson( state_data, {
		style: style,
		onEachFeature: onEachFeature
	} ).addTo( map3 );
} );

//initialize map4
var map4 = L.map( 'map4', {
	scrollWheelZoom: false
} ).setView( [ 40.706913, -73.987513 ], 10 );

//CartoDB Basemap
L.tileLayer( basemapUrl, {
	attribution: attribution
} ).addTo( map4 );

//load external geojson
$.getJSON( 'data/ny_county.geojson', function ( data ) {
	console.log( data );

	var burgerIcon = L.icon( {
		iconUrl: 'img/burger.png',
		iconSize: [ 37, 37 ], // size of the icon
		iconAnchor: [ 16, 37 ] // point of the icon which will correspond to marker's location
	} );
	var lawnMowerIcon = L.icon( {
		iconUrl: 'img/lawnmower.png',
		iconSize: [ 37, 37 ], // size of the icon
		iconAnchor: [ 16, 37 ] // point of the icon which will correspond to marker's location
	} );

	L.geoJson( data, {
		//calling L.geoJson with pointToLayer as an option will automatically add markers to the map from our data
		pointToLayer: function ( feature, latlng ) {

			console.log( feature );

			if ( feature.properties.chris_lived_here == "true" ) {
				return L.marker( latlng, {
						icon: burgerIcon
					} )
					.bindPopup( 'Chris has lived in ' + feature.properties.name );
			} else {
				return L.marker( latlng, {
						icon: lawnMowerIcon
					} )
					.bindPopup( 'Chris has not lived in ' + feature.properties.name );;
			}
		}
	} ).addTo( map4 );



} )