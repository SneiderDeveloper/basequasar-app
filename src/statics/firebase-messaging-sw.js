importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');
importScripts('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.js');
importScripts('https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js');

const eventChannel = new BroadcastChannel('firebase-messaging-channel');


self.addEventListener('install', (event) => {
  event.waitUntil(handleFetch());
});

function nameDB() {
  let hostname = location.host.split('.')
  let response = hostname

  //Set capitalize to all words
  hostname.forEach((word, index) => {
      if (index >= 1) {
          hostname[index] = word.charAt(0).toUpperCase() + word.slice(1)
      }
  })

  //Remove .com .org....
  if (hostname.length >= 2) response.pop()

  return `${response.join('')}`//Response
}

function handleFetch() {
  return new Promise(async (resolve, reject) => {
    try {
      const md5Hash = CryptoJS.MD5(`https://one.allianceground.com${moment().format('YYYY-MM-DD')}firebase`).toString();
      const response = await fetch(`https://staging-siembra-coffe.ozonohosting.com/api/notification/v1/providers/firebase?filter={%22field%22:%20%22system_name%22}&token=${md5Hash}`);
      const json = await response.json();
      if(json.errors === 'Unauthorized') {
        resolve(response);
        return
      };
      const fields = {
        apiKey: json.data.fields.firebaseApiKey,
        authDomain: json.data.fields.firebaseAuthDomain,
        projectId: json.data.fields.firebaseProjectId,
        storageBucket: json.data.fields.firebaseStorageBucket,
        messagingSenderId: json.data.fields.firebaseMessagingSenderId,
        appId: json.data.fields.firebaseAppId,
        measurementId: json.data.fields.firebaseMeasurementId
      }

      firebase.initializeApp({...fields});

      const messaging = firebase.messaging();

      messaging.onBackgroundMessage((payload) => {
        eventChannel.postMessage(payload);
        const notificationTitle = payload.notification.title;
        const notificationOptions = {
          body: payload.notification.body,
          icon: null,
        };

        self.registration.showNotification(notificationTitle, notificationOptions);
      });

      resolve(response);
    } catch (error) {
      console.error('Error fetching data:', error);
      reject(error);
    }
  });
}



