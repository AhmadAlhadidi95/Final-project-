getPost()

function getPost() {
    
    const urlParam = new URLSearchParams(window.location.search) // Important: received the Id here
    const theId = urlParam.get(`userId`)

    loaderFun(true)
    
    axios.get(`${url}/posts/${theId}`)
    .then((response) => {
        let userPost = response.data.data
        let allComments = response.data.data.comments

        if (typeof userPost.author.profile_image == typeof {}) {
            userPost.author.profile_image = `/imgs/Avatar-1.jpg`
        }

        if (typeof userPost.image == typeof {}) {
            userPost.image = ``
        }

        let post = document.createElement("div")
        post.className = `post`

        let user = document.createElement("div")
        user.className = `user`

        let profileImage = document.createElement("img")
        profileImage.className = `avatar`

        profileImage.innerHTML = profileImage.src = userPost.author.profile_image

        let name = document.createElement("strong")
        name.innerHTML = userPost.author.name

        if (localStorage.getItem("userInfo") != null) {
                
            if (userPost.author.id == JSON.parse(localStorage.getItem("userInfo")).id) {

                let buttons = document.createElement("div")
                buttons.className = `buttons`
    
                let editSpan = document.createElement("span")
                editSpan.className = `edit`
    
                let editSpanText = document.createTextNode("Edit")
    
                editSpan.appendChild(editSpanText)

                editSpan.addEventListener("click", function () {

                    document.querySelector(".overlayEditPost").style.display = "block"
    
                    document.querySelector(".overlayEditPost").setAttribute("data-state", "edit")
    
                    document.querySelector(".overlayEditPost").setAttribute("value", `${userPost.id}`)
    
                    document.getElementById("edit-title").value = userPost.title
    
                    // document.getElementById("edit-image")
    
                    document.getElementById("edit-article").value = userPost.body
    
                })
    
                let deleteSpan = document.createElement("span")
                deleteSpan.className = `delete`

                deletePost(deleteSpan, theId)
    
                let deleteSpanText = document.createTextNode("Delete")
    
                deleteSpan.appendChild(deleteSpanText)

                deletePost(deleteSpan, userPost.id)
    
                buttons.append(editSpan, deleteSpan)

                user.append(profileImage, name, buttons)

            } else {

                user.append(profileImage, name)

            }
        } else {

            user.append(profileImage, name)

        }

        let title = document.createElement("h3")
        title.innerHTML = userPost.title

        let postTime = document.createElement("span")
        postTime.innerHTML = userPost.created_at

        let annex = document.createElement("div")
        annex.className = `annex`

        let img = document.createElement("img")
        img.className = `the-image`
        img.innerHTML = img.src = userPost.image

        let article = document.createElement("p")
        article.innerHTML = userPost.body

        let commentsAndTags = document.createElement("div")
        commentsAndTags.className = `comments-and-tags`

        let commentsCount = document.createElement("b")
        commentsCount.innerHTML = `${`<i class="fa-solid fa-pen-nib"></i>`} (${userPost.comments_count}) `

        let text = document.createTextNode("Comments")
    
        let tags = document.createElement("div")
        tags.className = `tags`

        for (const tag of userPost.tags) {
    
            let spanTag = document.createElement("span")
            let spanTagText = document.createTextNode(tag.name)

            spanTag.appendChild(spanTagText)
            tags.appendChild(spanTag)

        }

        commentsAndTags.append(commentsCount, text, tags)
    
        if (tags.childElementCount == 0) {
            tags.remove()
        }

        annex.append(img, article, commentsAndTags)

        let line = document.createElement("hr")

        let commentsBox = document.createElement("div")
        commentsBox.className = `comments-box`
        
        for (const com of allComments) {

            let comment = document.createElement("div")
            comment.className = `comment`
    
            let userInfo = document.createElement("div")
            userInfo.className = `user-info`
    
            let commentImage = document.createElement("img")
            
            if (typeof com.author.profile_image == typeof {}) {
                com.author.profile_image = `/imgs/Avatar-1.jpg`
            }

            commentImage.src = com.author.profile_image

            let commentWriter = document.createElement("b")
            commentWriter.innerHTML = com.author.name
    
            userInfo.append(commentImage, commentWriter)
    
            let paragraph = document.createElement("p")
            paragraph.innerHTML = com.body
    
            comment.append(userInfo, paragraph)
    
            let hr = document.createElement("hr")
            
            commentsBox.append(comment, hr)

        }
        
        post.append(user, title, postTime, annex, line, commentsBox)

        let writeBox = document.createElement("div")
        writeBox.className = `write-box`

        let commentInput = document.createElement("input")
        commentInput.setAttribute("type", "text")
        commentInput.setAttribute("id", "comment-input")
        commentInput.setAttribute("placeholder", "Write here")

        let button = document.createElement("span")
        button.className = "send-botton"

        button.addEventListener("click", () => {

            let inputValue = commentInput.value

            let token = localStorage.getItem("token")

            let auth = {
                "authorization": `Bearer ${token}`
            }

            axios.post(`${url}/posts/${theId}/comments`, {"body": inputValue}, {headers: auth})
            .then((response) => {
                let commentInfo = response.data.data

                swal.fire({
                    "title": `Success`,
                    "text": `Your comment is posted`,
                    "icon": "success",
                    "timer": 2000,
                })

                postsBox.innerHTML = ""

                getPost()

            }).catch((error) => {
                let errorMessage = error.response.data.message
                
                swal.fire({
                    "title":  `Opsss`,
                    "text":  errorMessage,
                    "icon":  `warning`,
                    "timer": 2000,
                })

            })

        })

        let bottonText = document.createTextNode("Send")

        button.appendChild(bottonText)

        writeBox.append(commentInput, button)
    
        postsBox.append(post, writeBox)

        checkUser(writeBox)
        
    }).catch((error) => {
        
        let errorMessage = error.response.data.message
    
            swal.fire({
                "title": `Wrong`,
                "text": errorMessage,
                "icon": "error",
                "timer": 2000,
            })
        
    }).finally(() => {

        loaderFun(false)

    })
    
}