import axios from 'axios';

// Ensure this matches your FastAPI backend URL
const API_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types based on your Pydantic Models
export enum CategoryEnum {
  ALL = "All",
  STORY = "Story",
  POST = "Post",
  REELS = "Reels",
  LOGO = "Logo",
  BANNER = "Banner",
  OTHER = "Other"
}

export interface Prompt {
  _id: string; // MongoDB ID maps to string here
  title: string;
  prompt_text: string;
  image_url?: string;
  category: CategoryEnum;
  tags: string[];
  author: string;
  created_at: string;
}

export interface PromptCreate {
  title: string;
  prompt_text: string;
  category: CategoryEnum;
  tags: string[];
  author: string;
  image_url?: string; // <--- اضافه شده
}