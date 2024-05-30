import {
  Dispatch,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { User } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";

type AuthData = {
  user: User | null;
  dispatch: Dispatch<Action>;
};

interface State {
  user: User | null;
}

interface Action {
  type: "LOGIN" | "LOGOUT";
  payload: User | null;
}

export const AuthContext = createContext<AuthData | undefined>(undefined);

export const authReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    default:
      return state;
  }
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw Error("UseAuthContext must be used within AuthContextProvider");
  }
  return context;
};

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        if (user) {
          dispatch({ type: "LOGIN", payload: JSON.parse(user) });
        }
      } catch (e) {
        console.log("Failed to load user token");
      }
    };
    loadUser();
  }, []);

  console.log("authContext state: ", state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
