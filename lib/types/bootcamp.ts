
export interface Bootcamp {
    id: string;
    user_id: string;
    title: string;
    goal: string;
    duration_days: number;
    current_day: number;
    created_at?: string;
}

export interface SyllabusDay {

    day: number;
    title: string;
    topics: string[];
    description: string;
}
