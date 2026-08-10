import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FladoPassPage from '../src/app/flado/pass/page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('FladoPassPage Web Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global as any).fetch = jest.fn();
    localStorage.clear();
  });

  it('renders promotional pass plan options ($3.99, $9.99, $29.99)', async () => {
    (global as any).fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isVip: false }),
    });

    render(<FladoPassPage />);

    expect(screen.getByText('Join Flado Pass Elite')).toBeInTheDocument();
    expect(screen.getByText('Monthly Superpass')).toBeInTheDocument();
    expect(screen.getByText('$3.99')).toBeInTheDocument();
    expect(screen.getByText('Quarterly Valuepass')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
    expect(screen.getByText('Annual VIP Pass')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  it('displays active membership status badge when customer has active VIP subscription', async () => {
    localStorage.setItem('aura_token', 'mock-token');

    (global as any).fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        isVip: true,
        plan: 'MONTHLY',
        status: 'ACTIVE',
        expiresAt: '2026-09-07T00:00:00.000Z',
        cancelAtPeriodEnd: false,
      }),
    });

    render(<FladoPassPage />);

    await waitFor(() => {
      expect(screen.getByText('Your Flado Pass is Active!')).toBeInTheDocument();
    });
    expect(screen.getByText('Cancel Renewal')).toBeInTheDocument();
  });

  it('submits plan activation and payment confirmation to backend API', async () => {
    localStorage.setItem('aura_token', 'mock-token');

    // 1. Initial status fetch
    (global as any).fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isVip: false }),
    });

    render(<FladoPassPage />);

    // 2. Mock subscribe endpoint call
    (global as any).fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        subscription: { id: 'sub-101', status: 'PENDING_PAYMENT' },
        paymentIntent: { id: 'pi-101', clientSecret: 'sec_101' },
      }),
    });

    // 3. Mock confirm-payment endpoint call
    (global as any).fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 'sub-101',
        plan: 'QUARTERLY',
        status: 'ACTIVE',
        expiresAt: '2026-11-07T00:00:00.000Z',
      }),
    });

    const activateBtn = screen.getByText(/Activate Flado Pass/i);
    fireEvent.click(activateBtn);

    await waitFor(() => {
      expect(screen.getByText('Your Flado Pass is Active!')).toBeInTheDocument();
    });
  });
});
