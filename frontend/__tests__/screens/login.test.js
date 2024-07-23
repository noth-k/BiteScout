import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import Login from '../../src/app/(auth)/login';
import { AuthContextProvider } from '@/providers/AuthProvider'; // Ensure you wrap with the provider if needed
import { loginApi } from '../../src/app/api/api'; // Import the loginApi function
import { useRouter } from 'expo-router';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../src/app/api/api', () => ({
  loginApi: jest.fn(),
}));

describe('Login Component', () => {
  const mockDispatch = jest.fn();
  const mockRouter = { push: jest.fn(), back: jest.fn() };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    mockDispatch.mockClear();
    loginApi.mockClear();
  });

  const renderComponent = () =>
    render(
      <AuthContextProvider value={{ user: null, dispatch: mockDispatch }}>
        <Login />
      </AuthContextProvider>
    );

  it('renders correctly', async () => {
    const { getByText, getByPlaceholderText, debug } = await renderComponent();

    // console.log(debug())

    expect(getByText('Login')).toBeTruthy();
    expect(getByPlaceholderText('jon@gmail.com')).toBeTruthy();
  });

  it('handles login correctly', async () => {
    const { getByText, getByTestId } = renderComponent();

    const emailInput = getByTestId('username');
    const passwordInput = getByTestId('secure-pw');
    const loginButton = getByText('Log In');

    act(() => {
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(loginButton);
    })

    waitFor(() => {
      expect(loginApi).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockRouter.push).toHaveBeenCalledWith('../(tabs)/home/');
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'LOGIN',
        payload: expect.any(Object),
      });
    });
  });

  it('displays error message on failed login', async () => {
    loginApi.mockResolvedValueOnce({ error: 'Invalid credentials' });

    const { getByTestId, getByText } = renderComponent();

    const emailInput = getByTestId('username');
    const passwordInput = getByTestId('secure-pw')
    const loginButton = getByText('Log In');

    act(() => {
      fireEvent.changeText(emailInput, 'wrong@example.com');
      fireEvent.changeText(passwordInput, 'wrongpassword');
      fireEvent.press(loginButton);
    })


    waitFor(() => {
      expect(getByText('Invalid credentials')).toBeTruthy();
    });
  });
})
