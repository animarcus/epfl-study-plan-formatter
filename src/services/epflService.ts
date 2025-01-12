import axios from 'axios';
import {StudyPlanParser} from '../parsers/studyPlanParser';
import {load} from "cheerio";
import {getBachelorControls, getMasterControls} from "../templates/controls";
import {getToggleScript} from "../templates/toggleScript";
import {getStyles} from "../templates/styles";

const BASE_URL = 'https://edu.epfl.ch';

export class EPFLService {
    static async fetchPage(path: string): Promise<string> {
        const response = await axios.get(`${BASE_URL}${path}`);
        return response.data;
    }

    static isStudyPlanPage(path: string): boolean {
        return path.includes('/studyplan/') &&
            (
                path.includes('/bachelor/') ||
                path.includes('/master/')
            );
    }

    static isBachelorPage(path: string): boolean {
        return path.includes('/bachelor/');
    }

    static isMasterPage(path: string): boolean {
        return path.includes('/master/');
    }

    static async processPage(html: string, path: string, semesters?: string[]): Promise<string> {
        if (this.isStudyPlanPage(path)) {
            const parser = new StudyPlanParser(html);
            const studyPlan = parser.parse();

            // Modify the HTML
            const $ = load(html);

            // Add controls after the header
            const header = $('header.page-header');

            if (this.isBachelorPage(path)) {
                header.after(getBachelorControls());
            } else if (this.isMasterPage(path)) {
                header.after(getMasterControls());
            }

            // Add data-semesters attribute to the relevant div for the toggle script to use
            const bachelorDivs = $('div.bachlor');
            bachelorDivs.each((_, div) => {
                const semester = $(div).attr('data-title') || '';
                $(div).attr('data-semesters', semester);
            });

            // Add our styles to the head
            $('head').append(getStyles());

            $('head').append(`
            <script>
                console.log('Test script 1 - immediate');
            </script>
            `);

            // Add our toggle script in head instead of body
            $('head').append(getToggleScript());

            // Add another test script
            $('head').append(`
            <script>
                window.addEventListener('load', () => {
                    console.log('Test script 2 - window load');
                });
            </script>
        `);

            return $.html();
        }

        return html;
    }


}
