$( document ).ready(function() {

    // To display the username
    function displayUsername() {

        let user = sessionStorage.getItem( 'username' );

<<<<<<< HEAD
        document.getElementById('displayUsername').innerHTML = "Hey, " + user;
=======
        document.getElementById('displayUsername').innerHTML = user;
>>>>>>> spencer

    }
    displayUsername();


    //Creating a new topic
    function createTopic() {

        let newTopic = document.getElementById('newTopic');
        let userId = sessionStorage.getItem( 'userId' );
        var inputs = document.getElementsByTagName("h1");
        let forumId = inputs[0].id;
        console.log(forumId);

        document.getElementById('newTopicBtn').addEventListener('click', function() {
            
            $.post(`/forums/${forumId}/topics`, {

                "topic": `${newTopic.value}`,
                "username_id": `${userId}`

            }, function(results) {
                console.log(results);
                window.location.reload();
            }).fail(function() {
                alert('Topic already exists');
            })
        })

    }
    createTopic();

})