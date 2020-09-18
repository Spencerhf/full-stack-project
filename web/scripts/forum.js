$(document).ready(function() {

<<<<<<< HEAD
    // To display the username
=======
>>>>>>> spencer
    function displayUsername() {

        let user = sessionStorage.getItem( 'username' );

<<<<<<< HEAD
        document.getElementById('displayUsername').innerHTML = "Hey, " + user;

    }
    displayUsername();

    
=======
        document.getElementById('displayUsername').innerHTML = user;

    }
>>>>>>> spencer

    function logOut() {
        let btn = document.getElementById('log-out-btn');

        btn.addEventListener('click', function() {
            sessionStorage.removeItem('userId');
            

        })
    } 
    
<<<<<<< HEAD
    
=======
    displayUsername();
>>>>>>> spencer

})