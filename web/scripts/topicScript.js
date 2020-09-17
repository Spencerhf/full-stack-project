$(document).ready(function() {

    function shortenTime() {
        $.get('/forums/1/topics', function(data) {
            console.log(data);
        })
    }

    //shortenTime();
})