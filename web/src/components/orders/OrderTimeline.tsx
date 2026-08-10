'use client';

import React from 'react';
import { FiCheck } from 'react-icons/fi';
import styles from './OrderTimeline.module.css';

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  isCompleted?: boolean;
  isCurrent?: boolean;
}

export interface OrderTimelineProps {
  events: TimelineEvent[];
  title?: string;
}

export default function OrderTimeline({
  events = [],
  title = 'Order Timeline',
}: OrderTimelineProps) {
  if (!events || events.length === 0) return null;

  return (
    <div className={styles.container} data-testid="order-timeline">
      <h3 className={styles.heading}>{title}</h3>

      <ol className={styles.timelineList} aria-label="Order progress events">
        {events.map((evt, idx) => {
          const isCompleted = evt.isCompleted ?? true;
          const isCurrent = evt.isCurrent ?? false;

          return (
            <li
              key={evt.id ?? idx}
              className={`${styles.eventItem} ${isCompleted ? styles.completed : ''} ${
                isCurrent ? styles.current : ''
              }`}
              data-testid={`timeline-event-${evt.id ?? idx}`}
            >
              <div className={styles.iconColumn}>
                <div className={styles.badge}>
                  {isCompleted ? <FiCheck aria-hidden="true" /> : idx + 1}
                </div>
                {idx < events.length - 1 && <span className={styles.line} aria-hidden="true" />}
              </div>

              <div className={styles.textColumn}>
                <div className={styles.headerRow}>
                  <span className={styles.eventTitle}>{evt.title}</span>
                  {evt.timestamp && (
                    <time className={styles.timestamp}>{evt.timestamp}</time>
                  )}
                </div>
                {evt.description && (
                  <p className={styles.description}>{evt.description}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
