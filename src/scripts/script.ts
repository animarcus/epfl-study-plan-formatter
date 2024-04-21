import { StudyPlan } from "../classes/studyPlan.js";

document.addEventListener("DOMContentLoaded", () => {
    removeElements(); // Remove specific elements from the page

    const courseBlocElements = document.querySelectorAll(".study-plan.study-plan-4-semesters.table-like.mb-5");
    const studyPlan: StudyPlan = new StudyPlan(courseBlocElements);
    
    studyPlan.printAll();
    studyPlan.removeCoursesIf(course => course.semesterName != "Bachelor 3");
}, false);


function removeElements() {
    const elementsToRemove = [
        ".bg-gray-100.pt-5",
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
