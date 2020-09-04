$( document ).ready(function() {

    function login () {
        let username = document.getElementById('username');
        let password = document.getElementById('password');
        let email = document.getElementById('email');
        let emailField = document.getElementById('emailField');

        document.getElementById('submitBtn').addEventListener('click', function() {
            event.preventDefault();
             
            if(emailField.style.display == 'none') {
                if(username.value == '' || username.value == undefined || password.value == '' || password.value == undefined) {
                    alert('Please fill out all fields');
                } else {
                    console.log(username.value, password.value);
                    username.value = ' ';
                    password.value = '';
                }
            } else {
                if(username.value == '' || username.value == undefined  || email.value == '' || email.value == undefined || password.value == '' || password.value == undefined) {
                    alert('Please fill out all fields');
                } else {
                    console.log(username.value, password.value, email.value);
                    username.value = ' ';
                    email.value = ' ';
                    password.value = '';
                }
            }
        })
    }

    function register () {
        let emailField = document.getElementById('emailField');
        let registerBtn = document.getElementById('registerBtn');
        let loginBtn = document.getElementById('loginBtn');

        registerBtn.addEventListener('click', function() {
            event.preventDefault();            
            registerBtn.style.display = 'none';
            loginBtn.style.display = 'inline';
            emailField.style.display = 'block';
        })
        
    }

    register();
    login();
})