/**
 * CMD-044 — Address UX Test Suite
 *
 * Tests:
 * 1. AddressBook presentational listing, labels, default badge, edit/delete actions, empty state
 * 2. AddressForm validation (fullName, phone, line1, city, state, pincode), label radio chips, set-default toggle
 * 3. AddressSelector radio-group picker, active card highlights, inline "+ Add New Address" expander
 * 4. Quick-Commerce map coordinates display (lat/lng)
 * 5. ShippingAddressCard label + coordinate map pin rendering
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddressBook, { AddressBookEntry } from '../src/components/checkout/AddressBook';
import AddressForm from '../src/components/checkout/AddressForm';
import AddressSelector from '../src/components/checkout/AddressSelector';
import ShippingAddressCard from '../src/components/checkout/ShippingAddressCard';

const MOCK_ADDRESSES: AddressBookEntry[] = [
  {
    id: 'addr-1',
    label: 'Home',
    fullName: 'Arif Al Nukhbah',
    phone: '+91 98765 43210',
    line1: 'Apt 402, Sea Green Apartments',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    isDefault: true,
    lat: 19.076,
    lng: 72.8777,
  },
  {
    id: 'addr-2',
    label: 'Work',
    fullName: 'Arif Work',
    phone: '+91 98765 00000',
    line1: 'Tech Park Tower B',
    line2: 'BKC',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400051',
    isDefault: false,
  },
];

describe('CMD-044 — Address UX Suite', () => {
  // ── 1. AddressBook Tests ──────────────────────────────────────────────────

  it('T01: renders empty state when no saved addresses exist', () => {
    const onAdd = jest.fn();
    render(
      <AddressBook
        addresses={[]}
        onAdd={onAdd}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onSetDefault={jest.fn()}
      />
    );
    expect(screen.getByTestId('address-book-empty')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('add-address-btn-empty'));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('T02: renders list of addresses with labels and default badge', () => {
    render(
      <AddressBook
        addresses={MOCK_ADDRESSES}
        onAdd={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onSetDefault={jest.fn()}
      />
    );
    const cards = screen.getAllByTestId('address-card');
    expect(cards).toHaveLength(2);
    expect(screen.getByTestId('address-default-badge')).toHaveTextContent('Default');
    const labels = screen.getAllByTestId('address-label');
    expect(labels[0]).toHaveTextContent('Home');
    expect(labels[1]).toHaveTextContent('Work');
  });

  it('T03: fires onEdit, onDelete, and onSetDefault callbacks', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const onSetDefault = jest.fn();

    render(
      <AddressBook
        addresses={MOCK_ADDRESSES}
        onAdd={jest.fn()}
        onEdit={onEdit}
        onDelete={onDelete}
        onSetDefault={onSetDefault}
      />
    );

    fireEvent.click(screen.getAllByTestId('edit-address-btn')[0]);
    expect(onEdit).toHaveBeenCalledWith(MOCK_ADDRESSES[0]);

    fireEvent.click(screen.getAllByTestId('delete-address-btn')[0]);
    expect(onDelete).toHaveBeenCalledWith('addr-1');

    fireEvent.click(screen.getByTestId('set-default-btn'));
    expect(onSetDefault).toHaveBeenCalledWith('addr-2');
  });

  it('T04: displays quick-commerce map coordinates when showCoordinates=true', () => {
    render(
      <AddressBook
        addresses={MOCK_ADDRESSES}
        onAdd={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onSetDefault={jest.fn()}
        showCoordinates
      />
    );
    expect(screen.getByTestId('address-coords')).toHaveTextContent('19.07600, 72.87770');
  });

  // ── 2. AddressForm Tests ──────────────────────────────────────────────────

  it('T05: renders all required form inputs and label radio group', () => {
    render(<AddressForm onSubmit={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByTestId('address-form')).toBeInTheDocument();
    expect(screen.getByTestId('address-input-name')).toBeInTheDocument();
    expect(screen.getByTestId('address-input-phone')).toBeInTheDocument();
    expect(screen.getByTestId('address-input-line1')).toBeInTheDocument();
    expect(screen.getByTestId('address-input-city')).toBeInTheDocument();
    expect(screen.getByTestId('address-input-state')).toBeInTheDocument();
    expect(screen.getByTestId('address-input-pincode')).toBeInTheDocument();
    expect(screen.getByTestId('address-label-radio-home')).toBeChecked();
  });

  it('T06: surfaces validation errors on submit with empty fields', async () => {
    const onSubmit = jest.fn();
    render(<AddressForm onSubmit={onSubmit} onCancel={jest.fn()} />);

    fireEvent.click(screen.getByTestId('address-form-submit'));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByTestId('error-fullName')).toHaveTextContent('Full name is required.');
    expect(screen.getByTestId('error-phone')).toHaveTextContent('Phone number is required.');
    expect(screen.getByTestId('error-line1')).toHaveTextContent('Street address line 1 is required.');
    expect(screen.getByTestId('error-city')).toHaveTextContent('City is required.');
    expect(screen.getByTestId('error-state')).toHaveTextContent('State is required.');
    expect(screen.getByTestId('error-pincode')).toHaveTextContent('Pincode / Postal code is required.');
  });

  it('T07: validates invalid phone and pincode formats', async () => {
    render(<AddressForm onSubmit={jest.fn()} onCancel={jest.fn()} />);

    fireEvent.change(screen.getByTestId('address-input-name'), { target: { value: 'Arif' } });
    fireEvent.change(screen.getByTestId('address-input-phone'), { target: { value: 'invalid-phone' } });
    fireEvent.change(screen.getByTestId('address-input-line1'), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByTestId('address-input-city'), { target: { value: 'Mumbai' } });
    fireEvent.change(screen.getByTestId('address-input-state'), { target: { value: 'MH' } });
    fireEvent.change(screen.getByTestId('address-input-pincode'), { target: { value: '!!' } });

    fireEvent.click(screen.getByTestId('address-form-submit'));

    expect(screen.getByTestId('error-phone')).toHaveTextContent('Please enter a valid phone number.');
    expect(screen.getByTestId('error-pincode')).toHaveTextContent('Please enter a valid postal code.');
  });

  it('T08: calls onSubmit with clean form data when valid', async () => {
    const onSubmit = jest.fn();
    render(<AddressForm onSubmit={onSubmit} onCancel={jest.fn()} />);

    fireEvent.change(screen.getByTestId('address-input-name'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByTestId('address-input-phone'), { target: { value: '+91 9876543210' } });
    fireEvent.change(screen.getByTestId('address-input-line1'), { target: { value: '45 Park Ave' } });
    fireEvent.change(screen.getByTestId('address-input-city'), { target: { value: 'Pune' } });
    fireEvent.change(screen.getByTestId('address-input-state'), { target: { value: 'Maharashtra' } });
    fireEvent.change(screen.getByTestId('address-input-pincode'), { target: { value: '411001' } });
    fireEvent.click(screen.getByTestId('address-label-radio-work'));
    fireEvent.click(screen.getByTestId('address-checkbox-default'));

    fireEvent.click(screen.getByTestId('address-form-submit'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        fullName: 'Jane Doe',
        phone: '+91 9876543210',
        line1: '45 Park Ave',
        line2: '',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        label: 'Work',
        isDefault: true,
        id: undefined,
        lat: undefined,
        lng: undefined,
      });
    });
  });

  // ── 3. AddressSelector Tests ──────────────────────────────────────────────

  it('T09: renders radio options for saved addresses with selection highlight', () => {
    const onSelect = jest.fn();
    render(
      <AddressSelector
        addresses={MOCK_ADDRESSES}
        selectedId="addr-1"
        onSelect={onSelect}
        onAddNew={jest.fn()}
      />
    );

    expect(screen.getByTestId('address-selector')).toBeInTheDocument();
    expect(screen.getByTestId('address-radio-addr-1')).toBeChecked();
    expect(screen.getByTestId('selected-check-icon')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('address-radio-addr-2'));
    expect(onSelect).toHaveBeenCalledWith('addr-2');
  });

  it('T10: expands inline AddressForm when "+ Add New Address" is clicked', () => {
    render(
      <AddressSelector
        addresses={MOCK_ADDRESSES}
        selectedId="addr-1"
        onSelect={jest.fn()}
        onAddNew={jest.fn()}
      />
    );

    fireEvent.click(screen.getByTestId('add-new-address-inline-btn'));
    expect(screen.getByTestId('address-form')).toBeInTheDocument();
  });

  // ── 4. ShippingAddressCard Quick-Commerce Coordinates ─────────────────────

  it('T11: ShippingAddressCard displays coordinates when showCoordinates=true', () => {
    render(
      <ShippingAddressCard
        address={{
          name: 'Arif',
          phone: '+91 98765 43210',
          addressLine1: 'Sea Green Apts',
          city: 'Mumbai',
          state: 'MH',
          country: 'India',
          postalCode: '400050',
          lat: 19.076,
          lng: 72.8777,
        }}
        showCoordinates
      />
    );

    expect(screen.getByTestId('address-coords')).toHaveTextContent('📍 19.07600, 72.87770');
  });
});
