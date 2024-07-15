import React, {
    createContext,
    Dispatch,
    PropsWithChildren,
    useContext,
    useEffect,
    useReducer,
  } from "react";
  import { LoginUser } from "@/types";
  
  type SignUpData = {
    name: string;
    email: string;
    password: string;
    preferences: string[];
    restrictions: string;
    avatar: string;
    dispatch: Dispatch<Action>;
  };
  
  interface State {
    name: string;
    email: string;
    password: string;
    preferences: string[];
    restrictions: string;
    avatar: string;
  }
  
  interface Action {
    type:  "ADD_NAME" | "ADD_EMAIL_AND_PASSWORD" | "ADD_PREFERENCES" | "ADD_RESTRICTIONS" | "REMOVE_NAME" | "REMOVE_EMAIL_AND_PASSWORD" | "REMOVE_PREFERENCES" | "REMOVE_RESTRICTIONS" | "ADD_AVATAR" | "REMOVE_AVATAR";
    payload: string | string[] | LoginUser
  }
  
  export const SignUpContext = createContext<
    SignUpData | undefined
  >(undefined);
  
  const signUpReducer = (state: State, action: Action) => {
    switch (action.type) {
        case "ADD_NAME":
            return {
                ...state,
                name: action.payload as string,
            };
        case "REMOVE_NAME":
            return {
            ...state,
            name: "",
            };
        case "ADD_EMAIL_AND_PASSWORD":
            const loginUser = action.payload as LoginUser;
            return {
            ...state,
            email: loginUser.email,
            password: loginUser.password,
            };
        case "ADD_AVATAR":
            return {
                ...state,
                avatar: action.payload as string,
            };
        case "REMOVE_AVATAR":
            return {
                ...state,
                avatar:""
            };
        case "REMOVE_EMAIL_AND_PASSWORD":
            return {
                ...state,
                email: "",
                password: "",
            };
        case "ADD_PREFERENCES":
            return {
                ...state,
                preferences: action.payload as string[],
            };
        case "REMOVE_PREFERENCES":
            return {
                ...state,
                preferences: []
            };
        case "ADD_RESTRICTIONS":
            return {
                ...state,
                restrictions:action.payload as string,
            };
        case "REMOVE_RESTRICTIONS":
            return {
                ...state,
                restrictions:"",
            }
      default:
        return state;
    }
  };
  
  export const useSignUpContext = () => {
    const context = useContext(SignUpContext);
    if (!context) {
      throw new Error(
        "useSignUpContext must be used within SignUpProvider"
      );
    }
    return context;
  };
  
  export const SignUpProvider = ({ children }: PropsWithChildren) => {
    const [state, dispatch] = useReducer(signUpReducer, {
        name: "",
        email: "",
        password: "",
        preferences: [],
        restrictions: "",
        avatar:"",
    });
  
    console.log("SignUpContext state: ", state);
  
    return (
      <SignUpContext.Provider value={{ ...state, dispatch }}>
        {children}
      </SignUpContext.Provider>
    );
  };