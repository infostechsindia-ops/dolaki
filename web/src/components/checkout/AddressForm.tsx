'use client';

import React, { useState } from 'react';
import styles from './AddressForm.module.css';

export interface AddressFormData {
  id?: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  label: 'Home' | 'Work' | 'Other';
  isDefault: boolean;
  lat?: number;
  lng?: number;
}

export interface AddressFormProps {
  initialValues?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
  title?: string;
}

export interface AddressFormErrors {
  fullName?: string;
  phone?: string;
  line1?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export default function AddressForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  title = initialValues?.id ? 'Edit Address' : 'Add New Address',
}: AddressFormProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    id: initialValues?.id,
    fullName: initialValues?.fullName || '',
    phone: initialValues?.phone || '',
    line1: initialValues?.line1 || '',
    line2: initialValues?.line2 || '',
    city: initialValues?.city || '',
    state: initialValues?.state || '',
    pincode: initialValues?.pincode || '',
    label: initialValues?.label || 'Home',
    isDefault: initialValues?.isDefault ?? false,
    lat: initialValues?.lat,
    lng: initialValues?.lng,
  });

  const [errors, setErrors] = useState<AddressFormErrors>({});

  const validate = (): boolean => {
    const newErrors: AddressFormErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\+?[0-9\s-]{8,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number.';
    }
    if (!formData.line1.trim()) {
      newErrors.line1 = 'Street address line 1 is required.';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required.';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required.';
    }
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode / Postal code is required.';
    } else if (!/^[0-9A-Za-z\s-]{3,10}$/.test(formData.pincode.trim())) {
      newErrors.pincode = 'Please enter a valid postal code.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name as keyof AddressFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
      data-testid="address-form"
    >
      <h3 className={styles.title}>{title}</h3>

      {/* Label selector */}
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Address Type</legend>
        <div className={styles.labelRadioGroup} role="radiogroup">
          {(['Home', 'Work', 'Other'] as const).map((lbl) => (
            <label
              key={lbl}
              className={[
                styles.labelChip,
                formData.label === lbl ? styles.labelChipActive : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <input
                type="radio"
                name="label"
                value={lbl}
                checked={formData.label === lbl}
                onChange={handleChange}
                className={styles.radioInput}
                data-testid={`address-label-radio-${lbl.toLowerCase()}`}
              />
              <span>{lbl}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Full Name */}
      <div className={styles.field}>
        <label htmlFor="fullName" className={styles.label}>
          Full Name <span className={styles.required}>*</span>
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          className={[styles.input, errors.fullName ? styles.inputError : ''].join(' ')}
          placeholder="e.g. Arif Al Nukhbah"
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          data-testid="address-input-name"
        />
        {errors.fullName && (
          <p id="fullName-error" className={styles.errorMsg} role="alert" data-testid="error-fullName">
            {errors.fullName}
          </p>
        )}
      </div>

      {/* Phone */}
      <div className={styles.field}>
        <label htmlFor="phone" className={styles.label}>
          Mobile Phone Number <span className={styles.required}>*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          className={[styles.input, errors.phone ? styles.inputError : ''].join(' ')}
          placeholder="e.g. +91 98765 43210"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
          data-testid="address-input-phone"
        />
        {errors.phone && (
          <p id="phone-error" className={styles.errorMsg} role="alert" data-testid="error-phone">
            {errors.phone}
          </p>
        )}
      </div>

      {/* Line 1 */}
      <div className={styles.field}>
        <label htmlFor="line1" className={styles.label}>
          Flat, House No., Building, Street <span className={styles.required}>*</span>
        </label>
        <input
          id="line1"
          name="line1"
          type="text"
          value={formData.line1}
          onChange={handleChange}
          className={[styles.input, errors.line1 ? styles.inputError : ''].join(' ')}
          placeholder="e.g. Apt 402, Sea Green Apartments"
          aria-invalid={!!errors.line1}
          aria-describedby={errors.line1 ? 'line1-error' : undefined}
          data-testid="address-input-line1"
        />
        {errors.line1 && (
          <p id="line1-error" className={styles.errorMsg} role="alert" data-testid="error-line1">
            {errors.line1}
          </p>
        )}
      </div>

      {/* Line 2 */}
      <div className={styles.field}>
        <label htmlFor="line2" className={styles.label}>
          Area, Colony, Sector, Landmark <span className={styles.optional}>(Optional)</span>
        </label>
        <input
          id="line2"
          name="line2"
          type="text"
          value={formData.line2 || ''}
          onChange={handleChange}
          className={styles.input}
          placeholder="e.g. Near Bandra Fort"
          data-testid="address-input-line2"
        />
      </div>

      {/* Grid: City + State + Pincode */}
      <div className={styles.rowGrid}>
        {/* City */}
        <div className={styles.field}>
          <label htmlFor="city" className={styles.label}>
            City / Town <span className={styles.required}>*</span>
          </label>
          <input
            id="city"
            name="city"
            type="text"
            value={formData.city}
            onChange={handleChange}
            className={[styles.input, errors.city ? styles.inputError : ''].join(' ')}
            placeholder="e.g. Mumbai"
            aria-invalid={!!errors.city}
            aria-describedby={errors.city ? 'city-error' : undefined}
            data-testid="address-input-city"
          />
          {errors.city && (
            <p id="city-error" className={styles.errorMsg} role="alert" data-testid="error-city">
              {errors.city}
            </p>
          )}
        </div>

        {/* State */}
        <div className={styles.field}>
          <label htmlFor="state" className={styles.label}>
            State / Region <span className={styles.required}>*</span>
          </label>
          <input
            id="state"
            name="state"
            type="text"
            value={formData.state}
            onChange={handleChange}
            className={[styles.input, errors.state ? styles.inputError : ''].join(' ')}
            placeholder="e.g. Maharashtra"
            aria-invalid={!!errors.state}
            aria-describedby={errors.state ? 'state-error' : undefined}
            data-testid="address-input-state"
          />
          {errors.state && (
            <p id="state-error" className={styles.errorMsg} role="alert" data-testid="error-state">
              {errors.state}
            </p>
          )}
        </div>

        {/* Pincode */}
        <div className={styles.field}>
          <label htmlFor="pincode" className={styles.label}>
            Pincode <span className={styles.required}>*</span>
          </label>
          <input
            id="pincode"
            name="pincode"
            type="text"
            value={formData.pincode}
            onChange={handleChange}
            className={[styles.input, errors.pincode ? styles.inputError : ''].join(' ')}
            placeholder="e.g. 400050"
            aria-invalid={!!errors.pincode}
            aria-describedby={errors.pincode ? 'pincode-error' : undefined}
            data-testid="address-input-pincode"
          />
          {errors.pincode && (
            <p id="pincode-error" className={styles.errorMsg} role="alert" data-testid="error-pincode">
              {errors.pincode}
            </p>
          )}
        </div>
      </div>

      {/* Default Checkbox */}
      <div className={styles.checkboxField}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
            className={styles.checkbox}
            data-testid="address-checkbox-default"
          />
          <span>Set as default shipping address</span>
        </label>
      </div>

      {/* Actions */}
      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={onCancel}
          disabled={isSubmitting}
          data-testid="address-form-cancel"
        >
          Cancel
        </button>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isSubmitting}
          data-testid="address-form-submit"
        >
          {isSubmitting ? 'Saving...' : 'Save Address'}
        </button>
      </div>
    </form>
  );
}
