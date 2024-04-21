import { Course } from "./course.js"

export class StudyPlan {
    courseBlocs: Course[];
    constructor(courseBlocs: Course[]) {
        this.courseBlocs = courseBlocs;
    }

    public printAll() {
        for (const course of this.courseBlocs) {
            let currStr: string = `Course Name: ${course.courseName}\n` +
                                  `Bloc Name: ${course.blocName}\n` +
                                  `Credits: ${course.credits}\n` +
                                  `Semester: ${course.semesterName}\n`
            console.log(currStr);
        }
    }

    public removeAllCourses() {
        for (const course of this.courseBlocs) {
            course.element.remove();
        }
    }

    public removeCoursesIf(predicate: (course: Course) => boolean) {
    for (const course of this.courseBlocs) {
        if (predicate(course)) {
            course.element.remove();
        }
    }
}
}

