import { LoginUser, User, Room } from "@/types";
import { ApiType, api } from "./apiCall";
import { Restaurant } from "@/types";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const testHello = () => {
  return api("hello", { method: ApiType.GET });
};

export const signUpApi = (user: User) => {
  return api("user/signup", { method: ApiType.POST, body: user });
};

export const checkEmailPasswordApi = (email: String, password: String) => {
  return api("user/check", { method: ApiType.POST, body: { email, password } });
};

export const loginApi = (user: LoginUser) => {
  return api("user/login", { method: ApiType.POST, body: user });
};

export const updateApi = (user: User) => {
  return api("user/update", { method: ApiType.POST, body: user });
};

export const searchUserApi = (email: String) => {
  return api("user/search", { method: ApiType.POST, body: { email } });
};

export const updateRoomsApi = (userId: string, roomId: string) => {
  return api("user/roomsUpdate", {
    method: ApiType.POST,
    body: { userId, roomId },
  });
};

export const fetchUserDataApi = (userId: string | undefined) => {
  return api("user/data", { method: ApiType.POST, body: { userId } });
};

export const fetchAllUsersApi = () => {
  return api("user/allData", { method: ApiType.POST });
};

export const createRoomApi = (room: Room) => {
  return api("room/create", { method: ApiType.POST, body: room });
};

export const fetchRoomApi = (roomId: string | string[] | undefined) => {
  return api("room/find", { method: ApiType.POST, body: { roomId } });
};

export const fetchRoomNames = () => {
  return api("room/names", { method: ApiType.POST });
};

export const updateRoomApi = (
  id: string,
  newUsers: string[],
  newRestrictions: string[]
) => {
  return api("room/update", {
    method: ApiType.POST,
    body: { id, newUsers, newRestrictions },
  });
};

export const removeUserApi = (roomId: string, userId: string) => {
  return api("room/removeUser", {
    method: ApiType.POST,
    body: { roomId, userId },
  });
};

export const removeRoomFromUserApi = (roomId: string, userId: string) => {
  return api("user/removeRoom", {
    method: ApiType.POST,
    body: { roomId, userId },
  });
};

export const updateSubmittedUsersApi = (
  roomId: string,
  userId: string,
  vibe: string,
  price: string
) => {
  return api("room/submitUser", {
    method: ApiType.POST,
    body: { roomId, userId, vibe, price },
  });
};

export const resetSubmittedUsersApi = (roomId: string) => {
  return api("room/reset", { method: ApiType.POST, body: { roomId } });
};

export const deleteRoomApi = (roomId: string) => {
  return api("room/delete", { method: ApiType.POST, body: { roomId } });
};

export const vibesAndPriceApi = (roomId: string) => {
  return api("room/vibesAndPrice", { method: ApiType.POST, body: { roomId } });
};

export const roomRestrictionsApi = (roomId: string) => {
  return api("room/restrictions", { method: ApiType.POST, body: { roomId } });
};

//recommendation create. if recommendation created already, it generates the recommendation previously created
export const createRecommendationApi = (name: String, address: String) => {
  return api("recommendation/create", {
    method: ApiType.POST,
    body: { name, address },
  });
};

// Fetch leaderboard
export const fetchLeaderboardApi = async (): Promise<
  ApiResponse<Restaurant[]>
> => {
  return api("restaurant/leaderboard", { method: ApiType.GET });
};

// search for restaurants
export const searchRestaurantsApi = async (
  query: string
): Promise<ApiResponse<{ results: any[] }>> => {
  return api(`restaurant/search?query=${query}`, { method: ApiType.GET });
};

// upvote restaurant
export const upvoteRestaurantApi = async (
  id: string,
  name: string,
  userId: string
): Promise<ApiResponse<{ success: boolean }>> => {
  return api("restaurant/upvote", {
    method: ApiType.POST,
    body: { id, name, userId },
  });
};

//create
export const createResturantApi = (id: string, name: string) => {
  return api("restaurant/create", { method: ApiType.POST, body: { id, name } });
}

//update recommendation
export const updateRecommendationsApi = (userId: string, placeId: string) => {
  return api("user/addRecommendation", {method:ApiType.POST, body: { userId, placeId }});
}

//update group recommendation
export const updateGroupRecommendationsApi = (roomId: string, placeId: string) => {
  return (api("room/addRecommendation", {method:ApiType.POST, body: {roomId, placeId}}));
}

export const fetchUserUpvotedRestaurantsApi = async (
  userId: string
): Promise<ApiResponse<string[]>> => {
  return api<ApiResponse<string[]>>(`user/upvotedRestaurants?userId=${userId}`, {
    method: ApiType.GET,
  });
};

export const fetchUserRecommendatedResturantsApi = async (
  userId: string
): Promise<ApiResponse<string[]>> => {
  return api<ApiResponse<string[]>>(`user/recommendations?userId=${userId}`, {
    method: ApiType.GET,
  });
}

export const fetchRoomRecommendatedResturantsApi = async (
  roomId: string
): Promise<ApiResponse<string[]>> => {
  return api<ApiResponse<string[]>>(`room/recommendations?roomId=${roomId}`, {
    method: ApiType.GET,
  });
}

export const fetchRestaurantUpvotesApi = async (
  placeId: string
): Promise<ApiResponse<{ upvotes: number }>> => {
  return api(`restaurant/upvotes?placeId=${placeId}`, {
    method: ApiType.GET,
  });
};

export const fetchRestaurantDetailsById = async (
  id: string
): Promise<ApiResponse<Restaurant>> => {
  return api(`restaurant/details/${id}`, { method: ApiType.GET });
};

