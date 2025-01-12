export const getBachelorControls = (path: string) => `
  <div class="semester-controls">
    <h4>Show/Hide Semesters:</h4>
    <div>
      <label>
        <input type="checkbox" class="semester-toggle" data-semester="Bachelor 3" data-path="<span class="math-inline">\{path\}" checked\>
BA3
</label\>
<label\>
<input type\="checkbox" class\="semester-toggle" data-semester\="Bachelor 4" data-path\="</span>{path}" checked>
        BA4
      </label>
      <label>
        <input type="checkbox" class="semester-toggle" data-semester="Bachelor 5" data-path="<span class="math-inline">\{path\}" checked\>
BA5
</label\>
<label\>
<input type\="checkbox" class\="semester-toggle" data-semester\="Bachelor 6" data-path\="</span>{path}" checked>
        BA6
      </label>
    </div>
  </div>
`;

export const getMasterControls = (path: string) => `
  <div class="semester-controls">
    <h4>Show/Hide Semesters:</h4>
    <div>
      <label>
        <input type="checkbox" class="semester-toggle" data-semester="Master 1" data-path="<span class="math-inline">\{path\}" checked\>
Master 1
</label\>
<label\>
<input type\="checkbox" class\="semester-toggle" data-semester\="Master 2" data-path\="</span>{path}" checked>
        Master 2
      </label>
      <label>
        <input type="checkbox" class="semester-toggle" data-semester="specialisation" data-path="${path}" checked>
        Specialisations
      </label>
    </div>
  </div>
`;
