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


    //Creating a new topic
    function createTopic() {

        let newTopic = document.getElementById('newTopic');
        let topicBody = document.getElementById('topicBody');
        let userId = sessionStorage.getItem( 'userId' );
        var inputs = document.getElementsByTagName("h1");
        console.log(inputs)
        let forumId = inputs[0].id;
        createPost(forumId);

        document.getElementById('newTopicBtn').addEventListener('click', function() {
            
            $.post(`/forums/${forumId}/topics`, {

                "topic": `${newTopic.value}`,
                "newPost": `${topicBody.value}`,
                "username_id": `${userId}`

            }, function(results) {
                console.log(results);
                window.location.reload();
            }).fail(function() {
                alert('Topic already exists');
            })
        })
    }

    function createPost(forumId) {
        $.get(`/forums/${forumId}/topics`, function(topics) {
            let lastTopic = topics[topics.length-1];
        })

        //$.post(`/forums/${forumId}/topics//posts`, )
    }

    createTopic();

})