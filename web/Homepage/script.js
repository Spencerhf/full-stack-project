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
        
        //Reseting the column to empty
        let forumContainer = document.getElementById('forum-container');
        forumContainer.innerHTML = '';
        forumContainer.className = '';

        let topicForm = `
        <div>
            <h1></h1>
        </div>
            <div class="mt-4 row mx-auto">
                <div class="col-6">
                    <h2 class="text-center">Create Topic</h2>
                    <div id="form-div">
                        <form id="form-container" class="w-100 mx-auto">
                            <div class="text-fields form-group">
                                <label for="topic">Topic Title <small>(optional)</small></label>
                                <input class="form-control" id="topicTitle">
                            </div>
                        </form>
                    </div>    
                </div>
                <div class="col-6"></div>
            </div>
        `;

        forumContainer.innerHTML += topicForm;

    };


    //forumCardClicked();
    loadForums();
})