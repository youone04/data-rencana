import firebase from 'firebase';
const firbbaseConfig = {
    apiKey: "AIzaSyCs_UQjL1kQmArfxgHVNw_53QhmXjKoYes",
    authDomain: "notesapps-42a21.firebaseapp.com",
    projectId: "notesapps-42a21",
    storageBucket: "notesapps-42a21.appspot.com",
    messagingSenderId: "557442312713",
    appId: "1:557442312713:web:69b8ed8cd17e5746df26d8"
};
if(!firebase.apps.length){
    firebase.initializeApp(firbbaseConfig);
}else{
    firebase.app();
}
export default firebase;