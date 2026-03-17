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
  encrypted?: boolean;
}

export interface CyclePeriod {
  start: string; // ISO date string
  end: string;   // ISO date string
}

export interface CycleSymptom {
  date: string;
  items: string[];
}

export interface CycleData {
  periods: CyclePeriod[];
  cycleLength: number;
  periodLength: number;
  symptoms: Record<string, string[]>; // { "2026-03-02": ["cramps", "headache"] }
  lastUpdated?: string;
}

export interface JournalState {
  today: DayData;
  history: DayData[];
  habits: Habit[];
  notes: Note[];
  streak: number;
  cycle?: CycleData;
  user?: {
    name: string;
    bio: string;
    avatar?: string;
  };
  settings?: {
    fontSize: 'small' | 'medium' | 'large';
    fontFamily: string;
    themeColor: string;
    darkMode?: boolean;
    readingPlan?: {
      startDate: string;
      currentDay: number;
      completedDays: number[];
    };
    lastBackup?: string;
    notificationsEnabled?: boolean;
  };
}
