
export type Vibe = 'Cozy \n & \n Intimate' | "Trendy \n & \n Modern" | "Casual \n & \n Relaxed" | "Elegant \n & \n Upscale" | "Lively \n & \n Energetic" | "Outdoor \n & \n Scenic" | "Cultural \n & \n Authentic" | "Fast \n & \n Convenient" ;

export interface LoginUser {
    email: string,
    password: string
}
export interface User extends LoginUser{
    name: string,
    preferences: string,
    restrictions: string,
    _id?:string,
    rooms:string[]
}

export interface Room {
    _id?:string,
    name: string,
    users: (string | undefined)[],
    restrictions:string[],
    submittedUsers: string[],
    pastRecommendation: string[],
    
}
