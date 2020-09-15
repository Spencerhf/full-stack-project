$( document ).ready(function() {

                            //The login function
    function login () {
        sessionStorage.clear();

                // login variables
        let username = document.getElementById('username');
        let password = document.getElementById('password');
        let email = document.getElementById('email');
        let firstName = document.getElementById('firstName');
        let lastName = document.getElementById('lastName');
        let emailDiv = document.getElementById('emailDiv');

                // Listener for submit button
        document.getElementById('submitBtn').addEventListener('click', function() {
            event.preventDefault();
             
                    // Login validation
            if(emailDiv.style.display == 'none') {
                if(username.value == '' || username.value == undefined || 
                   password.value == '' || password.value == undefined) {
                    alert('Please fill out all fields');
                } else {
                    $.post('http://localhost:3000/login', {
                        
                        "username": `${username.value}`,
                        "password": `${password.value}`

                    }, function( results ) {

                        alert("you're now logged in")
                        sessionStorage.setItem( 'userId', `${results[0].user_id}` );
                        let userLoggedIn = sessionStorage.getItem( 'userId' );    
                        console.log(results);

                        username.value = '';
                        password.value = '';

                        window.location = '../UserPage/Forums/index.html';
                        logInScreen(userLoggedIn);

                    }).fail(function() {
                        alert('No account found with that username or incorrect password');
                    })
                }
                
                    // Register validation
            } else {
                if( username.value == '' || username.value == undefined  || 
                   email.value == '' || email.value == undefined || 
                   password.value == '' || password.value == undefined ||
                   firstName.value == '' || firstName.value == undefined || 
                   lastName.value == '' || lastName.value == undefined ) {
                    alert('Please fill out all fields');
                } else {
                    $.post('http://localhost:3000/register', {

                        "email": `${email.value}`,
                        "username": `${username.value}`,
                        "first_name": `${firstName.value}`,
                        "last_name": `${lastName.value}`,
                        "password": `${password.value}`,

                    }, function( results ) {
                        sessionStorage.setItem( 'key', `${results}` );
                        let userLoggedIn = sessionStorage.getItem( 'key' ); 

                        console.log(results);
                        username.value = '';
                        email.value = '';
                        firstName.value = '';
                        lastName.value = '';
                        password.value = '';

                        
                        window.location = '../UserPage/Forums/index.html';
                        logInScreen(userLoggedIn);

                    })  
                }
            }
        })
    }


            // Register function that hides and shows register button and 
            // fields
    function register () {
                // Register button and fields
        let registerBtn = document.getElementById('registerBtn');
        let loginBtn = document.getElementById('loginBtn');
        let emailDiv = document.getElementById('emailDiv');
        let firstNameDiv = document.getElementById('firstNameDiv');
        let lastNameDiv = document.getElementById('lastNameDiv');
        let formDiv = document.getElementById('form-div');

                // To hide and show certain fields
        registerBtn.addEventListener('click', function() {
            event.preventDefault();  
            formDiv.style.marginTop = '12%';          
            registerBtn.style.display = 'none';
            loginBtn.style.display = 'inline';
            emailDiv.style.display = 'block';
            firstNameDiv.style.display = 'block';
            lastNameDiv.style.display = 'block';
        })
        
    }


    function logInScreen() {
            $.get('http://localhost:3000/forums', function( forums ) {
    
                console.log(forums);
    
            })
    }

    logInScreen();
    register();
    login();
})