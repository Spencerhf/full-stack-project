$( document ).ready(function() {

    function displayUsername() {

        let user = sessionStorage.getItem( 'username' );

<<<<<<< HEAD
        document.getElementById('displayUsername').innerHTML = "Hey, " + user;
=======
        document.getElementById('displayUsername').innerHTML = user;
>>>>>>> spencer

    }
    displayUsername();

})