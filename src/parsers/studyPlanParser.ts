import * as cheerio from 'cheerio';
import {Course, CourseSchedule, StudyPlan} from '../types/course';

export class StudyPlanParser {
    private readonly $: cheerio.Root;

    constructor(html: string) {
        this.$ = cheerio.load(html);
    }

    public parse(): StudyPlan {
        const studyPlan: StudyPlan = {};

        this.$('div.study-plan').each((_: any, planElement: any) => {
            const blockName = this.$(planElement).find('h4').text().trim();
            const courses = this.parseCourses(planElement, blockName);
            studyPlan[blockName] = courses;
        });

        return studyPlan;
    }

    private parseCourses(planElement: any, blockName: string): Course[] {
        const courses: Course[] = [];

        this.$(planElement).find('div.line').each((_: any, courseDiv: any) => {
            const course = this.parseCourse(courseDiv, blockName);
            if (course) {
                courses.push(course);
            }
        });

        return courses;
    }

    private parseCourse(courseDiv: any, blockName: string): Course | null {
        try {
            const $ = this.$;
            const coursElem = $(courseDiv).find('div.cours');

            if (!coursElem.length) {
                return null;
            }

            // Basic course info
            const nameElem = coursElem.find('div.cours-name a');
            if (!nameElem.length) {
                return null;
            }
            const name = nameElem.text().trim();

            const infoElem = coursElem.find('div.cours-info');
            if (!infoElem.length) {
                return null;
            }
            const infoText = infoElem.text().trim();
            const [code, sectionText] = infoText.split(' / Section ');

            // Teachers
            const teachers = coursElem
                .find('div.enseignement-name a')
                .map((_, el) => $(el).text().trim())
                .get();

            // Language
            const langElem = $(courseDiv).find('div.langue');
            const language = langElem.length ? langElem.text().trim() : '';

            // Credits
            const creditElem = $(courseDiv).find('div.credit-time');
            const credits = creditElem.length ?
                parseFloat(creditElem.text().trim()) : 0;

            // Exam info
            const examElem = $(courseDiv).find('div.exam-text');
            const examSession = examElem.find('b').length ?
                examElem.find('b').text().trim() : '';
            const examType = examElem.find('span').length ?
                examElem.find('span').text().trim() : '';

            // Schedule information
            const schedules: CourseSchedule[] = [];
            $(courseDiv).find('div.bachlor').each((_, sem) => {
                const semester = $(sem).attr('data-title') || '';

                // Ensure semester is extracted correctly from the HTML
                // You might need to adjust the parsing logic based on the actual HTML structure
                const semesterRegex = /^(BA|Master)\s*\d+/; // Example regex to extract "BA3", "Master 1", etc.
                const semesterMatch = semester.match(semesterRegex);
                const extractedSemester = semesterMatch ? semesterMatch[0] : ''; // Extract the matched semester

                const hours = $(sem)
                    .find('div.schedule-text li')
                    .map((_, el) => $(el).text().trim())
                    .get();

                if (hours.length > 0) {
                    schedules.push({semester: extractedSemester, hours});
                }
            });

            // Notes
            const noteElem = coursElem.find('i');
            const notes = noteElem.length ? noteElem.text().trim() : undefined;

            // Add class to specialisation div
            const specialisationDiv = $(courseDiv).find('div.specialisation');
            if (specialisationDiv.length) {
                specialisationDiv.addClass('specialisation-column');
            }

            return {
                name,
                code: code.trim(),
                block: blockName,
                language,
                credits,
                teachers,
                section: sectionText ? sectionText.trim() : '',
                examType,
                examSession,
                schedules,
                notes,
                domElement: courseDiv
            };
        } catch (error) {
            console.error(`Error parsing course: ${error}`);
            return null;
        }
    }
}
