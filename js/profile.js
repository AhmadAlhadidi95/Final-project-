let urlParam = new URLSearchParams(window.location.search)
let theId = urlParam.get("userProfile")

getUser()

function getUser() {
    
    axios.get(`${url}/users/${theId}`)
    .then((response) => {
        let user = response.data.data

        if (typeof user.profile_image == typeof {}) {
            user.profile_image = `/imgs/Avatar-1.jpg`
        }

        document.getElementById("img-profile").src = user.profile_image
        document.getElementById("user-name").innerHTML = user.username
        document.getElementById("name").innerHTML = user.name
        document.getElementById("email").innerHTML = user.email
        document.getElementById("posts-count").innerHTML = user.posts_count
        document.getElementById("comments-count").innerHTML = user.comments_count

    })

    getUserPosts()

}

function getUserPosts() {

    loaderFun(true)

    axios.get(`${url}/users/${theId}/posts`)
    .then((response) => {
        let posts = response.data.data

        for (let i = 0; i < posts.length; i++) {
    
            if (typeof posts[i].author.profile_image == typeof {}) {
                posts[i].author.profile_image = `/imgs/Avatar-1.jpg`
            }
    
            if (typeof posts[i].image == typeof {}) {
                posts[i].image = ``
            }
    
            let post = document.createElement("div")
            post.className = `post`
    
            let user = document.createElement("div")
            user.className = `user`
    
            let profileImage = document.createElement("img")
            profileImage.className = `avatar`
            
            profileImage.innerHTML = profileImage.src = posts[i].author.profile_image
    
            let name = document.createElement("strong")
            name.innerHTML = posts[i].author.name

            if (localStorage.getItem("userInfo") != null) {
                
                if (posts[i].author.id == JSON.parse(localStorage.getItem("userInfo")).id) {
    
                    let buttons = document.createElement("div")
                    buttons.className = `buttons`
        
                    let editSpan = document.createElement("span")
                    editSpan.className = `edit`
        
                    let editSpanText = document.createTextNode("Edit")
        
                    editSpan.appendChild(editSpanText)
        
                    let deleteSpan = document.createElement("span")
                    deleteSpan.className = `delete`
        
                    let deleteSpanText = document.createTextNode("Delete")
        
                    deleteSpan.appendChild(deleteSpanText)

                    deleteSpan.addEventListener("click", () => {

                        let overlayDeletePost = document.createElement("div")
                        overlayDeletePost.className = `overlayDeletePost`

                        let showDeleteBox = document.createElement("div")
                        showDeleteBox.className = `showDeleteBox`

                        let showDeleteBoxText = document.createTextNode(`Do you really want to delete the post?`)

                        let cancelButton = document.createElement("span")
                        cancelButton.className = `cancel`
                        cancelButton.setAttribute("title", "Cancel")

                        let cancelButtonSymbol = document.createTextNode(`X`)

                        cancelButton.appendChild(cancelButtonSymbol)

                        let btnDelete = document.createElement("button")
                        btnDelete.className = "btnDelete"

                        let btnDeleteText = document.createTextNode("Delete")

                        btnDelete.appendChild(btnDeleteText)

                        btnDelete.addEventListener("click", () => {

                            let auth = {
                                "authorization": `Bearer ${localStorage.getItem("token")}`
                            }
                            
                            axios.delete(`${url}/posts/${posts[i].id}`, {headers: auth})
                            .then((response) => {
                                
                                swal.fire({
                                    "title": `Success`,
                                    "text": `Your post deleted`,
                                    "icon": "success",
                                    "timer": 2000,
                                })
                
                                postsBox.innerHTML = ""
                
                                document.querySelector(".overlayDeletePost").remove()
                
                                getUser()
                                
                            }).catch((error) => {
                                let errorMessage = error.response.data.message
                
                                swal.fire({
                                    "title": `Wrong`,
                                    "text": errorMessage,
                                    "icon": "error",
                                    "timer": 2000,
                                })
                                
                            })

                        })

                        showDeleteBox.append(showDeleteBoxText, cancelButton, btnDelete)

                        overlayDeletePost.appendChild(showDeleteBox)

                        document.body.appendChild(overlayDeletePost)

                        cancelAnyWindow(overlayDeletePost)

                    })
        
                    buttons.append(editSpan, deleteSpan)
    
                    user.append(profileImage, name, buttons)
    
                } else {
    
                    user.append(profileImage, name)
    
                }
            } else {
    
                user.append(profileImage, name)

            }
    
            let title = document.createElement("h3")
            title.innerHTML = posts[i].title
    
            let postTime = document.createElement("span")
            postTime.innerHTML = posts[i].created_at

            let annex = document.createElement("div")
            annex.className = `annex`
            annex.style.cursor = "pointer"

            annex.addEventListener("click", function getId(idNumber) { // Important: send Id to another page
                idNumber = posts[i].id
                window.location = `postDetails.html?userId=${idNumber}`
            })
    
            let img = document.createElement("img")
            img.className = `the-image`
            img.innerHTML = img.src = posts[i].image
    
            let article = document.createElement("p")
            article.innerHTML = posts[i].body
    
            let commentsAndTags = document.createElement("div")
            commentsAndTags.className = `comments-and-tags`
    
            let commentsCount = document.createElement("b")
            commentsCount.innerHTML = `${`<i class="fa-solid fa-pen-nib"></i>`} (${posts[i].comments_count}) `
    
            let text = document.createTextNode("Comments")
    
            let tags = document.createElement("div")
            tags.className = `tags`
    
            for (const tag of posts[i].tags) {
    
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
    
            post.append(user, title, postTime, annex, line)
    
            postsBox.appendChild(post)

            .addEventListener("click", function (e) {

                if (e.target.className == "edit") {
                    
                    document.querySelector(".overlayEditPost").style.display = "block"
    
                    document.querySelector(".overlayEditPost").setAttribute("data-state", "edit")
    
                    document.querySelector(".overlayEditPost").setAttribute("value", `${posts[i].id}`)
    
                    document.getElementById("edit-title").value = posts[i].title
    
                    // document.getElementById("edit-image")
    
                    document.getElementById("edit-article").value = posts[i].body

                }

            })
    
        }
        
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

function addNewPostOrEditOldPost(editPost) {

    editPost = document.querySelector(".overlayEditPost")

    let formData = new FormData()
    formData.append("title", document.getElementById("edit-title").value)
    // formData.append("image", document.getElementById("edit-image").files[0])
    formData.append("body", document.getElementById("edit-article").value)
    formData.append("_method", "put")

    let token = localStorage.getItem("token")

    let auth = {
        "authorization": `Bearer ${token}`
    }

    loaderFun(true)

    axios.post(`${url}/posts/${editPost.getAttribute("value")}`, formData, {headers: auth})
    .then((response) => {
        let userInfo = response.data
        
        swal.fire({
            "title": `Success`,
            "text": `You edited the post`,
            "icon": "success",
            "timer": 2000,
        })

        postsBox.innerHTML = ""

        document.querySelector(".overlayEditPost").style.display = "none"
        
        getUser()

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