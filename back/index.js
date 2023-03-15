const express = require("express");
const cors = require("cors");
const app = express();
const port = 3080;

app.use(cors());

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://jettracker-ipm-default-rtdb.europe-west1.firebasedatabase.app",
});

const db = admin.database();
const ref = db.ref("/");

ref.once("value").then(function (snapshot) {
  // var key = snapshot.key; // "ada"
  // var childKey = snapshot.child("name/last").key; // "last"
  //console.log(Object.keys(snapshot.val()));
  return snapshot.val();
});

function getFirebaseData() {
  return new Promise(function (resolve, reject) {
    ref
      .once("value")
      .then(function (snapshot) {
        var data = snapshot.val();
        resolve(data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/AllData", (req, res) => {
  getFirebaseData()
    .then(function (data) {
      res.send(data);
    })
    .catch(function (error) {
      console.error(error);
    });
});

app.get("/AllOwner", (req, res) => {
  getAllOwner()
    .then(function (data) {
      res.send(data);
    })
    .catch(function (error) {
      console.error(error);
    });
});

app.listen(port, () => {
  console.log("Le serveur tourne sur le port " + port);
});

// getAllJet()
//   .then(function (data) {
//     console.log(data);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });

function getAllOwner() {
  // var owners = {};
  // ref.once("value").then(function (snapshot) {
  //   owners = Object.keys(snapshot.val());
  // });

  return new Promise(function (resolve, reject) {
    ref
      .once("value")
      .then(function (snapshot) {
        var data = Object.keys(snapshot.val());
        data = Object.fromEntries(Object.entries(data));
        resolve(data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

function getAllJet() {
  var data = [];
  return ref.once("value").then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      const personName = childSnapshot.key;
      const jetsRef = ref.child(personName).child("jets");
      // Récupération des identifiants des jets de chaque personne
      return jetsRef.once("value").then(function (jetsSnapshot) {
        data[personName] = [];
        jetsSnapshot.forEach(function (jetSnapshot) {
          const jetId = jetSnapshot.key;
          data[personName].push(jetId);
          console.log(data);
        });
      });
    });
    return data;
  });
}

// Fonction pour récupérer les informations d'un jet à partir de son identifiant
function getJetInfo(jetId) {
  ref.once("value", function (snapshot) {
    // Parcours des noms des personnes dans la base de données
    snapshot.forEach(function (childSnapshot) {
      const personName = childSnapshot.key;
      const jetsRef = ref.child(personName).child("jets");
      // Vérification si le jet existe
      if (jetsRef.child(jetId)) {
        const jetRef = jetsRef.child(jetId).child("jet");
        // Récupération des informations du jet
        jetRef.once("value", function (jetSnapshot) {
          console.log("Informations du jet " + jetId + " :");
          console.log(jetSnapshot.val());
        });
      }
    });
  });
}

function getAllJets() {
  ref.once("value", function (snapshot) {
    // Parcours des noms des personnes dans la base de données
    snapshot.forEach(function (childSnapshot) {
      const personName = childSnapshot.key;
      const jetsRef = ref.child(personName).child("jets");
      // Vérification si le jet existe
      // if (jetsRef.child(jetId)) {
      //   const jetRef = jetsRef.child(jetId).child("jet");
      //   // Récupération des informations du jet
      //   jetRef.once("value", function (jetSnapshot) {
      //     console.log("Informations du jet " + jetId + " :");
      //     console.log(jetSnapshot.val());
      //   });
      // }

      console.log();
    });
  });
}

// Exemple d'utilisation : récupération des informations du jet "-NQP9W_TcoQeXcECamhT"
// getJetInfo("-NQP9W_TcoQeXcECamhT");
