import express from 'express';
import {EPFLService} from './services/epflService';
import {StudyPlanParser} from "./parsers/studyPlanParser";

const app = express();
const port = 3000;

// Handle root redirects
app.get('/', async (req, res) => {
    const html = await EPFLService.fetchPage('/index.en.html');
    const processed = await EPFLService.processPage(html, '/index.en.html');
    res.send(processed);
});

app.get('/index.:lang.html', async (req, res) => {
    const {lang} = req.params;
    const html = await EPFLService.fetchPage(`/index.${lang}.html`);
    const processed = await EPFLService.processPage(html, `/index.${lang}.html`);
    res.send(processed);
});

// Handle study plan routes
app.get('/studyplan/*', async (req: express.Request, res: express.Response) => {
    try {
        const path = `/studyplan/${req.params[0]}`;
        const html = await EPFLService.fetchPage(path);
        const processed = await EPFLService.processPage(html, path);
        res.send(processed);
    } catch (error) {
        res.status(500).send('Error fetching page');
    }
});

// API endpoint to filter courses by semester
app.get('/api/courses', async (req, res) => {
  try {
    const path = req.query.path as string; // Get the study plan path from query parameter
    const semesters = (req.query.semesters as string)?.split(',') || []; // Get selected semesters

    const html = await EPFLService.fetchPage(path);
    const processed = await EPFLService.processPage(html, path, semesters); // Pass semesters to processPage
    const parser = new StudyPlanParser(processed); // Parse the processed HTML
    const studyPlan = parser.parse();

    const filteredCourses = Object.values(studyPlan).flat().filter(course => {
      return course.schedules.some(schedule => semesters.includes(schedule.semester));
    });

    res.json(filteredCourses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
