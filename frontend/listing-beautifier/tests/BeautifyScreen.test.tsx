import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { BeautifyScreen } from '../src/screens/beautifyscreen/BeautifyScreen';
import { Header } from '../src/components/header/Header';
import * as api from '../src/utils/api';
import '../src/utils/i18n';
import i18n from '../src/utils/i18n';

vi.mock('../src/utils/api');
vi.mock('react-loader-spinner', () => ({
  Blocks: () => null,
  Comment: () => null,
  Radio: () => null,
}));

beforeEach(() => {
  i18n.changeLanguage('en');
});

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
    expect(screen.getByText(/25.*45/i)).toBeInTheDocument();
  });

  describe('Tooltip hints', () => {
    test('shows hint when missing both currency and number', () => {
      renderComponent();
      
      const input = screen.getByRole('textbox');
      
      fireEvent.change(input, { target: { value: 'hello world' } });
      
      expect(screen.getByText(/Add how much it cost you/i)).toBeInTheDocument();
    });

    test('does not show price hint when number and currency are present', () => {
      renderComponent();
      
      const input = screen.getByRole('textbox');
      
      fireEvent.change(input, { target: { value: 'hello world 123eur' } });
      
      expect(screen.queryByText(/Add how much it cost you/i)).not.toBeInTheDocument();
    });

    test('shows hint when text is too short', () => {
      renderComponent();
      
      const input = screen.getByRole('textbox');
      
      fireEvent.change(input, { target: { value: 'short' } });
      
      expect(screen.getByText(/Add some exclusive functionality/i)).toBeInTheDocument();
    });

    test('does not show short text hint when text is long enough', () => {
      renderComponent();
      
      const input = screen.getByRole('textbox');
      
      fireEvent.change(input, { target: { value: 'This is a long enough description with details' } });
      
      expect(screen.queryByText(/Add some exclusive functionality/i)).not.toBeInTheDocument();
    });

    test('shows hint when not enough commas', () => {
      renderComponent();
      
      const input = screen.getByRole('textbox');
      
      fireEvent.change(input, { target: { value: 'no commas here at all' } });
      
      expect(screen.getByText(/Separate the details with commas/i)).toBeInTheDocument();
    });

    test('does not show comma hint when enough commas present', () => {
      renderComponent();
      
      const input = screen.getByRole('textbox');
      
      fireEvent.change(input, { target: { value: 'one, two, three items here for sale' } });
      
      expect(screen.queryByText(/Separate the details with commas/i)).not.toBeInTheDocument();
    });

    test('shows multiple hints when multiple issues exist', () => {
      renderComponent();
      
      const input = screen.getByRole('textbox');
      
      fireEvent.change(input, { target: { value: 'hi' } });
      
      expect(screen.getByText(/Add how much it cost you/i)).toBeInTheDocument();
      expect(screen.getByText(/Add some exclusive functionality/i)).toBeInTheDocument();
      expect(screen.getByText(/Separate the details with commas/i)).toBeInTheDocument();
    });
  });
});
