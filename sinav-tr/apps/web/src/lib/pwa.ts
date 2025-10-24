// PWA utilities and service worker registration

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

class PWAManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private isInstalled = false;
  private swRegistration: ServiceWorkerRegistration | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private async init() {
    // Check if app is already installed
    this.checkIfInstalled();

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.notifyInstallAvailable();
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.deferredPrompt = null;
      console.log('PWA installed successfully');
    });

    // Register service worker
    await this.registerServiceWorker();

    // Request notification permission
    await this.requestNotificationPermission();
  }

  private checkIfInstalled() {
    // Check if app is running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
      return;
    }

    // Check for iOS
    if ('standalone' in window.navigator && (window.navigator as any).standalone) {
      this.isInstalled = true;
      return;
    }

    // Check if installed via getInstalledRelatedApps
    if ('getInstalledRelatedApps' in navigator) {
      (navigator as any).getInstalledRelatedApps().then((apps: any[]) => {
        if (apps.length > 0) {
          this.isInstalled = true;
        }
      });
    }
  }

  private async registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      this.swRegistration = registration;
      console.log('Service Worker registered:', registration.scope);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.notifyUpdateAvailable();
            }
          });
        }
      });

      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000); // Every hour

    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  private async requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      return;
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
    }
  }

  private notifyInstallAvailable() {
    // Dispatch custom event that components can listen to
    window.dispatchEvent(new CustomEvent('pwa-install-available'));
  }

  private notifyUpdateAvailable() {
    // Dispatch custom event for update available
    window.dispatchEvent(new CustomEvent('pwa-update-available'));
  }

  // Public methods
  async installApp(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.log('Install prompt not available');
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        this.deferredPrompt = null;
        return true;
      } else {
        console.log('User dismissed the install prompt');
        return false;
      }
    } catch (error) {
      console.error('Error installing app:', error);
      return false;
    }
  }

  canInstall(): boolean {
    return this.deferredPrompt !== null && !this.isInstalled;
  }

  isAppInstalled(): boolean {
    return this.isInstalled;
  }

  async updateServiceWorker() {
    if (this.swRegistration) {
      await this.swRegistration.update();
      // Tell SW to skip waiting
      if (this.swRegistration.waiting) {
        this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  }

  async subscribeToPushNotifications(): Promise<PushSubscription | null> {
    if (!this.swRegistration) {
      console.error('Service Worker not registered');
      return null;
    }

    if (Notification.permission !== 'granted') {
      console.error('Notification permission not granted');
      return null;
    }

    try {
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
        ),
      });

      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);

      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  async unsubscribeFromPushNotifications(): Promise<boolean> {
    if (!this.swRegistration) {
      return false;
    }

    try {
      const subscription = await this.swRegistration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        // Remove subscription from server
        await this.removeSubscriptionFromServer(subscription);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }

  async checkPushSubscription(): Promise<boolean> {
    if (!this.swRegistration) {
      return false;
    }

    try {
      const subscription = await this.swRegistration.pushManager.getSubscription();
      return subscription !== null;
    } catch (error) {
      console.error('Failed to check push subscription:', error);
      return false;
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private async sendSubscriptionToServer(subscription: PushSubscription) {
    try {
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });
    } catch (error) {
      console.error('Failed to send subscription to server:', error);
    }
  }

  private async removeSubscriptionFromServer(subscription: PushSubscription) {
    try {
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });
    } catch (error) {
      console.error('Failed to remove subscription from server:', error);
    }
  }

  // Offline functionality
  async saveOfflineData(key: string, data: any): Promise<void> {
    if (!('indexedDB' in window)) {
      console.error('IndexedDB not supported');
      return;
    }

    const db = await this.openDatabase();
    const tx = db.transaction(['offline-data'], 'readwrite');
    const store = tx.objectStore('offline-data');
    
    await store.put({
      key,
      data,
      timestamp: Date.now(),
    });
  }

  async getOfflineData(key: string): Promise<any> {
    if (!('indexedDB' in window)) {
      return null;
    }

    const db = await this.openDatabase();
    const tx = db.transaction(['offline-data'], 'readonly');
    const store = tx.objectStore('offline-data');
    
    const result = await store.get(key);
    return result?.data || null;
  }

  async clearOfflineData(): Promise<void> {
    if (!('indexedDB' in window)) {
      return;
    }

    const db = await this.openDatabase();
    const tx = db.transaction(['offline-data'], 'readwrite');
    const store = tx.objectStore('offline-data');
    
    await store.clear();
  }

  private openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('SinavTR', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('offline-data')) {
          db.createObjectStore('offline-data', { keyPath: 'key' });
        }
      };
    });
  }

  // Background sync
  async registerBackgroundSync(tag: string): Promise<void> {
    if (!this.swRegistration || !('sync' in this.swRegistration)) {
      console.log('Background sync not supported');
      return;
    }

    try {
      await (this.swRegistration as any).sync.register(tag);
      console.log(`Background sync registered: ${tag}`);
    } catch (error) {
      console.error('Failed to register background sync:', error);
    }
  }

  // Periodic background sync
  async registerPeriodicSync(tag: string, minInterval: number): Promise<void> {
    if (!this.swRegistration || !('periodicSync' in this.swRegistration)) {
      console.log('Periodic background sync not supported');
      return;
    }

    try {
      const status = await navigator.permissions.query({
        name: 'periodic-background-sync' as PermissionName,
      });

      if (status.state === 'granted') {
        await (this.swRegistration as any).periodicSync.register(tag, {
          minInterval,
        });
        console.log(`Periodic sync registered: ${tag}`);
      }
    } catch (error) {
      console.error('Failed to register periodic sync:', error);
    }
  }
}

// Export singleton instance
export const pwaManager = new PWAManager();

// React hooks for PWA
export function useInstallPrompt() {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    setCanInstall(pwaManager.canInstall());
    setIsInstalled(pwaManager.isAppInstalled());

    const handleInstallAvailable = () => setCanInstall(true);
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
    };

    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    const success = await pwaManager.installApp();
    if (success) {
      setIsInstalled(true);
      setCanInstall(false);
    }
    return success;
  };

  return { canInstall, isInstalled, install };
}

export function useUpdatePrompt() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    const handleUpdateAvailable = () => setUpdateAvailable(true);

    window.addEventListener('pwa-update-available', handleUpdateAvailable);

    return () => {
      window.removeEventListener('pwa-update-available', handleUpdateAvailable);
    };
  }, []);

  const update = async () => {
    await pwaManager.updateServiceWorker();
  };

  return { updateAvailable, update };
}

// Import React hooks
import { useState, useEffect } from 'react';
