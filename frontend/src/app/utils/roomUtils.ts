import { fetchRoomApi } from "../api/api";
import { Room } from "@/types"; // Ensure you have the correct type for Room imported

interface RoomResponse {
  room: Room & {
    vibes: string[];
    price: string[];
    restrictions: string[];
  };
}

export const fetchRoomData = async (roomId: string): Promise<Room & { vibes: string[]; price: string[]; restrictions: string[] }> => {
  try {
    console.log(`Fetching room data for roomId: ${roomId}`);
    const roomResponse = await fetchRoomApi(roomId) as RoomResponse;
    console.log("Room Response:", roomResponse);
    return { 
      ...roomResponse.room
    };
  } catch (error) {
    console.error("Error fetching room data:", error);
    throw error;
  }
};

export const getMajorityChoice = (choices: string[]) => {
  console.log("Calculating majority choice for:", choices);
  const counts: { [key: string]: number } = {};
  choices.forEach((choice) => {
    counts[choice] = (counts[choice] || 0) + 1;
  });
  console.log("Counts:", counts);
  const maxCount = Math.max(...Object.values(counts));
  const majorityChoices = Object.keys(counts).filter(
    (choice) => counts[choice] === maxCount
  );
  console.log("Majority Choices:", majorityChoices);
  return majorityChoices[Math.floor(Math.random() * majorityChoices.length)];
};

export const combineRestrictions = (restrictions: string[] | string[][]) => {
  console.log("Combining restrictions:", restrictions);
  // Flatten the restrictions array and remove duplicates
  const combined = Array.from(new Set(restrictions.flat()));
  console.log("Combined Restrictions:", combined);
  return combined;
};
