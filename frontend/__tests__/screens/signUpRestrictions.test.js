import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import SignUpRestrictions from '../../src/app/(auth)/signUpRestrictions'; // Adjust the import based on your file structure
import { useSignUpContext } from '@/providers/SignUpProvider';
import { useAuthContext } from '@/providers/AuthProvider';
import { useRouter } from 'expo-router';
import { signUpApi } from '../../src/app/api/api';

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

jest.mock('@/providers/AuthProvider', () => ({
  useAuthContext: jest.fn(),
}));

jest.mock('../../src/app/api/api', () => ({
  signUpApi: jest.fn(),
}));

describe('signUpRestrictions Component', () => {
  const mockDispatch = jest.fn();
  const mockAuthDispatch = jest.fn();
  const mockRouter = { push: jest.fn(), back: jest.fn() };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    useSignUpContext.mockReturnValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      avatar: 'avatar_url',
      preferences: ['Japanese', 'Korean'],
      dispatch: mockDispatch,
    });
    useAuthContext.mockReturnValue({
      user: { id: 1, name: 'Test User' },
      dispatch: mockAuthDispatch,
    });
    mockDispatch.mockClear();
    mockAuthDispatch.mockClear();
    mockRouter.push.mockClear();
    mockRouter.back.mockClear();
  });

  const renderComponent = () => render(<SignUpRestrictions />);

  it('renders correctly', () => {
    const { getByText } = renderComponent();
    expect(getByText("Let's Go!")).toBeTruthy();
  });

  it('opens and closes the modal', async () => {
    const { getByText, getByRole, getByTestId } = renderComponent();

    const input = getByTestId('open-diet-restrictions-model')

    act(() => {
        fireEvent.press(input);
    })
    

    waitFor(() => {
      expect(getByText('Select Dietary Restriction')).toBeTruthy();
    });

    const doneButton = getByTestId('done-diet-model')
    act(() => {
        fireEvent.press(doneButton);
    })

    waitFor(() => {
      expect(() => getByText('Select Dietary Restriction')).toThrow();
    });
  });

  it('handles back button correctly', () => {
    const { getByTestId } = renderComponent();

    const backButton = getByTestId('back-button');

    act(() => {
      fireEvent.press(backButton);
    });

    waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'REMOVE_RESTRICTIONS',
        payload: '',
      });
      expect(mockRouter.back).toHaveBeenCalled();
    });
  });

  it('handles restrictions selection and submits', async () => {
    signUpApi.mockResolvedValue({ token: 'fake-token', user: { id: 1, name: 'Test User' } });

    const { getByText, getByRole, getByTestId, debug } = renderComponent();

    const inputField = getByTestId('open-diet-restrictions-model')
    act(() => {
        fireEvent.press(inputField);
    })
    

    waitFor(() => {
      expect(getByText('Select Dietary Restriction')).toBeTruthy();
    });

    const picker = getByTestId('diet-picker');
    const doneButton = getByTestId('done-diet-model')

    act(() => {
        fireEvent(picker, 'valueChange', 'Vegetarian');
        fireEvent.press(doneButton);
    })
    
    const submitButton = getByText("Let's Go!");
    act(() => {
      fireEvent.press(submitButton);
    });

    waitFor(() => {
      expect(signUpApi).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        preferences: ['Japanese', 'Korean'],
        restrictions: 'Vegetarian',
        avatar: 'avatar_url',
        rooms: [],
        upvotedRestaurants: [],
        recommendations: [],
      }));
      expect(mockRouter.push).toHaveBeenCalledWith('../(tabs)/home/');
      expect(mockAuthDispatch).toHaveBeenCalledWith({ type: 'LOGIN', payload: { id: 1, name: 'Test User' } });
    });
  });
});
