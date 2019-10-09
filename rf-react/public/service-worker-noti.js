/**
 * Created by thihara on 8/29/16.
 * 
 * The service worker for displaying push notifications.
 */

self.addEventListener('push', function(event) {
    console.log(event);
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        console.log("just return!")
        console.log(self.Notification);
        console.log(self.Notification.permission);
        return;
    }

    var data = {};
    if (event.data) {
        data = event.data.json();
    }
    var title = data.title;
    var message = data.message;
    var icon = "img/FM_logo_2013.png";

    self.clickTarget = data.clickTarget;

    console.log("TRY !!");
    event.waitUntil(self.registration.showNotification(title, {
        body: message,
        tag: 'push-demo',
        icon: icon,
        badge: icon
    }));
});

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();

    if(clients.openWindow){
        event.waitUntil(clients.openWindow(self.clickTarget));
    }
});