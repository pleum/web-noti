self.addEventListener('push', e => {
  let body;

  if (e.data) {
    body = e.data.text();
  } else {
    body = 'Push message no payload';
  }

  const options = {
    body: body
  };
  e.waitUntil(self.registration.showNotification('Push Notification', options));
});
