import { render, fireEvent, waitFor, act, expect } from '@testing-library/react-native';
import RoomSettings from '../../src/app/(tabs)/rooms/settings';
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
      fetchUserDataApi: {
        user: {
            upvotedRestaurants: [],
            recommendations: [],
            _id: "669208f0e200e1c34789feed",
            email: "morgan@gmail.com",
            password: "$2b$10$25XYxqI9xRwwDmCPsz0JQu0zimd2b00D2RVXBzcUi6pl9oncL4bM6",
            name: "Morgan",
            preferences: [
                "Korean",
                "Japanese",
                "Italian",
                "Mexican",
                "Indian"
            ],
            restrictions: "Vegetarian",
            rooms: [
                "669fb736b70e25749536f2c3"
            ],
            avatar: "woman_6"
        }
    }
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
  
    const renderComponent = () => render(<NavigationContainer><RoomSettings /></NavigationContainer>);

    it('renders correclty', () => {
        const { getByText, debug } = renderComponent()
        
        waitFor(() => {
            expect(getByText('Settings').toBeTruthy())
            expect(getByText('Share Invite').toBeTruthy())
            expect(getByText('Reset Inputs').toBeTruthy())
            expect(getByText('Leave Room').toBeTruthy())
            expect(getByText('Delete Room').toBeTruthy())
        })

    })

    it('renders the members correctly', () => {
        const { getByText, debug } = renderComponent()
        waitFor(() => {
            expect(getByText('Morgan').toBeTruthy())
            expect(getByText('morgan@gmail.com').toBeTruthy())
        })
    })
})
  