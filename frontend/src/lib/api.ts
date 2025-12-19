import axios from 'axios';

const protocol = window.location.protocol;

// 2. Get the current hostname (e.g., 'localhost', '192.168.1.50', 'mysite.com')
const hostname = window.location.hostname;

// 3. Construct the dynamic URL with port 8000
// Result examples: "http://localhost:8000" or "http://192.168.1.5:8000"
const API_URL = `${protocol}//${hostname}:8000`;

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