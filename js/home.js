const url = `https://tarmeezacademy.com/api/v1`
const postsBox = document.querySelector(`.posts-box`)

let currentPage = 1
let lastPage = 1

getPosts()
checkUser()

function getPosts() {

    loaderFun(true)

    axios.get(`${url}/posts?limit=5&page=${currentPage}`)
    .then((response) => {
        let users = response.data.data
    
        for (let i = 0; i < users.length; i++) {
    
            if (typeof users[i].author.profile_image == typeof {}) {
                users[i].author.profile_image = `/imgs/Avatar-1.jpg`
            }
    
            if (typeof users[i].image == typeof {}) {
                users[i].image = ``
            }
    
            let post = document.createElement("div")
            post.className = `post`
    
            let user = document.createElement("div")
            user.className = `user`
    
            let profileImage = document.createElement("img")
            profileImage.className = `avatar`

            profileImage.addEventListener("click", function (userProfileId) { // Important: send Id to another page

                userProfileId = users[i].author.id
                window.location = `profile.html?userProfile=${userProfileId}`

            })
            
            profileImage.innerHTML = profileImage.src = users[i].author.profile_image
    
            let name = document.createElement("strong")
            name.innerHTML = users[i].author.name

            if (localStorage.getItem("userInfo") != null) {
                
                if (users[i].author.id == JSON.parse(localStorage.getItem("userInfo")).id) {
    
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
                            
                            axios.delete(`${url}/posts/${users[i].id}`, {headers: auth})
                            .then((response) => {
                                
                                swal.fire({
                                    "title": `Success`,
                                    "text": `Your post deleted`,
                                    "icon": "success",
                                    "timer": 2000,
                                })
                
                                postsBox.innerHTML = ""
                
                                document.querySelector(".overlayDeletePost").remove()
                
                                getPosts()
                                
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
            title.innerHTML = users[i].title
    
            let postTime = document.createElement("span")
            postTime.innerHTML = users[i].created_at

            let annex = document.createElement("div")
            annex.className = `annex`
            annex.style.cursor = "pointer"

            annex.addEventListener("click", function (idNumber) { // Important: send Id to another page
                idNumber = users[i].id
                window.location = `postDetails.html?userId=${idNumber}`
            })
    
            let img = document.createElement("img")
            img.className = `the-image`
            img.innerHTML = img.src = users[i].image
    
            let article = document.createElement("p")
            article.innerHTML = users[i].body
    
            let commentsAndTags = document.createElement("div")
            commentsAndTags.className = `comments-and-tags`
    
            let commentsCount = document.createElement("b")
            commentsCount.innerHTML = `${`<i class="fa-solid fa-pen-nib"></i>`} (${users[i].comments_count}) `
    
            let text = document.createTextNode("Comments")
    
            let tags = document.createElement("div")
            tags.className = `tags`
    
            for (const tag of users[i].tags) {
    
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
    
                    document.querySelector(".overlayEditPost").setAttribute("value", `${users[i].id}`)
    
                    document.getElementById("edit-title").value = users[i].title
    
                    // document.getElementById("edit-image")
    
                    document.getElementById("edit-article").value = users[i].body

                }

            })
    
        }
    
    }).catch((error) => {
    
        let errorMessage = error.message
    
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

function logInUserFun() {

    const userName = document.getElementById("username-login").value
    const password = document.getElementById("password-login").value

    loaderFun(true)

    axios.post(`${url}/login`, 
        {
            "username": userName,
            "password": password
        }
    )
    .then((response) => {
        let token = response.data.token
        let userInfo = response.data.user
    
        document.querySelector(".overlayLogin").style.display = "none"

        localStorage.setItem("token", token)
        localStorage.setItem("userInfo", JSON.stringify(userInfo))

        swal.fire({
            "title": `Welcome`,
            "text": `You're login successfully`,
            "icon": "success",
            "timer": 2000,
        })

        postsBox.innerHTML = ""

        getPosts()

        checkUser()
    
    }).catch((error) => {

        let errorMessage = error.response.data.message
        
        swal.fire({
            "title":  `Opsss`,
            "text":  errorMessage,
            "icon":  `warning`,
            "timer": 2000,
        })

    }).finally(() => {

        loaderFun(false)

    })

}

function signUpUserFun() {

    const userName = document.getElementById("username-register").value
    const password = document.getElementById("password-register").value
    const imageProfil = document.getElementById("image-register").files[0]
    const name = document.getElementById("name-register").value
    const email = document.getElementById("email-register").value

    let formData = new FormData()
    formData.append("username", userName)
    formData.append("password", password)
    formData.append("image", imageProfil)
    formData.append("name", name)
    formData.append("email", email)

    loaderFun(true)

    axios.post(`${url}/register`, formData)
    .then((response) => {
        
        let userInfo = response.data.user
        let token = response.data.token

        document.querySelector(".overlayRegister").style.display = "none"

        localStorage.setItem("token", token)
        localStorage.setItem("userInfo", JSON.stringify(userInfo))

        swal.fire({
            "title": "Successfully",
            "text": `Welcome with us in our website, ${userInfo.name}`,
            "icon": "success",
            "timer": 2000,
        })

        postsBox.innerHTML = ""

        getPosts()

        checkUser()

    }).catch((error) => {

        let errorMessage = error.response.data.message

        swal.fire({
            "title": `Opsss`,
            "text": `${errorMessage}`,
            "icon": "error",
            "timer": 2000,
        })

    }).finally(() => {

        loaderFun(false)

    })

}

function checkUser() {

    let theToken = localStorage.getItem("token")
    let theUserInfo = localStorage.getItem("userInfo")

    let currentImage = document.querySelector(".avatar-info img")
    let currentUserName = document.querySelector(".avatar-info h3")
    
    if (theToken != null) {

        let savedImage = JSON.parse(localStorage.getItem("userInfo")).profile_image
        let savedUser = JSON.parse(localStorage.getItem("userInfo")).username

        currentImage.src = savedImage
        currentUserName.innerHTML = savedUser
        
        // console.log("The token is here");
        document.querySelector(".buttons-box").style.display = "none"
        document.querySelector(".logout").style.display = "block"
        document.querySelector(".avatar-info").style.display = "flex"
        document.querySelector(".add-post").style.display = "block"

        document.querySelector(".myProfile").addEventListener("click", () => {
            window.location = `profile.html?userProfile=${JSON.parse(theUserInfo).id}`
        })

        document.querySelector(".byMegeMenu").addEventListener("click", () => {
            window.location = `profile.html?userProfile=${JSON.parse(theUserInfo).id}`
        })

    } else {
        
        // console.log("The token is notttt here");
        document.querySelector(".buttons-box").style.display = "block"
        document.querySelector(".logout").style.display = "none"
        document.querySelector(".avatar-info").style.display = "none"
        document.querySelector(".add-post").style.display = "none"

    }

}

function registerFun() {
    document.querySelector(".overlayRegister").style.display = "block"
}

function loginFun() {
    document.querySelector(".overlayLogin").style.display = "block"
}

function logoutFun() {

    localStorage.removeItem("token")
    localStorage.removeItem("userInfo")

    swal.fire({
        "title": `Goodbye`,
        "text": `You're logout successfully`,
        "icon": "success",
        "timer": 2000,
    })

    postsBox.innerHTML = ""

    getPosts()

    checkUser()

}

function createPost() {
    document.querySelector(".overlayAddNewPost").style.display = "block"
}

function addNewPostOrEditOldPost(addPost, editPost) {

    addPost = document.querySelector(".overlayAddNewPost")
    editPost = document.querySelector(".overlayEditPost")

    let addTitle = document.getElementById("add-title").value
    let addImage = document.getElementById("add-image").files[0]
    let addArticle = document.getElementById("add-article").value

    let formData = new FormData()
    formData.append("title", addTitle)
    formData.append("image", addImage)
    formData.append("body", addArticle)

    let token = localStorage.getItem("token")

    let auth = {
        "authorization": `Bearer ${token}`
    }

    if (editPost.dataset.state != "edit") {

        loaderFun(true)
        
        axios.post(`${url}/posts`, formData, {headers: auth})
        .then((response) => {
            let userInfo = response.data
            
            swal.fire({
                "title": `Success`,
                "text": `You created new post`,
                "icon": "success",
                "timer": 2000,
            })
    
            postsBox.innerHTML = ""
    
            document.querySelector(".overlayAddNewPost").style.display = "none"
    
            getPosts()
    
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

    } else {

        let formData = new FormData()
        formData.append("title", document.getElementById("edit-title").value)
        // formData.append("image", document.getElementById("edit-image").files[0])
        formData.append("body", document.getElementById("edit-article").value)
        formData.append("_method", "put")

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
    
            getPosts()
    
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

}

function cancelAnyWindow(noInHtmlPage) {

    addEventListener("click", (e) => {
    
        if (e.target.className == "cancel") {
            
            document.querySelector(".overlayLogin").style.display = "none"
            document.querySelector(".overlayRegister").style.display = "none"
            document.querySelector(".overlayAddNewPost").style.display = "none"
            document.querySelector(".overlayEditPost").style.display = "none"

            if (noInHtmlPage != null) {

                noInHtmlPage.remove()
                
            }

        }
    
    })

}

window.addEventListener("scroll", () => { // Important: Infinite scroll

    if (window.scrollY + window.innerHeight == document.documentElement.scrollHeight) {
        currentPage += 1
        getPosts()
    }

})

function loaderFun(show = true) {

    if (show) {
        document.querySelector(".loader-box").style.visibility = `visible`
    } else {
        document.querySelector(".loader-box").style.visibility = `hidden`
    }

}

function toggleDisplay() {
    let theMegaMenu = document.querySelector(".the-menu");

    // Check the current display property
    let currentDisplay = window.getComputedStyle(theMegaMenu).display;

    // Toggle between 'flex' and 'none'
    theMegaMenu.style.display = (currentDisplay === 'none') ? 'flex' : 'none';
}