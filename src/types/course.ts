export interface CourseSchedule {
    semester: string;
    hours: string[];
}

export interface Course {
    name: string;
    code: string;
    block: string;
    language: string;
    credits: number;
    teachers: string[];
    section: string;
    examType: string;
    examSession: string;
    schedules: CourseSchedule[];
    notes?: string;
    domElement?: any;  // Cheerio element reference
}

export interface StudyPlan {
    [block: string]: Course[];
}
