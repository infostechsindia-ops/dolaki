'use client';

import React from 'react';
import ReviewRating from './ReviewRating';
import styles from './WriteReviewForm.module.css';

export interface WriteReviewFormErrors {
  rating?: string;
  title?: string;
  body?: string;
  displayName?: string;
}

export interface WriteReviewFormProps {
  rating?: number;
  title?: string;
  body?: string;
  displayName?: string;
  showDisplayNameField?: boolean;
  errors?: WriteReviewFormErrors;
  onRatingChange?: (rating: number) => void;
  onTitleChange?: (title: string) => void;
  onBodyChange?: (body: string) => void;
  onDisplayNameChange?: (name: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
  onCancel?: () => void;
  className?: string;
}

export default function WriteReviewForm({
  rating = 0,
  title = '',
  body = '',
  displayName = '',
  showDisplayNameField = false,
  errors = {},
  onRatingChange,
  onTitleChange,
  onBodyChange,
  onDisplayNameChange,
  onSubmit,
  onCancel,
  className = '',
}: WriteReviewFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <form
      className={`${styles.form} ${className}`}
      onSubmit={handleSubmit}
      data-testid="write-review-form"
    >
      <h3 className={styles.title}>Write a Product Review</h3>

      {/* Rating selector */}
      <div className={styles.field}>
        <label className={styles.label} id="rating-label">
          Overall Rating *
        </label>
        <ReviewRating
          rating={rating}
          interactive
          onChange={onRatingChange}
          size="lg"
          label="Select star rating"
        />
        {errors.rating && (
          <span className={styles.error} role="alert" data-testid="rating-error">
            {errors.rating}
          </span>
        )}
      </div>

      {/* Optional Display Name */}
      {showDisplayNameField && (
        <div className={styles.field}>
          <label htmlFor="review-author-name-input" className={styles.label}>
            Your Display Name
          </label>
          <input
            id="review-author-name-input"
            type="text"
            className={styles.input}
            value={displayName}
            onChange={(e) => onDisplayNameChange?.(e.target.value)}
            placeholder="e.g. Alex M."
            data-testid="write-review-display-name"
          />
          {errors.displayName && (
            <span className={styles.error} role="alert">
              {errors.displayName}
            </span>
          )}
        </div>
      )}

      {/* Review Headline/Title */}
      <div className={styles.field}>
        <label htmlFor="review-title-input" className={styles.label}>
          Review Title *
        </label>
        <input
          id="review-title-input"
          type="text"
          className={styles.input}
          value={title}
          onChange={(e) => onTitleChange?.(e.target.value)}
          placeholder="Summarize your experience or opinion"
          data-testid="write-review-title"
        />
        {errors.title && (
          <span className={styles.error} role="alert" data-testid="title-error">
            {errors.title}
          </span>
        )}
      </div>

      {/* Review Body */}
      <div className={styles.field}>
        <label htmlFor="review-body-input" className={styles.label}>
          Review Description *
        </label>
        <textarea
          id="review-body-input"
          className={styles.textarea}
          value={body}
          onChange={(e) => onBodyChange?.(e.target.value)}
          placeholder="What did you like or dislike? What was the product used for?"
          data-testid="write-review-body"
        />
        {errors.body && (
          <span className={styles.error} role="alert" data-testid="body-error">
            {errors.body}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        {onCancel && (
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onCancel}
            data-testid="cancel-review-btn"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className={styles.submitBtn}
          data-testid="submit-review-btn"
        >
          Submit Review
        </button>
      </div>
    </form>
  );
}
