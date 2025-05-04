// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCft9THznNijypMJT0fgGXXJ4TImaFMw-c",
  authDomain: "tpf-pk-54f44.firebaseapp.com",
  projectId: "tpf-pk-54f44",
  storageBucket: "tpf-pk-54f44.firebasestorage.app",
  messagingSenderId: "728080990145",
  appId: "1:728080990145:web:ceedfcb0421f6a33d2f940"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const provider = new GoogleAuthProvider();

const signInButton = document.querySelector("#signInButton");
const signOutButton = document.querySelector("#signOutButton");

const userSignIn = async () => {
    signInWithPopup(auth, provider).then((result) => {
        const user = result.user;
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
}

const userSignOut = async () => {
    signOut(auth).then(() => {
        alert("You have been signed out!")
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    })
 }

 onAuthStateChanged(auth, (user) => {
    if (user) {
        alert("You are authenticated with Google");
        console.log(user);
        document.querySelector('input[type="email"]').value = user.email;
        document.getElementById('firstName').value = user.displayName.split(' ')[0];
        if (user.displayName.split(' ').length > 1)
            document.getElementById('lastName').value = user.displayName.split(' ')[1];
    }
 }); 

signInButton.addEventListener("click", userSignIn);
signOutButton.addEventListener("click", userSignOut);