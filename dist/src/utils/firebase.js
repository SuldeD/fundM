"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const app_1 = require("firebase/app");
// import { getAnalytics } from "firebase/analytics";
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDd9Ezy2XZhjm10JpaJm3j3B6ie2ZQ4DRI",
    authDomain: "lucky-button-390607.firebaseapp.com",
    projectId: "lucky-button-390607",
    storageBucket: "lucky-button-390607.appspot.com",
    messagingSenderId: "1069579328470",
    appId: "1:1069579328470:web:8e9f8d35ea71d56824a277",
    measurementId: "G-KFX1HRD52E",
};
// Initialize Firebase
exports.app = (0, app_1.initializeApp)(firebaseConfig);
// export const analytics = getAnalytics(app);
