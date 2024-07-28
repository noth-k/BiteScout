import React from "react";
import { render, fireEvent, waitFor, within } from "@testing-library/react-native";
import Restaurants from "../../src/app/(tabs)/restaurant/index";
import { useAuthContext } from "@/providers/AuthProvider";
import {
  searchRestaurantsApi,
  upvoteRestaurantApi,
  fetchUserUpvotedRestaurantsApi,
} from "@/app/api/api";
import { useRouter } from "expo-router";
import { useUpvoteContext } from "@/providers/UpvoteProvider"; 

jest.mock("@/providers/AuthProvider", () => ({
  useAuthContext: jest.fn(),
}));

jest.mock("@/app/api/api", () => ({
  searchRestaurantsApi: jest.fn(),
  upvoteRestaurantApi: jest.fn(),
  fetchUserUpvotedRestaurantsApi: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/providers/UpvoteProvider", () => ({
  useUpvoteContext: jest.fn(),
  UpvoteProvider: ({ children }) => children,
}));

const mockNavigate = jest.fn();
const mockUser = { _id: "1", name: "Test User" };

describe("Restaurants Component", () => {
  beforeEach(() => {
    useAuthContext.mockReturnValue({ user: mockUser });
    useRouter.mockReturnValue({ push: mockNavigate });
    fetchUserUpvotedRestaurantsApi.mockResolvedValue({
      success: true,
      data: [],
    });
    searchRestaurantsApi.mockResolvedValue({
      success: true,
      data: [
        { id: "1", name: "Restaurant 1", vicinity: "Vicinity 1", upvotes: 10 },
        { id: "2", name: "Restaurant 2", vicinity: "Vicinity 2", upvotes: 20 },
      ],
    });
    useUpvoteContext.mockReturnValue({
      upvotedRestaurants: [],
      toggleUpvote: jest.fn(),
      setUpvotedRestaurants: jest.fn(),
    });
  });

  it("renders correctly", async () => {
    const { getByPlaceholderText, getByText } = render(<Restaurants />);

    expect(getByPlaceholderText("Enter restaurant name")).toBeTruthy();
    expect(getByText("Search")).toBeTruthy();
  });

  it("searches for restaurants", async () => {
    const { getByPlaceholderText, getByText, findByText } = render(
      <Restaurants />
    );

    const searchInput = getByPlaceholderText("Enter restaurant name");
    const searchButton = getByText("Search");

    fireEvent.changeText(searchInput, "Pizza");
    fireEvent.press(searchButton);

    await waitFor(() =>
      expect(searchRestaurantsApi).toHaveBeenCalledWith("Pizza")
    );

    expect(await findByText("Restaurant 1")).toBeTruthy();
    expect(await findByText("Restaurant 2")).toBeTruthy();
  });

  it("handles upvoting a restaurant", async () => {
    const { getByText, findByText, getByTestId } = render(<Restaurants />);

    const searchButton = getByText("Search");

    fireEvent.press(searchButton);

    await findByText("Restaurant 1");

    const restaurantItem = getByTestId("restaurant-item-1");
    const upvoteButton = within(restaurantItem).getByText("Upvote");

    fireEvent.press(upvoteButton);

    await waitFor(() =>
      expect(upvoteRestaurantApi).toHaveBeenCalledWith("1", "Restaurant 1", "1")
    );
  });

  it("navigates to the leaderboard", async () => {
    const { getByText } = render(<Restaurants />);

    const leaderboardButton = getByText("Leaderboard");

    fireEvent.press(leaderboardButton);

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith({
        pathname: "/(tabs)/restaurant/leaderboards",
      })
    );
  });
});
