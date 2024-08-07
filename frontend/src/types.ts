
export type Vibe = 'Cozy \n & \n Intimate' | "Trendy \n & \n Modern" | "Casual \n & \n Relaxed" | "Elegant \n & \n Upscale" | "Lively \n & \n Energetic" | "Outdoor \n & \n Scenic" | "Cultural \n & \n Authentic" | "Fast \n & \n Convenient" ;

export interface LoginUser {
    email: string,
    password: string
}
export interface User extends LoginUser{
    name: string,
    preferences: string[],
    restrictions: string,
    avatar?: string,
    _id?:string,
    rooms:string[],
    recommendations: string[],
    upvotedRestaurants: string[],
}

export interface Room {
    _id?:string,
    name: string,
    users: (string | undefined)[],
    restrictions:string[],
    submittedUsers: string[],
    pastRecommendation: string[],
    vibes: string[],
    price: string[],
}

export interface Restaurant {
    id: string;
    name: string;
    vicinity: string;
    upvotes: number;
    isUpvoted: boolean;
  }
  
