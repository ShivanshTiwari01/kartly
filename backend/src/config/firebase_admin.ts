import admin from 'firebase-admin';

import serviceAccount from './ecommerce-app-46783-firebase-adminsdk-fbsvc-09a088b568.json';

const ecommercedb = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: 'https://ecommerce-app-46783-default-rtdb.firebaseio.com/',
  databaseAuthVariableOverride: {
    uid: 'ecommerce_service_worker_firebasedb',
  },
});

export default ecommercedb;
