$( document ).ready(function() {

    function loadTopics() {

        let forumId = sessionStorage.getItem('forumId');

        $.get(`http://localhost:3000/forums/${forumId}/topics`, function(topics) {
            console.log(topics);
        })
    }

    loadTopics();

})