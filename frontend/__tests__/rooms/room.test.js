import React from 'react';
import { render, fireEvent, waitFor, act, expect } from '@testing-library/react-native';
import Room from '../../src/app/(tabs)/rooms/[id]';
import { useAuthContext } from '@/providers/AuthProvider';
import { useRouter } from 'expo-router';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('../../src/app/api/apiCall', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve({ data: 'mocked data' })),
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(() => ({ id: '123' })), 
}));

jest.mock('@/providers/AuthProvider', () => ({
  useAuthContext: jest.fn(),
}));

jest.mock('../../src/app/api/api', () => ({
  fetchRoomApi: jest.fn(() => Promise.resolve({
        users: [
            {
                $oid:"669208f0e200e1c34789feed"
            },
            {
                $oid:"66920522e200e1c34789f256"
            },
            {
                $oid:"6689622439ada846676a171d"
            },
            {
                $oid:"66963c004e971b81a3e83d96"
            }
        ],
        name: 'High School Friends',
        restrictions: [
            "Vegetarian",
            "Vegetarian",
            "Nil",
            "Nil",
            "Vegetarian",
            "Vegetarian",
            "Halal"
        ],
        _id: {
            $oid:"669fb736b70e25749536f2c3"
        },
        recommendations: [
            "ChIJRXr6ZhoQ2jERSDl0jCyxe90"
        ]
    })),
    fetchAllUsersApi: jest.fn(() => Promise.resolve([
        {
            "upvotedRestaurants": [],
            "recommendations": [],
            "_id": "669208f0e200e1c34789feed",
            "email": "HI@gmail.com",
            "password": "Hellothere123",
            "name": "Rob",
            "preferences": [
                "Thai"
            ],
            "restrictions": "Halal",
            "__v": 0,
            "rooms": [
                "669fb736b70e25749536f2c3"
            ]
        }
    ])),
    fetchRoomRecommendatedResturantsApi: jest.fn(() => Promise.resolve({
        data: [
            "ChIJRXr6ZhoQ2jERSDl0jCyxe90"
        ]
    })),
    fetchRestaurantDetailsById: jest.fn(() => Promise.resolve({
        data: {
            id: "ChIJRXr6ZhoQ2jERSDl0jCyxe90",
            name: "Padi Emas",
            upvotes: 0,
            upvotedBy: [],
            __v: 0
    }
    }))
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

  const renderComponent = () => render(<NavigationContainer><Room /></NavigationContainer>);

  it('renders correctly', () => {
    const { getByText, getByTestId ,debug } = renderComponent();
    
    waitFor(() => {
        expect(getByText('Recommendations will appear here')).toBeTruthy()
        expect(getByTestId('test-settings')).toBeTruthy()
    })
  });

  it('renders details correctly', () => {
    const { getByText, debug } = renderComponent();
    
    waitFor(() => {
        expect(getByText('High School Friends')).toBeTruthy()

        expect(getByText('Padi Emas')).toBeTruthy()
    })
  });

  it('able to click on gear icon', () => {
    const { getByText, getByTestId ,debug } = renderComponent();

    waitFor(() => {
        expect(getByTestId('test-settings')).toBeTruthy()
    }).then(() => {
        const settingsIcon = getByTestId('test-settings')
        act(() => {
            fireEvent.press(settingsIcon)
        })
        waitFor(() => {
            expect(mockRouter.push).toHaveBeenCalledWith('./settings');
        })
    })
    
  });
});
