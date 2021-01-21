///SignUP

const url = "http://localhost:5000"
var socket = io(url);

socket.on('connect', function () {
    console.log("connected")
});
function signup() {

    
    axios({
        method: 'post',
        url: url + "/signup",
        data: {
            name : document.getElementById("aName").value,
            email: document.getElementById("Email").value,
            password: document.getElementById("Password").value,
            phone: document.getElementById("Number").value,
            gender: document.getElementById("gender").value



        }, withCredentials: true

    }).then(function (response) {
        console.log(response.data.message);
        alert(response.data.message);
        window.location.href = "login.html"
    })

    .catch(function (error) {
        console.log(error);
        alert(response.message)
    });

    return false;
}

///Login

function login() {

    axios({
        method: 'post',
        url: url + "/login",
        data: {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
        }, withCredentials: true

    }).then((response) => {
        console.log(response);
        alert(response.data.message)
        window.location.href = "home.html"
    }, (error) => {
        console.log(error);
        alert(error)
    });

    return false;
}


//FORGET STEP-1

function forgot1() {

    axios({
        method: 'post',
        url: url + "/forget-password",
        data: {
            email: document.getElementById("Femail").value,
        },withCredentials: true
    }).then((response) => {
        if (response.data.status === 200) {
            console.log(response.data.message);
            alert(response.data.message);
            window.location.href = "forgot2.html"
        } else {
            alert(response.data.message)
        }
    }, (error) => {
        console.log(error);
    });

    return false;

}


function forgot2() {
    axios({
        method: 'post',
        url: url + "/forget-password-step-2",
        data: {
            email: document.getElementById("email2").value,
            otp: document.getElementById("otp").value,
            newPassword: document.getElementById("password2").value,
        },withCredentials: true
    }).then((response) => {
        
            console.log(response.data.message);
            alert(response.data.message);
            window.location.href = "login.html"
           
        
    }, (error) => {
        console.log(error);
    });
    return false;

}


//PROFILE

function profile() {
    axios({
        method: 'get',
        url: url + '/profile',
        credentials: 'include',
    }).then((response) => {
        console.log(response);
        document.getElementById('name').innerHTML = response.data.profile.name;
        document.getElementById('email').innerHTML = response.data.profile.email;
        document.getElementById('phone').innerHTML = response.data.profile.phone;
        document.getElementById("user-id").innerHTML = response.data.profile._id;
        document.getElementById("gender").innerHTML = response.data.profile.gender
        
    }, (error) => {
        console.log(error.message);
    });
    return false
}


//POST

function tweetpost() {
    axios({
        method: 'post',
        url: url + "/tweet",
        data: {
            tweet: document.getElementById("your-post").value,
        }
        
    }).then((response) => {
        if (response.data.status === 200) {
            alert(response.data.message)
            return
        } else {
            alert(response.data.message)
        }
    }, (error) => {
        console.log(error);
    });
    return false;
}


function gettweet() {
    // getProfile();
    axios({
        method: 'get',
        url: url + '/tweet-get',
        credentials: 'include',
    }).then((response) => {
        let tweets = response.data.tweet;
        for (i = 0; i < tweets.length; i++) {
            var eachtweet = document.createElement("li");
            eachtweet.innerHTML = `<h4>
            ${tweets[i].username}
            </h4>
            <p>
            ${tweets[i].tweet}
            </p>`;
            eachtweet.setAttribute('class','reverse')
            document.getElementById("mytweet").appendChild(eachtweet);
        }
    }, (error) => {
        console.log(error.message);
    });


    return false
}

socket.on("NEW_POST", (newPost) => {


    console.log(newPost);

    let jsonRes = newPost;
    var eachtweet = document.createElement("li");
    eachtweet.innerHTML = `<h4>
    ${jsonRes.username}
    </h4>
     <p>
        ${jsonRes.tweet}
    </p>`;
    eachtweet.setAttribute('class','reverse')

    document.getElementById("mytweet").appendChild(eachtweet);


})
function logout() {
    axios({
        method: 'post',
        url: url + '/logout',
      
    }).then((response) => {
        console.log(response);
        window.location.href = "./login.html"
    }, (error) => {
        console.log(error.message);
    });
    return false
}

///SignUP
// var url = "https://pyt-app.herokuapp.com";

// const url = "http://localhost:5000"

// var socket = io(url);

// socket.on('connect', function () {
//     console.log("connected")
// });

// function signup() {

    
//     axios({
//         method: 'post',
//         url: url + "/signup",
//         data: {
//             name : document.getElementById("aName").value,
//             email: document.getElementById("Email").value,
//             password: document.getElementById("Password").value,
//             phone: document.getElementById("Number").value,
//             nationaty: document.getElementById("nationalty").value,
//             gender: document.getElementById("gender").value



//         }//, withCredentials: true

