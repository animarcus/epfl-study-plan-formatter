import { Bloc } from "./bloc.js"
export interface Course {
    blocElement: Element;
    courseElement: Element;
    blocName: string;
    courseName: string;
    credits: number;
    semesterName: string
}

export class CourseHelper {
    static parseCourseRow(bloc: Bloc,line: Element): Course|null {
        const blocElement = bloc.getElement();
        const blocName = bloc.getName();
        const firstCoursDiv = line.querySelector(".cours");
        const credits = CourseHelper.getCreditText(line);

        if (firstCoursDiv) {
            const courseName = CourseHelper.getCourseName(firstCoursDiv);
            const courseColumns = line.querySelectorAll(".bachlor");

            return {
                blocElement: blocElement,
                courseElement: line,
                blocName: blocName,
                courseName: courseName,
                credits: credits,
                semesterName: CourseHelper.getBachelorSemester(courseName, courseColumns)
                    };
        }
        return null
    }
    static getCreditText(line: Element): number {
        const creditDiv: Element|null = line.querySelector(".credit");
        const creditStr: string = creditDiv ? creditDiv.textContent || "" : "";
        return creditDiv ? parseInt(creditStr.trim()) : 0;
    }

    static getCourseName(firstCoursDiv: Element) {
        const courseNameElement: Element|null = firstCoursDiv.querySelector(".cours-name a");
        const courseNameStr: string = courseNameElement ? courseNameElement.textContent || "" : "";
        return courseNameElement ? courseNameStr.replace(/\s+/g, ' ').trim() : "Unknown Course";
    }

    static getBachelorSemester(courseName: string, courseColumns: NodeListOf<Element>): string {
        if (courseName.toLowerCase().includes("shs")) {
            return "SHS";
        }

        for (const column of courseColumns) {
            let columnName = column.getAttribute("data-title");
            let isColumn = column.querySelector('.label.sr-only') != null;
            if (isColumn) {
                return columnName != null ? columnName : "";
            }
        }
        
        return "";
    }
}
