import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


const firebaseConfig = {

apiKey: "AIzaSyAOxPSV6sjvwbJow2wYqwPuhm3aPClXv1s",

authDomain: "kelvin-nyoni-cash-point.firebaseapp.com",

projectId: "kelvin-nyoni-cash-point",

storageBucket: "kelvin-nyoni-cash-point.firebasestorage.app",

messagingSenderId: "849756534162",

appId: "1:849756534162:web:55536b30ecf9c89655bd4b",

measurementId: "G-KYZ7RFKKVH"

};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
