import { StudyPlan } from "../classes/studyPlan.js";


declare global {
    interface Window {
        semesterNum: number;
    }
}

const semNum: number = window.semesterNum;

document.addEventListener("DOMContentLoaded", () => {
    adaptLinks();
    const newState: Element = getNewState();

    const courseBlocElements = newState.querySelectorAll(".study-plan.study-plan-4-semesters.table-like.mb-5");
    const studyPlan: StudyPlan = new StudyPlan(courseBlocElements);
    
    removeElements(); // Remove specific elements from the page
    
    studyPlan.printAll();
    
    studyPlan.removeCoursesIf(course => {
        return course.semesterName != `Bachelor ${semNum}` && semNum != 0;
    });

    applyState(newState)
}, false);

function adaptLinks() {
    const anchors = document.querySelectorAll('a');
    anchors.forEach(anchor => {
        const href = anchor.getAttribute('href');
        if (href) {
            if (!href.includes('//')) {
                anchor.setAttribute('href', `https://edu.epfl.ch${href}`);
            }
            anchor.setAttribute('target', '_blank'); // Open the link in a new window or tab
        }
    });
}

function getNewState(): Element {
    const container = document.querySelector(".container-full.px-5.px-xxl-6.mt-5")!;
    let originalState: Element = container.cloneNode(true) as Element;
    
    return originalState.cloneNode(true) as Element;;
}

function restoreOriginalState(originalState: Node) {
    applyState(originalState);
}

function applyState(state: Node) {
    const container = document.querySelector(".container-full.px-5.px-xxl-6.mt-5");
    if (container && state) {
        container.replaceWith(state);
    }
}

function addDivToHeader(container: Element) {
    const headerParent = document.querySelector(".page-header.d-xl-flex.justify-content-xl-between.align-items-xl-center.mb-5");
    const div = document.createElement('div');
    headerParent?.appendChild(div);
}

function removeElements() {
    const elementsToRemove = [
        "form[action='//search.epfl.ch'].d-xl-none", // search
        "div.dropdown.dropright.search.d-none.d-xl-block", // search
        ".bg-gray-100.pt-5", // footer
        ".nav-aside-wrapper", // nav bar on the side
        ".breadcrumb-container", // breadcrumb
        ".nav-lang" // language select
    ];
    elementsToRemove.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.remove();
        }
    });
}
