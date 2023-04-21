    let createComment = function(){
        console.log('fn again called');
        let newCommentForms = $('.new-comment-form');
        newCommentForms.each(function(){
            $(this).submit(function(e){
                e.preventDefault();
                $.ajax({
                    type: 'post',
                    url: '/comments/create',
                    data: $(this).serialize(),
                    success: function(jData)
                    {
                        let newComment = createCommentInDOM(jData.data.comment);
                        
                        let container = $(`#post-comments-${jData.data.postId}`);
                        container.prepend(newComment);
                        showNotification('comment addded', 'success');
                        deleteComment($('.delete-comment-button', newComment));
                    },                    
                    error: function(data){
                        console.log(error.responseText);
                    }                       
                })
            })
        })
    }


    let createCommentInDOM = function(comment)
    {
        return $(
        `<li id="comment-${comment._id}">
            <p>
                ${comment.content}
                <br>
                <small>
                    ${comment.user.name}
                </small>
                <small>            
                    <a href="/comments/destroy/${comment._id}" class="delete-comment-button">XC</a>
                </small>
            </p>
        </li>`
        );
    }
    
    let deleteComment = function(deleteLink)
    {
        deleteLink.click(function(e){
            console.log('delete button clicked');
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: deleteLink.prop('href'),
                success:function(data){
                    console.log(data.data.commentId, 'commentid');
                    $(`#comment-${data.data.commentId}`).remove();
                    showNotification('comment deleted', 'success');
                },
                error: function(err)
                {
                    console.log(err.responseText);
                }
            })
        })
    }

    //loop over all the anchor tags of already presetn comments on page
    let loopOverAllAnchorTags = function()
    {
        let allAnchorTags = $('.delete-comment-button');

        allAnchorTags.each(function()
        {
            deleteComment($(this));
        })
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
    
    loopOverAllAnchorTags();
    createComment();