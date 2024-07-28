import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Index from '../../src/app/(tabs)/home/index';

// Mock DiningPlaces component
jest.mock('@/components/DiningPlaces', () => {
  return require('../../__mocks__/DiningPlaces').default;
});

jest.mock('expo-router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

jest.mock('@/providers/AuthProvider', () => ({
  useAuthContext: jest.fn().mockReturnValue({
    user: { avatar: 'man_1' },
  }),
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({ coords: { latitude: 10, longitude: 10 } })),
}));

describe('Index Component', () => {
  const vibeText = 'Casual';
  const priceRangeText = 'Less than $20';

  it('renders correctly', async () => {
    const { getByText } = render(<Index />);
    await waitFor(() => expect(getByText('SELECT VIBE')).toBeTruthy());
  });

  it('handles selecting a vibe', async () => {
    const { getByText, queryByTestId } = render(<Index />);
    await waitFor(() => fireEvent.press(getByText(vibeText)));
    expect(queryByTestId(`vibe-${vibeText}`)).toBeTruthy();
  });

  it('handles changing the price range', async () => {
    const { getByTestId } = render(<Index />);
    await waitFor(() => fireEvent(getByTestId('slider'), 'onValueChange', 1));
    expect(getByTestId('priceLabel').props.children).toBe(priceRangeText);
  });

  it('passes correct props to DiningPlaces component', async () => {
    const { getByText, getByTestId } = render(<Index />);
    await waitFor(() => fireEvent.press(getByText(vibeText)));
    await waitFor(() => fireEvent(getByTestId('slider'), 'onValueChange', 1));

    const diningPlaces = getByTestId('diningPlaces');
    expect(getByTestId('selectedVibe').props.children).toBe(vibeText);
    expect(getByTestId('selectedPrice').props.children).toBe(priceRangeText);
  });
});
