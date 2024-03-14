const url = `https://tarmeezacademy.com/api/v1`
const postsBox = document.querySelector(`.posts-box`)

checkUser()

function logInUserFun() {

    const userName = document.getElementById("username-login").value
    const password = document.getElementById("password-login").value

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

        getPost()

        checkUser()
    
    }).catch((error) => {
        let errorMessage = error.response.data.message
        
        swal.fire({
            "title":  `Opsss`,
            "text":  errorMessage,
            "icon":  `warning`,
            "timer": 2000,
        })
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

        getPost()

        checkUser()

    }).catch((error) => {
        let errorMessage = error.response.data.message

        swal.fire({
            "title": `Opsss`,
            "text": `${errorMessage}`,
            "icon": "error",
            "timer": 2000,
        })

    })

}

function checkUser(e = null) {

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

        if (e != null) {
            e.style.display = "flex"
        }

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

        if (e != null) {
            e.style.display = "none"
        }

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

    getPost()

    checkUser()

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
        
        getPost()

    }).catch((error) => {
        let errorMessage = error.response.data.message

        swal.fire({
            "title": `Wrong`,
            "text": errorMessage,
            "icon": "error",
            "timer": 2000,
        })

    })

}

function deletePost(e, idPost) {

    e.addEventListener("click", function () {

        let overlayDeletePost = document.createElement("div")
        overlayDeletePost.className = `overlayDeletePost`

        let showDeleteBox = document.createElement("div")
        showDeleteBox.className = `showDeleteBox`

        let showDeleteBoxText = document.createTextNode(`Do you really want to delete the post?`)

        let cancelButton = document.createElement("span")
        cancelButton.className = `cancel`

        let cancelButtonSymbol = document.createTextNode(`X`)

        cancelButton.appendChild(cancelButtonSymbol)

        let btnDelete = document.createElement("button")
        btnDelete.className = "btnDelete"

        let btnDeleteText = document.createTextNode("Delete")

        btnDelete.appendChild(btnDeleteText)

        showDeleteBox.append(showDeleteBoxText, cancelButton, btnDelete)

        overlayDeletePost.appendChild(showDeleteBox)

        document.body.appendChild(overlayDeletePost)

        cancelAnyWindow(overlayDeletePost)

    })

    addEventListener("click", function (e) {

        if (e.target.className == "btnDelete") {

            let auth = {
                "authorization": `Bearer ${localStorage.getItem("token")}`
            }
            
            axios.delete(`${url}/posts/${idPost}`, {headers: auth})
            .then((response) => {
                
                swal.fire({
                    "title": `Success`,
                    "text": `Your post deleted`,
                    "icon": "success",
                    "timer": 2000,
                })

                postsBox.innerHTML = ""

                document.querySelector(".overlayDeletePost").remove()

                window.location = "home.html"

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

        }

    })

}

function cancelAnyWindow(noInHtmlPage) {

    addEventListener("click", (e) => {
    
        if (e.target.className == "cancel") {
            
            document.querySelector(".overlayLogin").style.display = "none"
            document.querySelector(".overlayRegister").style.display = "none"
            document.querySelector(".overlayEditPost").style.display = "none"

            if (noInHtmlPage != null) {
                
                noInHtmlPage.remove()
                
            }

        }
    
    })

}

function goHome() {
    window.location = `home.html`
}

function loaderFun(show = true) {

    if (show) {
        document.querySelector(".loader-box").style.visibility = `visible`
    } else {
        document.querySelector(".loader-box").style.visibility = `hidden`
    }

}

function toggleDisplay() {
    var theMegaMenu = document.querySelector(".the-menu");

    // Check the current display property
    var currentDisplay = window.getComputedStyle(theMegaMenu).display;

    // Toggle between 'flex' and 'none'
    theMegaMenu.style.display = (currentDisplay === 'none') ? 'flex' : 'none';
}