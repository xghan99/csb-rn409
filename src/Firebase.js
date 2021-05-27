import firebase from "firebase/app";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyD9OfOy4hLn-bDwx6v2MPrhjFQcSqAP3F4",
  authDomain: "auth-goalie-dev-0.firebaseapp.com",
  projectId: "auth-goalie-dev-0",
  storageBucket: "auth-goalie-dev-0.appspot.com",
  messagingSenderId: "224626829398"
};

firebase.initializeApp(config);

const auth = firebase.auth();
export { auth };
