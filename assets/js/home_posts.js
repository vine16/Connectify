
$('document').ready(function(){
    //handling post submission, sending data
    //and returning the posts and users
    //method to submit the form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e)
        {
            e.preventDefault();
            $.ajax({
                type:'post',
                url: '/posts/create',
                data: newPostForm.serialize(),//convert form data into query string
                success: function(jsonData){//data is received in form of json
                    let newPost = newPostDom(jsonData.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    createComment();
                    showNotification("Post Created Successfully!", "success");
                    deletePost($(' .delete-post-button', newPost));
                },
                error: function(data){
                    console.log(error.responseText);
                }
            });
        });
    }

    //method to create a post in DOM
    let newPostDom = function(post){
        return $(`<li id="post-${post._id}">
        <p>
            <small>
                <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
            </small>
            ${post.content}
            <br>
            <small>
            ${post.user.name}
            </small>
        </p>
        <div class="post-comments">
                <form action="/comments/create" method="POST" class="new-comment-form">
                    <input type="text" name="content" placeholder="type here to add comment..." required>
                    <input type="hidden" name="post" value="${post._id}">
                    <input type="submit" value="Add Comment">
                </form>
            <div class="post-comments-list">
                <ul id="post-comments-${post._id}">

                </ul>
            </div>
        </div>
    </li> `)
    }
    

    //method to delete a post from DOM
    //a tag = delete link
    let deletePost = function(deleteLink){
        // console.log($(deleteLink).prop('href'));
        $(deleteLink).click(function(e){
            console.log('clicked');
            e.preventDefault();
            console.log('button clicked');
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    console.log(data);
                    $(`#post-${data.data.post_id}`).remove();
                    showNotification("Post deleted", "success");
                },error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }

    let showNotification = function(text, type)
    {
        new Noty({
            theme: 'relax',
            text: `${text}`,
            type: `${type}`,
            layout: 'topRight',
            timeout: 1500
        }).show();
    }


    //add the click event to all the anchor tags of posts already present, even before creating new post
    let ajaxDeletionForAll = function()
    {
        $('#posts-list-container ul li').each(function(){
            deletePost($(' .delete-post-button', this));
        })
    }       

    ajaxDeletionForAll();
    createPost();
});

