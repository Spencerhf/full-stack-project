$( document ).ready(function() {

    function loadTopics() {

        let forumId = sessionStorage.getItem('forumId');

        $.get(`http://localhost:3000/forums/${forumId}/topics`, function(topics) {
            console.log(topics);
            renderTopics(topics);
        })
    }

    function renderTopics(topics) {
        for(var i=0; i<topics.length; i++) {

            topicsCard = `
                <tr>
                    <th scope="row">${i+1}</th>
                    <td>${topics[i].topic}</td>
                    <td>${topics[i].username}</td>
                    <td>${topics[i].date_created}</td>
                </tr>
            `;

            document.getElementById('topicContainer').innerHTML += topicsCard;
        }


    }

    loadTopics();

})