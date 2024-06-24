import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useReducer,
  } from "react";
  import { User } from "../types";
  
  type SelectedUsersData = {
    selectedUsersState: User[];
    dispatch: React.Dispatch<Action>;
  };
  
  interface State {
    selectedUsersState: User[];
  }
  
  interface Action {
    type:  "CLEAR_USERS" | "ADD_USERS" | "DELETE_USER";
    payload: User[] | string | null;
  }
  
  export const SelectedUsersContext = createContext<
    SelectedUsersData | undefined
  >(undefined);
  
  const selectedUsersReducer = (state: State, action: Action) => {
    switch (action.type) {
      case "ADD_USERS":
        return {
            ...state,
            selectedUsersState: [...state.selectedUsersState, ...(action.payload) as User[]]
        };
      case "CLEAR_USERS":
        return {
          ...state,
          selectedUsersState: [],
        };
        case "DELETE_USER":
        return {
          ...state,
          selectedUsersState: state.selectedUsersState.filter(user => user._id !== action.payload)
        };
      default:
        return state;
    }
  };
  
  export const useSelectedUsersContext = () => {
    const context = useContext(SelectedUsersContext);
    if (!context) {
      throw new Error(
        "useSelectedUsersContext must be used within SelectedUsersProvider"
      );
    }
    return context;
  };
  
  export const SelectedUsersProvider = ({ children }: PropsWithChildren) => {
    const [state, dispatch] = useReducer(selectedUsersReducer, {
      selectedUsersState: [],
    });
  
    console.log("selectedUsersContext state: ", state);
  
    return (
      <SelectedUsersContext.Provider value={{ ...state, dispatch }}>
        {children}
      </SelectedUsersContext.Provider>
    );
  };