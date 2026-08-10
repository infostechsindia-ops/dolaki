import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ReviewsSection, {
  ReviewsHeader,
  RatingSummary,
  RatingDistribution,
  ReviewsToolbar,
  ReviewList,
  ReviewCard,
  ReviewAuthor,
  ReviewRating,
  ReviewMedia,
  ReviewHelpfulActions,
  WriteReviewForm,
  ReviewsEmptyState,
} from '../src/components/reviews';

const MOCK_SUMMARY = {
  averageRating: 4.6,
  formattedAverageRating: '4.6',
  totalReviews: 42,
  totalRatings: 50,
};

const MOCK_DISTRIBUTION = [
  { rating: 5, count: 35, percentage: 70 },
  { rating: 4, count: 10, percentage: 20 },
  { rating: 3, count: 3, percentage: 6 },
  { rating: 2, count: 1, percentage: 2 },
  { rating: 1, count: 1, percentage: 2 },
];

const MOCK_REVIEW_VERIFIED = {
  id: 'rev-1',
  authorName: 'Sarah Jenkins',
  authorAvatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  rating: 5,
  title: 'Outstanding Quality & Design',
  body: 'This product exceeded my expectations! The build quality is top-notch.',
  dateText: 'August 2, 2026',
  isVerifiedPurchase: true,
  variantInfo: 'Color: Midnight Blue',
  media: [
    { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300', alt: 'Customer product unboxing photo', type: 'image' as const }
  ],
  helpfulCount: 14,
  isHelpful: false,
};

const MOCK_REVIEW_UNVERIFIED = {
  id: 'rev-2',
  authorName: 'Dave Miller',
  rating: 4,
  title: 'Good value for money',
  body: 'Decent performance for the price point.',
  dateText: 'July 28, 2026',
  isVerifiedPurchase: false,
  helpfulCount: 3,
};

describe('CMD-034 Customer Reviews & Ratings Foundation', () => {
  // 1. ReviewsHeader renders heading and supplied review count
  it('1. ReviewsHeader renders heading and supplied review count', () => {
    const onWrite = jest.fn();
    render(<ReviewsHeader title="Customer Feedback" totalReviews={42} onWriteReview={onWrite} />);

    expect(screen.getByTestId('reviews-header')).toBeInTheDocument();
    expect(screen.getByTestId('reviews-header-title')).toHaveTextContent('Customer Feedback');
    expect(screen.getByTestId('reviews-header-count')).toHaveTextContent('(42 reviews)');

    const btn = screen.getByTestId('write-review-btn');
    fireEvent.click(btn);
    expect(onWrite).toHaveBeenCalledTimes(1);
  });

  // 2. RatingSummary renders authoritative values verbatim
  it('2. RatingSummary renders authoritative values verbatim without calculations', () => {
    render(<RatingSummary {...MOCK_SUMMARY} />);

    expect(screen.getByTestId('rating-summary')).toBeInTheDocument();
    expect(screen.getByTestId('rating-summary-average')).toHaveTextContent('4.6');
    expect(screen.getByTestId('rating-summary-counts')).toHaveTextContent(
      'Based on 50 ratings & 42 reviews'
    );
  });

  // 3. RatingDistribution renders supplied counts/percentages without calculations
  it('3. RatingDistribution renders supplied counts/percentages without calculations', () => {
    render(<RatingDistribution distribution={MOCK_DISTRIBUTION} />);

    expect(screen.getByTestId('rating-distribution')).toBeInTheDocument();
    expect(screen.getByTestId('distribution-count-5')).toHaveTextContent('35');
    expect(screen.getByTestId('distribution-progress-5')).toHaveAttribute('value', '70');
    expect(screen.getByTestId('distribution-count-1')).toHaveTextContent('1');
    expect(screen.getByTestId('distribution-progress-1')).toHaveAttribute('value', '2');
  });

  // 4. ReviewRating exposes accessible star rating text
  it('4. ReviewRating exposes accessible star rating text and avoids redundant SR output', () => {
    render(<ReviewRating rating={4} maxRating={5} label="4 out of 5 stars" />);

    const ratingEl = screen.getByTestId('review-rating');
    expect(ratingEl).toHaveAttribute('role', 'img');
    expect(ratingEl).toHaveAttribute('aria-label', '4 out of 5 stars');
  });

  // 5. ReviewCard renders reviewer, title, body, date and rating
  it('5. ReviewCard renders reviewer, title, body, date and rating', () => {
    render(<ReviewCard review={MOCK_REVIEW_VERIFIED} />);

    expect(screen.getByTestId('review-card-rev-1')).toBeInTheDocument();
    expect(screen.getByTestId('review-author-name')).toHaveTextContent('Sarah Jenkins');
    expect(screen.getByTestId('review-title')).toHaveTextContent('Outstanding Quality & Design');
    expect(screen.getByTestId('review-body')).toHaveTextContent('This product exceeded my expectations!');
    expect(screen.getByTestId('review-date')).toHaveTextContent('August 2, 2026');
    expect(screen.getByTestId('review-variant')).toHaveTextContent('• Color: Midnight Blue');
  });

  // 6. Verified purchase badge appears only when supplied as verified
  it('6. Verified purchase badge appears only when supplied as verified', () => {
    const { rerender } = render(<ReviewCard review={MOCK_REVIEW_VERIFIED} />);
    expect(screen.getByTestId('verified-badge')).toBeInTheDocument();

    rerender(<ReviewCard review={MOCK_REVIEW_UNVERIFIED} />);
    expect(screen.queryByTestId('verified-badge')).not.toBeInTheDocument();
  });

  // 7. ReviewMedia renders supplied media with accessible alt text
  it('7. ReviewMedia renders supplied media with accessible alt text', () => {
    const onMediaClick = jest.fn();
    render(<ReviewMedia media={MOCK_REVIEW_VERIFIED.media!} onMediaClick={onMediaClick} />);

    expect(screen.getByTestId('review-media-grid')).toBeInTheDocument();
    const mediaItem = screen.getByTestId('review-media-item-0');
    expect(mediaItem).toBeInTheDocument();

    const img = screen.getByAltText('Customer product unboxing photo');
    expect(img).toBeInTheDocument();

    fireEvent.click(mediaItem);
    expect(onMediaClick).toHaveBeenCalledWith(MOCK_REVIEW_VERIFIED.media![0], 0);
  });

  // 8. Helpful action triggers callback without internal persistence
  it('8. Helpful action triggers callback without internal persistence', () => {
    const onHelpful = jest.fn();
    const onReport = jest.fn();

    render(
      <ReviewHelpfulActions
        helpfulCount={14}
        onHelpful={onHelpful}
        onReport={onReport}
      />
    );

    const helpfulBtn = screen.getByTestId('helpful-btn');
    expect(helpfulBtn).toHaveTextContent('Helpful (14)');

    fireEvent.click(helpfulBtn);
    expect(onHelpful).toHaveBeenCalledTimes(1);

    const reportBtn = screen.getByTestId('report-btn');
    fireEvent.click(reportBtn);
    expect(onReport).toHaveBeenCalledTimes(1);
  });

  // 9. ReviewsToolbar triggers filter/sort callbacks
  it('9. ReviewsToolbar triggers filter/sort callbacks', () => {
    const onSortChange = jest.fn();
    const onRatingFilterChange = jest.fn();
    const onVerifiedFilterChange = jest.fn();

    render(
      <ReviewsToolbar
        sortBy="MOST_RECENT"
        ratingFilter="ALL"
        verifiedOnly={false}
        onSortChange={onSortChange}
        onRatingFilterChange={onRatingFilterChange}
        onVerifiedFilterChange={onVerifiedFilterChange}
      />
    );

    const sortSelect = screen.getByTestId('reviews-sort-select');
    fireEvent.change(sortSelect, { target: { value: 'HIGHEST_RATING' } });
    expect(onSortChange).toHaveBeenCalledWith('HIGHEST_RATING');

    const ratingSelect = screen.getByTestId('reviews-rating-filter');
    fireEvent.change(ratingSelect, { target: { value: '5' } });
    expect(onRatingFilterChange).toHaveBeenCalledWith('5');

    const verifiedCheckbox = screen.getByTestId('reviews-verified-filter');
    fireEvent.click(verifiedCheckbox);
    expect(onVerifiedFilterChange).toHaveBeenCalledWith(true);
  });

  // 10. WriteReviewForm fields have proper labels and callbacks
  it('10. WriteReviewForm fields have proper labels and callbacks', () => {
    const onRatingChange = jest.fn();
    const onTitleChange = jest.fn();
    const onBodyChange = jest.fn();
    const onSubmit = jest.fn();

    render(
      <WriteReviewForm
        rating={4}
        title="Great product"
        body="Detailed feedback here."
        errors={{ title: 'Title is required' }}
        onRatingChange={onRatingChange}
        onTitleChange={onTitleChange}
        onBodyChange={onBodyChange}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByTestId('write-review-form')).toBeInTheDocument();

    const titleInput = screen.getByTestId('write-review-title');
    expect(titleInput).toHaveValue('Great product');
    expect(screen.getByLabelText(/Review Title \*/i)).toBeInTheDocument();

    const bodyInput = screen.getByTestId('write-review-body');
    expect(bodyInput).toHaveValue('Detailed feedback here.');
    expect(screen.getByLabelText(/Review Description \*/i)).toBeInTheDocument();

    expect(screen.getByTestId('title-error')).toHaveTextContent('Title is required');

    fireEvent.change(titleInput, { target: { value: 'Updated title' } });
    expect(onTitleChange).toHaveBeenCalledWith('Updated title');

    const submitBtn = screen.getByTestId('submit-review-btn');
    fireEvent.click(submitBtn);
    expect(onSubmit).toHaveBeenCalled();
  });

  // 11. ReviewsEmptyState reuses EmptyState
  it('11. ReviewsEmptyState reuses EmptyState', () => {
    const onWriteFirstReview = jest.fn();
    render(<ReviewsEmptyState onWriteFirstReview={onWriteFirstReview} />);

    expect(screen.getByTestId('reviews-empty-state')).toBeInTheDocument();
    expect(screen.getByText('No reviews yet')).toBeInTheDocument();

    const btn = screen.getByRole('button', { name: /Write the first review/i });
    fireEvent.click(btn);
    expect(onWriteFirstReview).toHaveBeenCalledTimes(1);
  });

  // 12. ReviewsSection composes correctly
  it('12. ReviewsSection composes correctly with all child sub-components', () => {
    render(
      <ReviewsSection
        summary={MOCK_SUMMARY}
        distribution={MOCK_DISTRIBUTION}
        reviews={[MOCK_REVIEW_VERIFIED, MOCK_REVIEW_UNVERIFIED]}
        toolbar={{ sortBy: 'MOST_RECENT' }}
      />
    );

    expect(screen.getByTestId('reviews-section')).toBeInTheDocument();
    expect(screen.getByTestId('reviews-header')).toBeInTheDocument();
    expect(screen.getByTestId('rating-summary')).toBeInTheDocument();
    expect(screen.getByTestId('rating-distribution')).toBeInTheDocument();
    expect(screen.getByTestId('reviews-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('review-list')).toBeInTheDocument();
  });

  // 13. Marketplace and Quick-Commerce surface styling works
  it('13. Marketplace and Quick-Commerce surface styling works', () => {
    const { rerender } = render(
      <ReviewsSection
        summary={MOCK_SUMMARY}
        distribution={MOCK_DISTRIBUTION}
        surface="MARKETPLACE"
      />
    );

    expect(screen.getByTestId('reviews-section')).toHaveAttribute('data-surface', 'marketplace');

    rerender(
      <ReviewsSection
        summary={MOCK_SUMMARY}
        distribution={MOCK_DISTRIBUTION}
        surface="QUICK_COMMERCE"
      />
    );

    expect(screen.getByTestId('reviews-section')).toHaveAttribute('data-surface', 'quick-commerce');
  });

  // 14. No fetch/localStorage/database communication
  it('14. No fetch/localStorage/database communication', () => {
    if (!window.fetch) window.fetch = jest.fn() as any;
    const spyFetch = jest.spyOn(window, 'fetch');
    const spyStorage = jest.spyOn(Storage.prototype, 'getItem');

    render(
      <ReviewsSection
        summary={MOCK_SUMMARY}
        distribution={MOCK_DISTRIBUTION}
        reviews={[MOCK_REVIEW_VERIFIED]}
      />
    );

    expect(spyFetch).not.toHaveBeenCalled();
    expect(spyStorage).not.toHaveBeenCalledWith(expect.stringContaining('review'));

    spyFetch.mockRestore();
    spyStorage.mockRestore();
  });

  // 15. No aggregate rating or distribution calculations
  it('15. No aggregate rating or distribution calculations performed client side', () => {
    const customSummary = {
      averageRating: 4.8,
      formattedAverageRating: '4.8',
      totalReviews: 10,
      totalRatings: 10,
    };

    render(
      <RatingSummary {...customSummary} />
    );

    // Verifies rendering value verbatim from props
    expect(screen.getByTestId('rating-summary-average')).toHaveTextContent('4.8');
    expect(screen.getByTestId('rating-summary-counts')).toHaveTextContent('Based on 10 ratings & 10 reviews');
  });

  // 16. Vendor response rendering in ReviewCard
  it('16. renders official seller/vendor response in ReviewCard when vendorResponse is supplied', () => {
    const reviewWithVendorResponse = {
      ...MOCK_REVIEW_VERIFIED,
      vendorResponse: {
        vendorName: 'AuraMart Direct',
        text: 'Thank you for your fantastic review! We are glad you love the quality.',
        dateText: 'August 3, 2026',
      },
    };

    render(<ReviewCard review={reviewWithVendorResponse} />);

    expect(screen.getByTestId('review-vendor-response')).toBeInTheDocument();
    expect(screen.getByTestId('review-vendor-response')).toHaveTextContent('Response from AuraMart Direct');
    expect(screen.getByTestId('review-vendor-response')).toHaveTextContent('Thank you for your fantastic review!');
  });
});
