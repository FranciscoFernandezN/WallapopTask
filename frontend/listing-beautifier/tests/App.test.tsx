import { describe, expect, test, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { BeautifyScreen } from '../src/screens/beautifyscreen/BeautifyScreen';
import { Header } from '../src/components/header/Header';
import * as api from '../src/utils/api';

vi.mock('./utils/api');

describe('Header', () => {
  test('renders Wallapop logo and task text', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    const logo = screen.getByAltText(/wallapop logo/i);
    const text = screen.getByText(/wallapop task - francisco fernández noguerol/i);
    
    expect(logo).toBeInTheDocument();
    expect(text).toBeInTheDocument();
  });
});

describe('BeautifyScreen', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <BeautifyScreen />
      </BrowserRouter>
    );
  };

  test('renders text input and button', () => {
    renderComponent();
    
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');
    
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test('button is disabled when input is empty', () => {
    renderComponent();
    
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
  });

  test('button is enabled when input has text', () => {
    renderComponent();
    
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');
    
    fireEvent.change(input, { target: { value: 'Some product details' } });
    
    expect(button).toBeEnabled();
  });

  test('button becomes disabled again when input is cleared', () => {
    renderComponent();
    
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');
    
    fireEvent.change(input, { target: { value: 'Some product details' } });
    expect(button).toBeEnabled();
    
    fireEvent.change(input, { target: { value: '' } });
    expect(button).toBeDisabled();
  });

  test('displays beautified result after successful submission', async () => {
    const mockResponse = {
      title: 'Vintage Leather Jacket Size M',
      tags: ['vintage', 'leather-jacket', 'size-m'],
      priceRange: [25, 45] as [number, number]
    };

    vi.mocked(api.sendBeautifySellerDetails).mockResolvedValue(mockResponse);

    renderComponent();
    
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');
    
    fireEvent.change(input, { target: { value: 'Vintage leather jacket, worn once, size M' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Vintage Leather Jacket Size M/i)).toBeInTheDocument();
    });

    expect(screen.getAllByText(/vintage/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/leather-jacket/i)).toBeInTheDocument();
    expect(screen.getByText(/size-m/i)).toBeInTheDocument();
    expect(screen.getByText(/€25 - €45/i)).toBeInTheDocument();
  });
});
