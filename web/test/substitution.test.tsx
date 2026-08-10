import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SubstitutionPreferenceSelector from '../src/components/substitution/SubstitutionPreferenceSelector';
import SubstitutionDecisionCard from '../src/components/substitution/SubstitutionDecisionCard';

describe('CMD-056 Substitution Domain Frontend Integration', () => {
  it('1. & 2. SubstitutionPreferenceSelector renders all supported options and fires callback', () => {
    const handleChange = jest.fn();
    render(<SubstitutionPreferenceSelector value="CONTACT_ME" onChange={handleChange} />);

    expect(screen.getByText('Replace with Best Match')).toBeInTheDocument();
    expect(screen.getByText('Contact Me First')).toBeInTheDocument();
    expect(screen.getByText("Don't Substitute")).toBeInTheDocument();

    fireEvent.click(screen.getByText('Replace with Best Match'));
    expect(handleChange).toHaveBeenCalledWith('ALLOW_SUBSTITUTION');
  });

  it('3. & 4. & 5. SubstitutionDecisionCard renders original item, substitute item, prices and difference verbatim', () => {
    render(
      <SubstitutionDecisionCard
        originalTitle="Organic Whole Milk 1L"
        originalPrice="$3.99"
        substituteTitle="Organic Reduced Fat Milk 1L"
        substitutePrice="$2.99"
        priceDifferenceText="-$1.00"
        status="AWAITING_CUSTOMER"
      />,
    );

    expect(screen.getByText('Organic Whole Milk 1L')).toBeInTheDocument();
    expect(screen.getByTestId('original-price')).toHaveTextContent('$3.99');
    expect(screen.getByText('Organic Reduced Fat Milk 1L')).toBeInTheDocument();
    expect(screen.getByTestId('substitute-price')).toHaveTextContent('$2.99');
    expect(screen.getByTestId('price-difference')).toHaveTextContent('-$1.00');
  });

  it('6. & 7. Approve and Reject buttons fire callbacks when in AWAITING_CUSTOMER state', () => {
    const handleApprove = jest.fn();
    const handleReject = jest.fn();

    render(
      <SubstitutionDecisionCard
        originalTitle="Organic Whole Milk 1L"
        originalPrice="$3.99"
        substituteTitle="Organic Reduced Fat Milk 1L"
        substitutePrice="$2.99"
        priceDifferenceText="-$1.00"
        status="AWAITING_CUSTOMER"
        onApprove={handleApprove}
        onReject={handleReject}
      />,
    );

    fireEvent.click(screen.getByText('Approve Substitute'));
    expect(handleApprove).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Reject Substitute'));
    expect(handleReject).toHaveBeenCalledTimes(1);
  });

  it('9. & 10. Renders approved and rejected status indicators correctly', () => {
    const { rerender } = render(
      <SubstitutionDecisionCard
        originalTitle="Organic Whole Milk 1L"
        originalPrice="$3.99"
        substituteTitle="Organic Reduced Fat Milk 1L"
        substitutePrice="$2.99"
        priceDifferenceText="-$1.00"
        status="APPROVED"
      />,
    );

    expect(screen.getByTestId('substitution-status-approved')).toBeInTheDocument();

    rerender(
      <SubstitutionDecisionCard
        originalTitle="Organic Whole Milk 1L"
        originalPrice="$3.99"
        substituteTitle="Organic Reduced Fat Milk 1L"
        substitutePrice="$2.99"
        priceDifferenceText="-$1.00"
        status="REJECTED"
      />,
    );

    expect(screen.getByTestId('substitution-status-rejected')).toBeInTheDocument();
  });

  it('13. Renders accessible aria-live region for asynchronous substitution updates', () => {
    render(
      <SubstitutionDecisionCard
        originalTitle="Organic Whole Milk 1L"
        originalPrice="$3.99"
        substituteTitle="Organic Reduced Fat Milk 1L"
        substitutePrice="$2.99"
        priceDifferenceText="-$1.00"
        status="AWAITING_CUSTOMER"
      />,
    );

    expect(screen.getByTestId('substitution-decision-card')).toHaveAttribute('aria-live', 'polite');
  });
});
