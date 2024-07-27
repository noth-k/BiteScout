import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import Rooms from '../../src/app/(tabs)/rooms/index'
import { useSignUpContext } from '@/providers/SignUpProvider';
import { useAuthContext } from '@/providers/AuthProvider';
import { useRouter } from 'expo-router';
import { fetchRoomNames } from '../../src/app/api/api';


jest.mock('../../src/app/api/apiCall', () => ({
    __esModule: true,
    default: jest.fn(() => Promise.resolve({ data: 'mocked data' })),
  }));
  
  jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
  }));
  
  jest.mock('@/providers/AuthProvider', () => ({
    useAuthContext: jest.fn(),
  }));
  
  jest.mock('../../src/app/api/api', () => ({
    fetchRoomNames: jest.fn(() => Promise.resolve({ rooms: [{ _id: 'id', name: 'Testing1' }] })),
  }));
  
  describe('Rooms Component', () => {
    const mockDispatch = jest.fn();
    const mockAuthDispatch = jest.fn();
    const mockRouter = { push: jest.fn(), back: jest.fn() };
  
    beforeEach(() => {
      useRouter.mockReturnValue(mockRouter);
      useAuthContext.mockReturnValue({
        user: { id: 1, name: 'Test User' },
        dispatch: mockAuthDispatch,
      });
      mockDispatch.mockClear();
      mockAuthDispatch.mockClear();
      mockRouter.push.mockClear();
      mockRouter.back.mockClear();
    });
  
    const renderComponent = () => render(<Rooms />);
  
    it('renders correctly', () => {
      const { getByText, debug } = renderComponent();
      expect(getByText("Rooms")).toBeTruthy();
    });

    it('renders rooms correctly', () => {
        const { getByText, debug } = renderComponent();
        expect(getByText("Rooms")).toBeTruthy();
        
        waitFor(() => {
            expect(getByText('Testing1')).toBeTruthy()
        })
    })

    it('able to click on the room', () => {
        const { getByText }  = renderComponent()
        expect(getByText("Rooms")).toBeTruthy();
        
        waitFor(() => {
            expect(getByText('Testing1')).toBeTruthy()
        }).then(() => {
            act(() => {
                fireEvent.press('test-room-Testing1')
            })

            waitFor(() => {
                expect(mockRouter.push).toHaveBeenCalledWith(`/(tabs)/rooms/id`);
            })
        })
    })

    it('able to create room', () => {
        const { getByTestId }  = renderComponent()

        const createRoom = getByTestId('add-room-test')

        act(() => {
            fireEvent.press(createRoom)
        })

        waitFor(() => {
            expect(mockRouter.push).toHaveBeenCalledWith("/rooms/create/");
        })
    })
  });