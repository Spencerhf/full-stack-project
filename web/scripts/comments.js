$( document ).ready(function() {

    // To display the username
    function displayUsername() {

        let user = sessionStorage.getItem( 'username' );

        document.getElementById('displayUsername').innerHTML = "Hey, " + user;

    }
    displayUsername();


    function logOut() {
        let btn = document.getElementById('log-out-btn');

        btn.addEventListener('click', function() {
            sessionStorage.removeItem('userId');
            

        })
    }

    //Creating a new comment
    function createComment() {
        let commentBody = document.getElementById('commentBody');
        let userId = sessionStorage.getItem( 'userId' );
        var inputs = document.getElementsByTagName("h1");
        console.log(inputs)
        let postURL = inputs[0].baseURI;
        console.log(postURL)

        document.getElementById('newCommentBtn').addEventListener('click', function() {
            
            $.post(`${postURL}`, {

                "body": `${commentBody.value}`,
                "username_id": `${userId}`

            }, function(results) {
                console.log(results);
            }).fail(function() {
                alert('Oops! Something went wrong.');
            })
        })
    }

    createComment() 
 
})