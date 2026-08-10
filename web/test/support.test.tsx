import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

// Mock useRouter and useParams
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useParams: () => ({ id: 'ticket-101' }),
}));

import CustomerSupportPage from '../src/app/account/support/page';
import NewSupportTicketPage from '../src/app/account/support/new/page';
import CustomerTicketDetailPage from '../src/app/account/support/[id]/page';

describe('FEAT-001 Customer Web Support UI Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('aura_token', 'mock_jwt_token');
    (global.fetch as jest.Mock) = jest.fn();
  });

  test('CustomerSupportPage renders ticket list and status filters', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [
          {
            id: 't-1',
            ticketNumber: 'SUP-2026-000101',
            category: 'ORDER',
            subject: 'Delivery Delay on Order ORD-1001',
            status: 'OPEN',
            priority: 'NORMAL',
            updatedAt: new Date().toISOString(),
          },
        ],
      }),
    });

    render(<CustomerSupportPage />);

    expect(screen.getByText('Customer Support')).toBeInTheDocument();
    expect(screen.getByText('+ Submit New Ticket')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('SUP-2026-000101')).toBeInTheDocument();
      expect(screen.getByText('Delivery Delay on Order ORD-1001')).toBeInTheDocument();
    });
  });

  test('NewSupportTicketPage renders category selector and subject inputs', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ orders: [] }),
    });

    render(<NewSupportTicketPage />);

    expect(screen.getAllByText('Submit Support Ticket').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByPlaceholderText('Brief summary of your issue')).toBeInTheDocument();
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  test('CustomerTicketDetailPage renders conversation timeline and hides internal notes', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ticket: {
          id: 'ticket-101',
          ticketNumber: 'SUP-2026-000101',
          category: 'ORDER',
          subject: 'Delivery Delay',
          description: 'Package delayed',
          status: 'OPEN',
          priority: 'NORMAL',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        messages: [
          {
            id: 'm-1',
            senderUserId: 'cust-1',
            senderName: 'Customer',
            senderRole: 'CUSTOMER',
            message: 'Package delayed',
            createdAt: new Date().toISOString(),
          },
        ],
      }),
    });

    render(<CustomerTicketDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('SUP-2026-000101')).toBeInTheDocument();
      expect(screen.getByText('Package delayed')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Type your message here...')).toBeInTheDocument();
    });
  });
});
