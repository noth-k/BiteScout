import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import SignUpEmail from '../../src/app/(auth)/SignUpEmail'// Adjust the import based on your file structure
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

describe('SignUpEmail Component', () => {
  const mockDispatch = jest.fn();
  const mockRouter = { push: jest.fn(), back: jest.fn() };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    useSignUpContext.mockReturnValue({ dispatch: mockDispatch });
    mockDispatch.mockClear();
    mockRouter.push.mockClear();
    mockRouter.back.mockClear();
  });

  const renderComponent = () => render(<SignUpEmail />);

  it('renders correctly', () => {
    const { getByText } = renderComponent();
    expect(getByText('Email')).toBeTruthy();
    expect(getByText('Password')).toBeTruthy();
    expect(getByText('Next >')).toBeTruthy();
  });

  it('handles next button correctly', () => {
    const { getByText, getByPlaceholderText } = renderComponent();
    
    const emailInput = getByText('Email');
    const passwordInput = getByText('Password');
    const nextButton = getByText('Next >');

    act(() => {
      fireEvent.changeText(emailInput, 'jon@gmail.com');
      fireEvent.changeText(passwordInput, 'AbcABC123@')
      fireEvent.press(nextButton);
    })


    waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'ADD_EMAIL_AND_PASSWORD',
        payload: {email: 'jon@gmail.com', password: 'AbcABC123@'},
      });
      expect(mockRouter.push).toHaveBeenCalledWith('./signUpEmail');
    })
  });

  it('does not handle next button when name is empty', () => {
    const { getByText } = renderComponent();
    
    const nextButton = getByText('Next >');

    act(() => {
      fireEvent.press(nextButton);
    })
    
    waitFor(() => {
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(mockRouter.push).not.toHaveBeenCalled();
    })
  });

  it('handles back button correctly', () => {
    const { getByTestId } = renderComponent();
    
    const backButton = getByTestId('back-button')

    act(() => {
      fireEvent.press(backButton);
    })

    waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'REMOVE_NAME_AND_PASSWORD',
        payload: '',
      });
      expect(mockRouter.back).toHaveBeenCalled();
    })
  });
});
