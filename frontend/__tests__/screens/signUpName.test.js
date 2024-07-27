import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import SignUpName from '../../src/app/(auth)/SignUpName'// Adjust the import based on your file structure
import { useSignUpContext } from '@/providers/SignUpProvider';
import { useRouter } from 'expo-router';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/providers/SignUpProvider', () => ({
  useSignUpContext: jest.fn(),
}));

describe('SignUpName Component', () => {
  const mockDispatch = jest.fn();
  const mockRouter = { push: jest.fn(), back: jest.fn() };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    useSignUpContext.mockReturnValue({ dispatch: mockDispatch });
    mockDispatch.mockClear();
    mockRouter.push.mockClear();
    mockRouter.back.mockClear();
  });

  const renderComponent = () => render(<SignUpName />);

  it('renders correctly', () => {
    const { getByText } = renderComponent();
    expect(getByText('Name')).toBeTruthy();
    expect(getByText('Next >')).toBeTruthy();
  });

  it('handles next button correctly', () => {
    const { getByText, getByPlaceholderText } = renderComponent();
    
    const nameInput = getByText('Name');
    const nextButton = getByText('Next >');

    act(() => {
      fireEvent.changeText(nameInput, 'John Doe');
      fireEvent.press(nextButton);
    })


    waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'ADD_NAME',
        payload: 'John Doe',
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
        type: 'REMOVE_NAME',
        payload: '',
      });
      expect(mockRouter.back).toHaveBeenCalled();
    })
  });
});
