import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface NotificationAction {
  label: string;
  handler: () => void;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: Date;
  duration?: number;
  autoClose?: boolean;
  title?: string;
  actions?: NotificationAction[];
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private notifications$ = this.notificationsSubject.asObservable();

  constructor() { }

  getNotifications(): Observable<Notification[]> {
    return this.notifications$;
  }

  private addNotification(message: string, type: 'success' | 'error' | 'info' | 'warning', duration: number = 5000): void {
    const notification: Notification = {
      id: this.generateId(),
      message,
      type,
      timestamp: new Date(),
      duration,
      autoClose: true
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);

    // Auto remove notification after duration
    if (notification.autoClose) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, duration);
    }

    // Also show in console and alert for now
    this.showNotification(message, type);
  }

  removeNotification(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const filteredNotifications = currentNotifications.filter(n => n.id !== id);
    this.notificationsSubject.next(filteredNotifications);
  }

  // Alias pour la méthode remove utilisée dans le composant
  remove(id: string): void {
    this.removeNotification(id);
  }

  success(message: string): void {
    this.addNotification(message, 'success');
  }

  error(message: string): void {
    this.addNotification(message, 'error', 10000); // Longer duration for errors
  }

  info(message: string): void {
    this.addNotification(message, 'info');
  }

  warning(message: string): void {
    this.addNotification(message, 'warning', 7000);
  }

  orderCreated(orderNumber: string): void {
    this.success(`Commande ${orderNumber} créée avec succès !`);
  }

  handleApiError(error: any): void {
    let message = 'Une erreur s\'est produite';

    if (error?.error?.message) {
      message = error.error.message;
    } else if (error?.message) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }

    this.error(message);
  }

  clearAll(): void {
    this.notificationsSubject.next([]);
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private showNotification(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    // Pour l'instant, utilisons console.log et alert
    // Dans une vraie application, on utiliserait une bibliothèque comme Angular Material Snackbar
    console.log(`${type.toUpperCase()}: ${message}`);

    if (type === 'error') {
      alert(`❌ ${message}`);
    } else if (type === 'success') {
      alert(`✅ ${message}`);
    } else if (type === 'warning') {
      alert(`⚠️ ${message}`);
    } else {
      alert(`ℹ️ ${message}`);
    }
  }
}
