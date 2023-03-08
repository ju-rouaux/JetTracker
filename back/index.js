var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://jettracker-ipm-default-rtdb.europe-west1.firebasedatabase.app",
});

const db = admin.database();
const ref = db.ref("path/s");

// Envoyer des données à la base de données
ref
  .push({
    name: "John Doe",
    age: 30,
    email: "john.doe@example.com",
  })
  .then(() => {
    console.log("Données envoyées avec succès");
  })
  .catch((error) => {
    console.error("Erreur lors de l'envoi des données :", error);
  });

ref.on("child_added", (snapshot, prevChildKey) => {
  const newPost = snapshot.val();
  console.log("Name: " + newPost.name);
  console.log("Age: " + newPost.age);
  console.log("Email: " + newPost.email);
});
