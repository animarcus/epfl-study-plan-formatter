import { StudyPlan } from "../classes/studyPlan.js";
import { Course } from "../classes/course.js"

document.addEventListener("DOMContentLoaded", () => {
    removeElements(); // Remove specific elements from the page

    const courseBlocs = document.querySelectorAll(".study-plan.study-plan-4-semesters.table-like.mb-5");
    const studyPlan: StudyPlan = createStudyPlan(courseBlocs);
    
    studyPlan.printAll();
    studyPlan.removeCoursesIf(course => course.semesterName != "Bachelor 3");
}, false);


function removeElements() {
    const elementsToRemove = [
        ".nav-aside-wrapper",
        ".breadcrumb-container",
        ".nav-lang"
    ];
    elementsToRemove.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.remove();
        }
    });
}

function createStudyPlan(courseBlocs: NodeListOf<Element>): StudyPlan {
    const allCourses: Course[] = []
    for (const bloc of courseBlocs) {
        let blocName: string = getBlocName(bloc);
        let blocRows = bloc.querySelectorAll(".line-down");
        blocRows.forEach(currBlocRow => {
            let currCourse = processLine(currBlocRow, blocName);
            if (currCourse) {
                allCourses.push(currCourse)
            }
        });
    }
    return new StudyPlan(allCourses);
}

function getBlocName(plan: Element): string {
    const h4 = plan.querySelector("h4");
    const h4Str = h4 ? h4.textContent! : "No Bloc Name";
    return h4Str;
}

function processLine(line: Element, blocName: string): Course|null {
    const firstCoursDiv = line.querySelector(".cours");
    const credits = getCreditText(line);

    if (firstCoursDiv) {
        const courseName = getCourseName(firstCoursDiv);
        const courseColumns = line.querySelectorAll(".bachlor");

        return {
            element: line,
            blocName: blocName,
            courseName: courseName,
            credits: credits,
            semesterName: getBachelorSemester(courseName, courseColumns)
                };
    }
    return null
}

function getCreditText(line: Element): number {
    const creditDiv: Element|null = line.querySelector(".credit");
    const creditStr: string = creditDiv ? creditDiv.textContent || "" : "";
    return creditDiv ? parseInt(creditStr.trim()) : 0;
}

function getCourseName(firstCoursDiv: Element) {
    const courseNameElement: Element|null = firstCoursDiv.querySelector(".cours-name a");
    const courseNameStr: string = courseNameElement ? courseNameElement.textContent || "" : "";
    return courseNameElement ? courseNameStr.replace(/\s+/g, ' ').trim() : "Unknown Course";
}

function getBachelorSemester(courseName: string, courseColumns: NodeListOf<Element>): string {
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
