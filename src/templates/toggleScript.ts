// @ts-ignore
// @ts-ignore
export const getToggleScript = () => `
<script>
    window.addEventListener('load', function() {
        const toggles = document.querySelectorAll('.semester-toggle');

        function updateVisibility() {
            const activeSemesters = Array.from(toggles)
                .filter(t => t.checked)
                .map(t => t.dataset.semester);

            // Get the path from the dataset
            const path = toggles[0].dataset.path; // Assuming all toggles have the same path

            // Construct the API URL
            const apiUrl = \`/api/courses?path=<span class="math-inline">\\{path\\}&semesters\\=</span>{activeSemesters.join(',')}\`;

            // Fetch courses from the API
            fetch(apiUrl)
                .then(response => response.json())
                .then(courses => {
                    // Process the fetched courses and update the page content
                    console.log('Fetched courses:', courses);

                    // Clear existing course list
                    document.querySelectorAll('.line-down').forEach(courseRow => {
                        const content = courseRow.querySelector('.line');
                        if (content) {
                            content.innerHTML = ''; // Clear the content
                        }
                    });

                    // Add the fetched courses to the page
                    courses.forEach(course => {
                        // Find the corresponding course row using course.code or other identifier
                        const courseRow = document.querySelector(\`.line-down[data-course-code="${course.code}"]\`);
                        if (courseRow) {
                            const content = courseRow.querySelector('.line');
                            if (content) {
                                // Create course elements and append them to the content
                                const courseElement = document.createElement('div');
                                courseElement.textContent = \`<span class="math-inline">\\{course\\.name\\} \\(</span>{course.code})\`; // Example
                                content.appendChild(courseElement);
                            }
                        }
                    });
                })
                .catch(error => console.error('Error fetching courses:', error));
        }

        toggles.forEach(toggle => 
            toggle.addEventListener('change', updateVisibility));

        updateVisibility();
    });
</script>
`;
