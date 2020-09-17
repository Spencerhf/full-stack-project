$( document ).ready(function() {
console.log('script loaded')



document.getElementById('submit').addEventListener('click', function(){

    console.log('your button works') ;

    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    const data = {
        email,
        subject,
        message
    };
    console.log('here is the content', data);

    $.post('http://localhost:3000/contactus', data, function(){
    console.log('Server Received our Data');
    });
 });
});
