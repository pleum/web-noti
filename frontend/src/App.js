import React from 'react';
import axios from 'axios';
import { urlB64ToUint8Array } from './util';

const subscribePush = async () => {
    if ('serviceWorker' in navigator) {
        try {
            const subRes = await axios.get('http://localhost:8080/sub');
            const publicKey = subRes.data.publicKey;
            console.log(publicKey);

            const pushManager = await getPushManager();
            const subscription = await pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlB64ToUint8Array(publicKey)
            });

            const sub = JSON.stringify(subscription.toJSON());
            await axios.post('http://localhost:8080/sub', { sub });
            console.log('Subscribe', sub);
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
    return (
        <div>
            <header>
                <h1>Web Notification</h1>
            </header>
            <main>
                <div>
                    <button onClick={subscribePush}>Subscribe</button>
                    <button onClick={unsubscribePush}>Unsubscribe</button>
                </div>
            </main>
        </div>
    );
}

export default App;
