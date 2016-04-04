// set margin for graph
var margin = {
    top: 5,
    right: 5,
    bottom: 5,
    left: 5
};
// get user screen size
var width = window.innerWidth + margin.left - margin.right - 300,
    height = window.innerHeight + margin.top - margin.bottom,
    centered;
// parser units
var formatPercent = d3.format( ".2%" );
var formatIndex = d3.format( ".2f" );
// set color palette for chlorethpth map
var color = d3.scale.quantize()
    .domain( [ 0.0, 1.1 ] )
    .range( [ "#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d" ] );
// path for map
var path = d3.geo.path()
    .projection( null );
// select and append to body
var svg = d3.select( "body" )
    .append( "svg" )
    .attr( "width", width )
    .attr( "height", height );
// append rectangle for zoom effect
svg.append( "rect" )
    .attr( "class", "background" )
    .attr( "width", width )
    .attr( "height", height )
    .on( "click", clicked );
// append
var g = svg.append( "g" );
// place data on a queue
queue()
    .defer( d3.json, "data/ny.json" )
    .defer( d3.csv, 'data/data.csv' )
    .await( ready );
// load data
function ready( error, ny, data ) {
    if ( error ) throw error;
    // create empty objects for data fields
    var TractByID = {};
    var TractByName = {};
    var GeoID = {};
    var DiversityIndex = {};
    var CountyName = {};
    var NonHispanicWhite = {};
    var NonHispanicBlack = {};
    var NonHispanicAmericanIndian = {};
    var NonHispanicAsian = {};
    var NonHispanicPacificIslander = {};
    var NonHispanicOther = {};
    var NonHispanicTwoOrMoreRaces = {};
    var HispanicWhite = {};
    var HispanicBlack = {};
    var HispanicAmericanIndian = {};
    var HispanicAsian = {};
    var HispanicPacificIslander = {};
    var HispanicOther = {};
    var HispanicTwoOrMoreRaces = {};
    // iterate through data being passed in and save it to objects created above
    data.forEach( function ( d, i ) {
        TractByID[ d.id ] = d.id;
        TractByName[ d.id ] = d.TRACT;
        GeoID[ d.id ] = d.GEOID;
        DiversityIndex[ d.id ] = d.DIVERSITY_INDEX;
        CountyName[ d.id ] = d.COUNTY;
        NonHispanicWhite[ d.id ] = d[ 'Non-Hispanic White' ];
        NonHispanicBlack[ d.id ] = d[ 'Non-Hispanic Black' ];
        NonHispanicAmericanIndian[ d.id ] = d[ 'Non-Hispanic American Indian' ];
        NonHispanicAsian[ d.id ] = d[ 'Non-Hispanic Asian' ];
        NonHispanicPacificIslander[ d.id ] = d[ 'Non-Hispanic Pacific Islander' ];
        NonHispanicOther[ d.id ] = d[ 'Non-Hispanic Other' ];
        NonHispanicTwoOrMoreRaces[ d.id ] = d[ 'Non-Hispanic Two or More Races' ];
        HispanicWhite[ d.id ] = d[ 'Hispanic White' ];
        HispanicBlack[ d.id ] = d[ 'Hispanic Black' ];
        HispanicAmericanIndian[ d.id ] = d[ 'Hispanic American Indian' ];
        HispanicAsian[ d.id ] = d[ 'Hispanic Asian' ];
        HispanicPacificIslander[ d.id ] = d[ 'Hispanic Pacific Islander' ];
        HispanicOther[ d.id ] = d[ 'Hispanic Other' ];
        HispanicTwoOrMoreRaces[ d.id ] = d[ 'Hispanic Two or More Races' ];
    } );
    // acess ny objects
    var tracts = ny.objects.tracts;
    // filter waterlines from the map
    tracts.geometries = tracts.geometries
        .filter( function ( d ) {
            return ( d.id.slice( 5 ) / 10000 | 0 ) !== 99;
        } );

    g.append( "g" )
        .attr( "id", "tracts" )
        .selectAll( "path" )
        .data( topojson.feature( ny, tracts )
            .features )
        .enter()
        .append( "path" )
        .attr( "d", path )
        .style( "fill", function ( d ) {
            return color( DiversityIndex[ d.id ] );
        } )
        .on( "click", clicked )
        .on( "mouseover", function ( d, i ) {
            d3.select( "h2" )
                .html(
                    "<p id='text'><b>Hover</b> over a tract to get infomation. <b>Click</b> a tract to zoom in, <b>click on the same</b> tract to zoom out. For best quality, use full screen.</p>" +
                    "<p id='text'> Over the past 30 years, an interesting phenomenon has taken shape in education systems in the United States: public schools have become increasingly racially segregated, despite rising levels of national diversity. While previous studies link greater diversity to better student performance, the focus remains largely on diversity in the classroom. Yet a large educational and psychological body of literature suggests that relational diversity large.</p>" +
                    "<p id='sectionhead'>" + TractByName[ d.id ] + '</p>' +
                    "<p id='sectionhead2'>" + CountyName[ d.id ] + '</p>' +
                    "<p id='sectionhead2'>" + "Diversity Index: " + formatIndex( DiversityIndex[ d.id ] ) + "</p>" +
                    '<table>' + '<tr>' +
                    '<th>' + 'Origin' + '</th>' +
                    '<th>' + 'Non-Hispanic' + '</th>' +
                    '<th>' + 'Hispanic' + '</th>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' + 'White' + '</td>' +
                    '<td>' + formatPercent( NonHispanicWhite[ d.id ] ) + '</td>' +
                    '<td>' + formatPercent( HispanicWhite[ d.id ] ) + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' + 'Black' + '</td>' +
                    '<td>' + formatPercent( NonHispanicBlack[ d.id ] ) + '</td>' +
                    '<td>' + formatPercent( HispanicBlack[ d.id ] ) + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' + 'American Indian' + '</td>' +
                    '<td>' + formatPercent( NonHispanicAmericanIndian[ d.id ] ) + '</td>' +
                    '<td>' + formatPercent( HispanicAmericanIndian[ d.id ] ) + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' + 'Asian' + '</td>' +
                    '<td>' + formatPercent( NonHispanicAsian[ d.id ] ) + '</td>' +
                    '<td>' + formatPercent( HispanicAsian[ d.id ] ) + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' + 'Pacific Islander' + '</td>' +
                    '<td>' + formatPercent( NonHispanicPacificIslander[ d.id ] ) + '</td>' +
                    '<td>' + formatPercent( HispanicPacificIslander[ d.id ] ) + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' + 'Other' + '</td>' +
                    '<td>' + formatPercent( NonHispanicOther[ d.id ] ) + '</td>' +
                    '<td>' + formatPercent( HispanicOther[ d.id ] ) + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' + 'Two or More Races ' + '</td>' +
                    '<td>' + formatPercent( NonHispanicTwoOrMoreRaces[ d.id ] ) + '</td>' +
                    '<td>' + formatPercent( HispanicTwoOrMoreRaces[ d.id ] ) + '</td>' + '</tr>' + '</table>' +
                    "<p id='text'>" + "<br/>" +
                    "We believe the discrepancy of diversity experienced in one’s surroundings versus the classroom - is an important factor in educational performance. Using the census data on population origin by census tracts across New York State, this map visualizes diversity as measured with the <a href='https://en.wikipedia.org/wiki/Diversity_index'>Diversity Index</a> or better known as the Blau's Index. In sociology, psychology and management studies the index is often known as Blau's Index, as it was introduced into the literature by the sociologist Peter Blau." +
                     "<div id='source'>" + "Source: American Community Survey 5-Year Data (09 - 13) </div> </p>"
                );
            d3.select( this )
                .style( "fill", "#6C7A89" );
        } )
        .on( "mouseout", function ( d, i ) {
            d3.select( "h2" )
                .html(
                    "<p id='text'><b>Hover</b> over a tract to get infomation. <b>Click</b> a tract to zoom in, <b>click on the same</b> tract to zoom out. For best quality, use full screen.</p>"+
                    "<p id='text'> Over the past 30 years, an interesting phenomenon has taken shape in education systems in the United States: public schools have become increasingly racially segregated, despite rising levels of national diversity. While previous studies link greater diversity to better student performance, the focus remains largely on diversity in the classroom. Yet a large educational and psychological body of literature suggests that relational diversity large.</p>" +
                    "<p id='sectionhead'>" + 'Census Tract' + '</p>' +
                    "<p id='sectionhead2'>" + 'County' + '</p>' +
                    "<p id='sectionhead2'>" + "Diversity Index: " + " " + "</p>" +
                    '<table>' + '<tr>' +
                    '<th>' + 'Origin' + '</th>' +
                    '<th>' + 'Non-Hispanic' + '</th>' +
                    '<th>' + 'Hispanic' + '</th>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' + 'White' + '</td>' +
                    '<td>' + ' ' + '</td>' +
                    '<td>' + ' ' + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' + 'Black' + '</td>' +
                    '<td>' + ' ' + '</td>' +
                    '<td>' + ' ' + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' + 'American Indian' + '</td>' +
                    '<td>' + ' ' + '</td>' +
                    '<td>' + ' ' + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' + 'Asian' + '</td>' +
                    '<td>' + ' ' + '</td>' +
                    '<td>' + ' ' + ' </td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' + 'Pacific Islander' + '</td>' +
                    '<td>' + ' ' + '</td>' +
                    '<td>' + ' ' + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' + 'Other' + '</td>' +
                    '<td>' + ' ' + '</td>' +
                    '<td>' + ' ' + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' + 'Two or More Races ' + '</td>' +
                    '<td>' + ' ' + '</td>' +
                    '<td>' + ' ' +
                    '</td>' + '</tr>' + '</table>' +
                    "<p id='text'>" + "<br/>" +
                    "We believe the discrepancy of diversity experienced in one’s surroundings versus the classroom - is an important factor in educational performance. Using the census data on population origin by census tracts across New York State, this map visualizes diversity as measured with the <a href='https://en.wikipedia.org/wiki/Diversity_index'>Diversity Index</a> or better known as the Blau's Index. In sociology, psychology and management studies the index is often known as Blau's Index, as it was introduced into the literature by the sociologist Peter Blau." +
                     "<div id='source'>" + "Source: American Community Survey 5-Year Data (09 - 13) </div> </p>"
                );
            d3.select( "#tooltip" )
                .remove();
            d3.select( this )
                .transition()
                .duration( 250 )
                .style( "fill", function ( d ) {
                    var population = DiversityIndex[ d.id ];
                    console.log( population );
                    if ( population ) {
                        return color( population );
                    } else {
                        return "#ddd";
                    }
                } );
        } );

    g.append( "path" )
        .datum( topojson.mesh( ny, tracts, function ( a, b ) {
            return a !== b;
        } ) )
        .attr( "id", "tract-borders" )
        .attr( "d", path );

    d3.selectAll( "#tracts" )
        .selectAll( "path" )
        .style( "fill", function ( d ) {
            return color( DiversityIndex[ d.id ] );
        } );
}

function clicked( d ) {
    var x, y, k;

    if ( d && centered !== d ) {
        var centroid = path.centroid( d );
        x = centroid[ 0 ];
        y = centroid[ 1 ];
        k = 10;
        centered = d;
    } else {
        x = width / 2;
        y = height / 2;
        k = 1;
        centered = null;
    }

    g.selectAll( "path" )
        .classed( "active", centered && function ( d ) {
            return d == centered;
        } );

    g.transition()
        .duration( 700 )
        .attr( "transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")" )
        .style( "stroke-width", 1.5 / k + "px" );
}

d3.select( self.frameElement )
    .style( "height", height - 500 + "px" );

$( "svg" )
    .css( {
        top: 70,
        left: 300,
        right: 50,
        bottom: 30,
        position: 'absolute'
    } );
