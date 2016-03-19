var basemapUrl = 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';
var attribution = '&copy; <a href="http://www.openstreetmap.org/copyright"> OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a> | Source: <a href="https://nycopendata.socrata.com/Transportation/Subway-Entrances/drex-xx56/about">NYCOpenData</a>';
//initialize map
var map = L.map( 'map', {
        scrollWheelZoom: false,
        zoomControl: true,
    } )
    .setView( [ 40.722803, -73.914642 ], 12 );
//CartoDB Basemap
L.tileLayer( basemapUrl, {
        attribution: attribution
    } )
    .addTo( map );
console.log( "hello" );
//load data