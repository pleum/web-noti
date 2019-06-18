import React, { useState, useCallback } from 'react';
import { urlB64ToUint8Array } from './util';

const subscribePush = async serverKey => {
  if ('serviceWorker' in navigator) {
    try {
      const pushManager = await getPushManager();
      const subscription = await pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(serverKey)
      });
      console.log('Subscribe', JSON.stringify(subscription.toJSON()));
    } catch (e) {
      if (Notification.permission === 'denied') {
        console.warn('Permission for notifications was denied');
      } else {
        console.error('Unable to subscribe to push', e);
      }
    }
  }
};

const getPushManager = async () => {
  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager;
};

const unsubscribePush = async () => {
  const pushManager = await getPushManager();
  const subscription = await pushManager.getSubscription();
  return subscription.unsubscribe();
};

function App() {
  const [serverKey, setSeverKey] = useState('');

  const subscribePushNotification = useCallback(() => {
    subscribePush(serverKey);
  }, [serverKey]);

  const unsubscribePushNotification = () => {
    unsubscribePush();
  };

  const handleServerKeyChanged = e => {
    setSeverKey(e.target.value);
  };

  return (
    <div>
      <header>
        <h1>Web Notification</h1>
      </header>
      <main>
        <div>
          <div>
            Server key:{' '}
            <input
              type="text"
              value={serverKey}
              onChange={handleServerKeyChanged}
            />
          </div>
          <button onClick={subscribePushNotification}>Subscribe</button>
          <button onClick={unsubscribePushNotification}>Unsubscribe</button>
        </div>
      </main>
    </div>
  );
}

export default App;
