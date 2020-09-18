$(document).ready(function() {

    function displayUsername() {

        let user = sessionStorage.getItem( 'username' );

        document.getElementById('displayUsername').innerHTML = user;

    }

    function logOut() {
        let btn = document.getElementById('log-out-btn');

        btn.addEventListener('click', function() {
            sessionStorage.removeItem('userId');
            

        })
    } 
    
    displayUsername();

})