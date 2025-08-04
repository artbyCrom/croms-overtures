import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js';

console.log("Initializing Firebase in firebaseConfig.js...");
const firebaseConfig = {
    apiKey: "AIzaSyClVVnUgGkg9u7bxrhPyCvVwchoxP5I_3Q",
    authDomain: "cromsovertures.firebaseapp.com",
    projectId: "cromsovertures",
    storageBucket: "cromsovertures.firebasestorage.app",
    messagingSenderId: "793749427841",
    appId: "1:793749427841:web:20a716878a221be5ccdf80",
    measurementId: "G-3HE7E97FLN"
};

const app = initializeApp(firebaseConfig);
console.log("Firebase app initialized in firebaseConfig.js:", app);
const db = getFirestore(app);
console.log("Firestore db initialized in firebaseConfig.js:", db);

export { db };