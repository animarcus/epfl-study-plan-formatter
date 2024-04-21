import { Course, CourseHelper } from "./course.js"

export class Bloc {
    blocElement: Element;
    blocName: string;
    courses: Course[];

    constructor(blocElement: Element) {
        this.blocElement = blocElement;
        
        const h4 = blocElement.querySelector("h4");
        this.blocName = h4 ? h4.textContent! : "No Bloc Name";
        
        this.courses = this.parseCourses()
    }

    public getName() {
        return this.blocName;
    }

    public getElement() {
        return this.blocElement;
    }

    public getCourses() {
        return this.courses;
    }

    static getBlocName(plan: Element): string {
        const h4 = plan.querySelector("h4");
        const h4Str = h4 ? h4.textContent! : "No Bloc Name";
        return h4Str;
    }

    private parseCourses(): Course[] {
        const rowElements: NodeListOf<Element> = this.blocElement.querySelectorAll(".line-down");
        const currCourses = [];
        for (const row of rowElements) {
            let currCourse = CourseHelper.parseCourseRow(this, row);
            if (currCourse) {
                currCourses.push(currCourse)
            }
        }
        return currCourses
    }
}
