import express, { Request, Response } from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';


const app = express();
const PORT = process.env.PORT || 3000;

// define a program object with title and url
interface Program {
    title: string;
    route: string;
    id: string;
}

let bachelorPrograms: Program[] = [];

/**
 * Fetches the url of all the bachelor's programs and creates an array of all the urls
 * @return {Promise<string[]>} - An array of all the urls of the bachelor's programs
 */
async function getAllBachelors(): Promise<Program[]> {
    const url = `https://edu.epfl.ch/studyplan/fr/bachelor/`;

    try {
        const response  = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const bachelors: Program[] = [];

        // Select the <ul> element within the specified container
        const ulElement = $('.container-full .page-header + ul');

        // Check if the <ul> element exists
        if (ulElement.length) {
            // Iterate over each <li> element within the <ul>
            ulElement.find('li a').each((index, element) => {
                const href = $(element).attr('href');
                const title = $(element).attr('title');
                const id = href?.replace('/studyplan/fr/bachelor/', '')
                                                .replace('/', '');
                if (href && title) {
                    // Push a new Program object with the element title and href is the route
                    bachelors.push(<Program>{title: title, route: href, id: id});
                }
            });
        } else {
            console.error('Unable to find the <ul> element');
        }

        return bachelors;
    } catch (error) {
        console.error('Error fetching the webpage:', error);
        // return empty string array
        return [];
    }
}

/**
 * Initializes the server by fetching all the bachelor's programs
 */
async function initialize() {
    bachelorPrograms = await getAllBachelors();
    console.log(bachelorPrograms);
}

app.get('/bachelors/:id', async (req: Request, res: Response) => {
    const programId = req.params.id;
    console.log(programId);

    const program = bachelorPrograms.find(program => program.id === programId);

    if (!program) {
        return res.status(404).send('Bachelor not found');
    }

    const url = `https://edu.epfl.ch${program.route}`;

    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        $('body').append('<h1>Hello World</h1>');
        $('body').append('<script>alert("Hello World")</script>');

        res.send($.html());
    } catch (error) {
        console.error('Error fetching the webpage:', error);
        res.status(500).send('Error fetching the webpage');
    }
});

app.listen(PORT, async () => {
    await initialize();
    console.log(`Server is running on http://localhost:${PORT}`);
});
