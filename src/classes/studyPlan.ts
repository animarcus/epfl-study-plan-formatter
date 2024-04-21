import { Course } from "./course.js"
import { Bloc } from "./bloc.js"

export class StudyPlan {
    courseBlocs: Bloc[];
    constructor(courseBlocElements: NodeListOf<Element>) {
        this.courseBlocs = this.parseBlocs(courseBlocElements);
    }

    private parseBlocs(blocElements: NodeListOf<Element>): Bloc[] {
        const allBlocs: Bloc[] = [];

        for (const element of blocElements) {
            allBlocs.push(new Bloc(element));
        }

        return allBlocs;
    }

    public getAllCourses(): Course[] {
        const allCourses: Course[] = [];
        for (const bloc of this.courseBlocs) {
            allCourses.push(...bloc.getCourses());
        }

        return allCourses;
    }

    public printAll() {
        for (const bloc of this.courseBlocs) {
            for (const course of bloc.courses) {
                let currStr: string = `Course Name: ${course.courseName}\n` +
                                    `Bloc Name: ${course.blocName}\n` +
                                    `Credits: ${course.credits}\n` +
                                    `Semester: ${course.semesterName}\n`
                console.log(currStr);
            }
        }
    }

    public removeAllCourses() {
        for (const bloc of this.courseBlocs) {
            for (const course of bloc.courses) {
                course.courseElement.remove();
            }
        }
    }

    public removeCoursesIf(predicate: (course: Course) => boolean) {
        for (const bloc of this.courseBlocs) {
            if (bloc.courses.every(predicate)) {
                bloc.blocElement.remove();
            } else {
                bloc.courses.forEach(course => {
                    if (predicate(course)) {
                        course.courseElement.remove();
                    }
                });
            }
        }
    }
}

