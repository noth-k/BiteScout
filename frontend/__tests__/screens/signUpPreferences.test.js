import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import SignUpPreferences from '../../src/app/(auth)/signUpPreferences'// Adjust the import based on your file structure
import { useSignUpContext } from '@/providers/SignUpProvider';
import { useRouter } from 'expo-router';

jest.mock('../../src/app/api/apiCall', () => ({
    __esModule: true, // This is important for handling ES modules
    default: jest.fn(() => Promise.resolve({ data: 'mocked data' })),
  }));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/providers/SignUpProvider', () => ({
  useSignUpContext: jest.fn(),
}));

describe('SignUpPreferences Component', () => {
  const mockDispatch = jest.fn();
  const mockRouter = { push: jest.fn(), back: jest.fn() };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    useSignUpContext.mockReturnValue({ dispatch: mockDispatch });
    mockDispatch.mockClear();
    mockRouter.push.mockClear();
    mockRouter.back.mockClear();
  });

  const renderComponent = () => render(<SignUpPreferences />);

  it('renders correctly', () => {
    const { getByText } = renderComponent();
    expect(getByText('Which cuisine would you rather: \n Dish or Ditch')).toBeTruthy();
    expect(getByText('or')).toBeTruthy();
  });

  it('handles back button correctly', () => {
    const { getByTestId } = renderComponent();
    
    const backButton = getByTestId('back-button')

    act(() => {
      fireEvent.press(backButton);
    })

    waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'REMOVE_PREFERENCES',
        payload: [],
      });
      expect(mockRouter.back).toHaveBeenCalled();
    })
  });

  it('handles preferences correctly', () => {
    const { getByTestId, debug } = renderComponent();

    const topPicture = getByTestId('vinoth_greatest_1')

    for (let index = 0; index < 10; index++) {
        act(() => {
            fireEvent.press(topPicture)
        })
    }

    waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'ADD_PREFERENCES',
          payload: expect.anything(),
        });
      })
  })
});
