import { describe, expect, test, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { BeautifyScreen } from './screens/BeautifyScreen';
import * as api from './utils/api';
import type { BeautifySellerDetailsResponse } from '../../../shared/types/beautify';

vi.mock('./utils/api');

describe('BeautifyScreen', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <BeautifyScreen />
      </BrowserRouter>
    );
  };

  test('Renders text input and button', () => {
    renderComponent();
    
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');
    
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test('Button is disabled when input is empty', () => {
    renderComponent();
    
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
  });

  test('Button is enabled when input has text', () => {
    renderComponent();
    
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');
    
    fireEvent.change(input, { target: { value: 'Some product details' } });
    
    expect(button).toBeEnabled();
  });

  test('Button becomes disabled again when input is cleared', () => {
    renderComponent();
    
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');
    
    fireEvent.change(input, { target: { value: 'Some product details' } });
    expect(button).toBeEnabled();
    
    fireEvent.change(input, { target: { value: '' } });
    expect(button).toBeDisabled();
  });

  test('Displays beautified result after successful submission', async () => {
    const mockResponse = {
      title: 'Vintage Leather Jacket Size M',
      tags: ['vintage', 'leather-jacket', 'size-m'],
      priceRange: [25, 45]
    } as BeautifySellerDetailsResponse;

    vi.mocked(api.sendBeautifySellerDetails).mockResolvedValue(mockResponse);

    renderComponent();
    
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');
    
    fireEvent.change(input, { target: { value: 'Vintage leather jacket, worn once, size M' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Vintage Leather Jacket Size M/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/vintage, leather-jacket, size-m/i)).toBeInTheDocument();
    expect(screen.getByText(/€25 - €45/i)).toBeInTheDocument();
  });
});
