// UpvoteProvider.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";

interface UpvoteContextProps {
  upvotedRestaurants: string[];
  setUpvotedRestaurants: React.Dispatch<React.SetStateAction<string[]>>;
  toggleUpvote: (restaurantId: string) => void;
}

const UpvoteContext = createContext<UpvoteContextProps | undefined>(undefined);

export const UpvoteProvider = ({ children }: { children: ReactNode }) => {
  const [upvotedRestaurants, setUpvotedRestaurants] = useState<string[]>([]);

  const toggleUpvote = (restaurantId: string) => {
    setUpvotedRestaurants((prev) =>
      prev.includes(restaurantId)
        ? prev.filter((id) => id !== restaurantId)
        : [...prev, restaurantId]
    );
  };

  return (
    <UpvoteContext.Provider
      value={{ upvotedRestaurants, setUpvotedRestaurants, toggleUpvote }}
    >
      {children}
    </UpvoteContext.Provider>
  );
};

export const useUpvoteContext = () => {
  const context = useContext(UpvoteContext);
  if (!context) {
    throw new Error("useUpvoteContext must be used within a UpvoteProvider");
  }
  return context;
};
