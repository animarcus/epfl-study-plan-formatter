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
    
    addNavbarToHeader(newState);
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

function createNavbar(parent: Element) {
    const navbar = document.createElement('div');
    navbar.className = 'navbar';
    navbar.style.border = '1px solid black'; // Add an outline around the div
    navbar.style.padding = '10px'; // Add some padding
    navbar.style.margin = '30px 20px';

    const pages = ['all-in', 'in-ba3', 'in-ba4', 'sc-ba3', 'sc-ba4'];
    pages.forEach(page => {
        const link = document.createElement('a');
        link.href = `${page}.html`;
        link.textContent = page.toUpperCase().replace('-', ' ');
        link.style.backgroundColor = '#4CAF50'; // Green background
        link.style.border = 'none'; // Remove border
        link.style.color = 'white'; // White text
        link.style.padding = '15px 32px'; // Padding
        link.style.textAlign = 'center'; // Centered text
        link.style.textDecoration = 'none'; // Remove underline
        link.style.display = 'inline-block'; // Inline-block
        link.style.fontSize = '16px'; // Font size
        link.style.margin = '4px 2px'; // Margin
        link.style.cursor = 'pointer'; // Cursor pointer
        navbar.appendChild(link);
    });

    parent.appendChild(navbar);
}

function addNavbarToHeader(state: Element) {
    const headerParent = state.querySelector(".page-header.d-xl-flex.justify-content-xl-between.align-items-xl-center.mb-5");
    if (headerParent) {
        const div = document.createElement('div');
        createNavbar(div);
        headerParent.insertAdjacentElement('afterend', div);
    }
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
