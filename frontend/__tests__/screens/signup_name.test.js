import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Signup_name from '../../src/screens/signup_name'; // Adjust the import based on your file structure
import { useSignUpContext } from '@/providers/SignUpProvider';
import { useRouter } from 'expo-router';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/providers/SignUpProvider', () => ({
  useSignUpContext: jest.fn(),
}));

describe('signup_name Component', () => {
  const mockDispatch = jest.fn();
  const mockRouter = { push: jest.fn(), back: jest.fn() };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    useSignUpContext.mockReturnValue({ dispatch: mockDispatch });
    mockDispatch.mockClear();
    mockRouter.push.mockClear();
    mockRouter.back.mockClear();
  });

  const renderComponent = () => render(<signup_name />);

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = renderComponent();
    expect(getByPlaceholderText('Name')).toBeTruthy();
    expect(getByText('Next >')).toBeTruthy();
  });

  it('handles next button correctly', () => {
    const { getByText, getByPlaceholderText } = renderComponent();
    
    const nameInput = getByPlaceholderText('Name');
    const nextButton = getByText('Next >');

    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.press(nextButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'ADD_NAME',
      payload: 'John Doe',
    });
    expect(mockRouter.push).toHaveBeenCalledWith('./signup_email');
  });

  it('does not handle next button when name is empty', () => {
    const { getByText } = renderComponent();
    
    const nextButton = getByText('Next >');

    fireEvent.press(nextButton);

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('handles back button correctly', () => {
    const { getByRole } = renderComponent();
    
    const backButton = getByRole('button', { name: 'angle-left' });

    fireEvent.press(backButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'REMOVE_NAME',
      payload: '',
    });
    expect(mockRouter.back).toHaveBeenCalled();
  });
});
