export type Mood = "triste" | "neutral" | "bien" | "feliz" | "genial" | null;

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  completedDays: boolean[]; // [lun, mar, mie, jue, vie, sab, dom]
}

export interface DayData {
  date: string; // ISO string
  mood: Mood;
  priorities: string[]; 
  tasks: Task[];
  gratitude: string[];
  devocionalVerse?: string;
  devocionalRef?: string;
  devocionalReflection?: string;
  prayerThanks?: string;
  prayerAsk?: string;
  prayerDecree?: string;
}

export interface Note {
  id: string;
  date: string;
  content: string;
  tag?: 'oracion' | 'aprendizaje' | 'suenos' | 'general';
}

export interface JournalState {
  today: DayData;
  history: DayData[];
  habits: Habit[];
  notes: Note[];
  streak: number;
  user?: {
    name: string;
    bio: string;
    avatar?: string;
  };
  settings?: {
    fontSize: 'small' | 'medium' | 'large';
    fontFamily: string;
    themeColor: string;
  };
}
