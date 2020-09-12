$( document ).ready(function() {

    function loadForums() {
        $.get('http://localhost:3000/forums', function( forums ) {

            for(var i=0; i <= forums.length; i++) {
                renderForum(forums, i);
            }

        })
    }

    function renderForum(forum, i) {
        let container = document.getElementById('forum-container');

        let forumCard = `
        <a href="#" id="${forum[i].id}" onclick="forumCardClicked(this.id)" class="card-link d-block m-3 mx-auto">
            <div class="card-hover card">
                <div class="card-body text-center">
                    <h1 class="icon">${forum[i].icons}</h1>
                    <h4>${forum[i].name}</h4>
                </div>
            </div>
        </a>
        `;

        container.innerHTML += forumCard;

    }


    //This is going to get the forum id 
    //and return only that forum

    window.forumCardClicked = (clickedId) => {
        
        window.location = '../Topics/index.html';
        sessionStorage.setItem( 'forumId', `${clickedId}` );
        let forumId = sessionStorage.getItem( 'forumId' );

    };


    //forumCardClicked();
    loadForums();
})