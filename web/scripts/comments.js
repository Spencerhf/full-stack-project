$( document ).ready(function() {

    function displayUsername() {

        let user = sessionStorage.getItem( 'username' );

        document.getElementById('displayUsername').innerHTML = user;

    }
    displayUsername();

})