//     }).then(function (response) {
//         console.log(response.data.message);
//         alert(response.data.message);
//         window.location.href = "login.html"
//     })

//     .catch(function (error) {
//         console.log(error);
//         alert(response.message)
//     });

//     return false;
// }

// // function signup() {


// //     axios({
// //             method: 'post',
// //             url: url + "/signup",
// //             data: {
// //                 userName: document.getElementById("aName").value,
// //                 userEmail: document.getElementById("Email").value,
// //                 userPassword: document.getElementById("Password").value,
// //                 userPhone: document.getElementById("Phone").value,
// //                 userGender: document.getElementById("gender").value


// //             }

// //         }).then((response) => {
// //             if (response.data.status === 200) {
// //                 alert(response.data.message)
// //                 window.location.href = "login.html"
// //             } else {
// //                 alert(response.data.message);
// //             }
// //         }).catch((error) => {
// //             console.log(error);
// //         });

// //     return false;
// // }

// ///Login

// function login() {

//     axios({
//         method: 'post',
//         url: url + "/login",
//         data: {
//             email: document.getElementById("email").value,
//             password: document.getElementById("password").value,
//         } //, withCredentials: true

//     }).then((response) => {
//         console.log(response);
//         alert(response.data.message)
//         window.location.href = "home.html"
//     }, (error) => {
//         console.log(error);
//         alert(error)
//     });

//     return false;
// }


// //FORGET STEP-1

// function forgot1() {

//     axios({
//         method: 'post',
//         url: url + "/forget-password",
//         data: {
//             email: document.getElementById("Femail").value,
//         }
//         // withCredentials: true
//     }).then((response) => {
//         if (response.data.status === 200) {
//             console.log(response.data.message);
//             alert(response.data.message);
//             window.location.href = "forget2.html"
//         } else {
//             alert(response.data.message)
//         }
//     }, (error) => {
//         console.log(error);
//     });

//     return false;

// }


// function forgot2() {
//     axios({
//         method: 'post',
//         url: url + "/forget-password-step-2",
//         data: {
//             email: document.getElementById("email2").value,
//             newPassword: document.getElementById("password2").value,
//             otp: document.getElementById("otp").value,
//         }
//     }).then((response) => {

//         console.log(response.data.message);
//         alert(response.data.message);
//         window.location.href = "login.html"


//     }, (error) => {
//         console.log(error);
//     });
//     return false;

// }

// //PROFILE

// function profile() {
//     axios({
//         method: 'get',
//         url: url + '/profile',
//         credentials: 'include',
//     }).then((response) => {
//         console.log(response);
//         document.getElementById('name').innerHTML = response.data.profile.name,
//         document.getElementById('email').innerHTML = response.data.profile.email,
//         document.getElementById('phone').innerHTML = response.data.profile.phone,
//         document.getElementById("user-id").innerHTML = response.data.profile._id,
//         document.getElementById("gender").innerHTML = response.data.profile.gender
        
//     }, (error) => {
//         console.log(error.message);
//     });
//     return false
// }


// //POST

// function tweetpost() {
//     axios({
//         method: 'post',
//         url: url + "/tweet",
//         data: {
//             tweet: document.getElementById("your-post").value,
//         },
//         withCredentials: true
//     }).then((response) => {
//         if (response.data.status === 200) {
//             alert(response.data.message)
//             return
//         } else {
//             alert(response.data.message)
//         }
//     }, (error) => {
//         console.log(error);
//     });
//     return false;
// }


// function gettweet() {
//     // getProfile();
//     axios({
//         method: 'get',
//         url: url + '/tweet-get',
//         credentials: 'include',
//     }).then((response) => {
//         let tweets = response.data.tweet;
//         for (i = 0; i < tweets.length; i++) {
//             var eachtweet = document.createElement("li");
//             eachtweet.innerHTML = `<h5>
//             ${tweets[i].username}
//             </h5>
//             <p>
//             ${tweets[i].tweet}
//             </p>`;
//             eachtweet.setAttribute('class','reverse')
//             document.getElementById("mytweet").appendChild(eachtweet);
//         }
//     }, (error) => {
//         console.log(error.message);
//     });


//     return false
// }

// socket.on("NEW_POST", (newPost) => {


//     console.log(newPost);

//     let jsonRes = newPost;
//     var eachtweet = document.createElement("li");
//     eachtweet.innerHTML = `<h4>
//     ${jsonRes.username}
//     </h4>
//      <p>
//         ${jsonRes.tweet}
//     </p>`;
//     eachtweet.setAttribute('class','reverse')

//     document.getElementById("mytweet").appendChild(eachtweet);


// })


// ///LOGOUT


// function logout() {
//     axios({
//         method: 'post',
//         url: url + '/logout',
      
//     }).then((response) => {
//         console.log(response);
//         window.location.href = "login.html"
//     }, (error) => {
//         console.log(error.message);
//     });
//     return false
// }