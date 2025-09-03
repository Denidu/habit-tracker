import { Models } from "react-native-appwrite";


export interface Habit extends Models.Document {
    userId: string;
    title: string;
    description: string;
    frequency: string;
    last_completed: string;
    streak_count: number;
    createdAt: string;
    updatedAt: string;
}
