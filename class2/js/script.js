/** Add like alert **/
$('#like').click(function() {
    alert('Thanks!')
});
/** Paint background black **/
$('#makeBlack').click(function() {
    $('#profile').css('background-color', 'black')
    $('p,h1,h2,h3,h4').css('color', 'white')
});
/** Paint background blue **/
$('#makeBlue').click(function() {
    $('#profile').css('background-color', 'blue')
    $('p,h1,h2,h3,h4').css('color', 'white')
});
/** Paint background white **/
$('#makeWhite').click(function() {
    $('#profile').css('background-color', 'white')
    $('p,h1,h2,h3,h4').css('color', 'black')
});
var myNumber = 1;

$('#showNumber').click(
    function() {
        myNumber = Math.floor(Math.random() * 10) + 1;
        $('#myNumber').text(myNumber);
    }
);

$('#startOver').click(
    function() {
        myNumber = '?';
        $('#myNumber').text(myNumber);
    });
