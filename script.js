console.log('loaded')

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBbBqsVoj0xdSH1Gt0MZzXr7Ji0zUrqYQk",
    authDomain: "learning-firebase-22532.firebaseapp.com",
    databaseURL: "https://learning-firebase-22532.firebaseio.com",
    projectId: "learning-firebase-22532",
    storageBucket: "learning-firebase-22532.appspot.com",
    messagingSenderId: "639320852486"
};
firebase.initializeApp(config);

var uiConfig = {
    callbacks: {
        // Called when the user has been successfully signed in.
        signInSuccess: function(user, credential, redirectUrl) {
            handleSignedInUser(user);
            // Do not redirect.
            return false;
        }
    },
    signInFlow: 'popup',
    signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // Whether the display name should be displayed in Sign Up page.
        requireDisplayName: true
    },
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    tosUrl: 'https://www.google.com'
}

var ui = new firebaseui.auth.AuthUI(firebase.auth())
var currentUid = null;


function signInWithRedirect () {
    window.location.assign('/widget');
};

function signInWithPopup() {
    window.open('/widget', 'Sign In', 'width=985,height=735');
};



/**
 * Displays the UI for a signed in user.
 * @param {!firebase.User} user
 */
function handleSignedInUser(user) {
    currentUid = user.uid;
    document.getElementById('user-signed-in').style.display = 'block';
    document.getElementById('user-signed-out').style.display = 'none';
    document.getElementById('name').textContent = user.displayName;
    document.getElementById('email').textContent = user.email;
    if (user.photoURL){
        document.getElementById('photo').src = user.photoURL;
        document.getElementById('photo').style.display = 'block';
    } else {
        document.getElementById('photo').style.display = 'none';
    }
};

 /**
* Displays the UI for a signed out user.
*/
var handleSignedOutUser = function() {
    document.getElementById('user-signed-in').style.display = 'none';
    document.getElementById('user-signed-out').style.display = 'block';
    ui.start('#firebaseui-container', uiConfig);
};


// Listen to change in auth state so it displays the correct UI for when
// the user is signed in or not.
firebase.auth().onAuthStateChanged(function(user) {
    // The observer is also triggered when the user's token has expired and is
    // automatically refreshed. In that case, the user hasn't changed so we should
    // not update the UI.
    if (user && user.uid == currentUid) {
        return;
    }
    document.getElementById('loading').style.display = 'none';
    document.getElementById('loaded').style.display = 'block';
    user ? handleSignedInUser(user) : handleSignedOutUser();
});


 /**
  * Deletes the user's account.
  */
var deleteAccount = function() {
    firebase.auth().currentUser.delete().catch(function(error) {
        if (error.code == 'auth/requires-recent-login') {
            // The user's credential is too old. She needs to sign in again.
            firebase.auth().signOut().then(function() {
                // The timeout allows the message to be displayed after the UI has
                // changed to the signed out state.
                setTimeout(function() {
                    alert('Please sign in again to delete your account.');
                }, 1);
            });
        }
    });
};

/**
 * Initializes the app.
 */
var initApp = function() {
    document
        .getElementById('sign-in-with-redirect')
        .addEventListener('click', signInWithRedirect);

    document
        .getElementById('sign-in-with-popup')
        .addEventListener('click', signInWithPopup);

    document
        .getElementById('sign-out')
        .addEventListener('click', function() {
            firebase.auth().signOut();
        });

    document
        .getElementById('delete-account')
        .addEventListener(
          'click', function() {
            deleteAccount();
        });
};

window.addEventListener('load', initApp);





