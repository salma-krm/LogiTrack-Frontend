import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, Notification, NotificationAction } from '../../services/notification.service';

@Component({
  selector: 'app-notification-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div
        *ngFor="let notification of notifications; trackBy: trackByFn"
        class="notification"
        [class]="'notification-' + notification.type"
        [@slideIn]>

        <div class="notification-icon">
          <span [innerHTML]="getIcon(notification.type)"></span>
        </div>

        <div class="notification-content">
          <h4 *ngIf="notification.title" class="notification-title">
            {{ notification.title }}
          </h4>
          <p class="notification-message">
            {{ notification.message }}
          </p>

          <div class="notification-actions" *ngIf="notification.actions && notification.actions.length > 0">
            <button
              *ngFor="let action of notification.actions"
              class="notification-action-btn"
              (click)="executeAction(action, notification.id)">
              {{ action.label }}
            </button>
          </div>
        </div>

        <button
          class="notification-close"
          (click)="dismiss(notification.id)"
          aria-label="Fermer">
          ×
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./notification.component.css'],
  animations: []
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription?: Subscription;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.subscription = this.notificationService.getNotifications().subscribe(
      (notifications: Notification[]) => {
        this.notifications = notifications;
      }
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  dismiss(id: string) {
    this.notificationService.remove(id);
  }

  executeAction(action: any, notificationId: string) {
    action.handler();
    this.dismiss(notificationId);
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return 'ℹ️';
    }
  }

  trackByFn = (index: number, item: Notification) => item.id;
}
