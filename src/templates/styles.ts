export const getStyles = () => `
  <style>
    .course-disabled {
      opacity: 0.3;
      pointer-events: none;
      filter: grayscale(100%);
      transition: all 0.3s ease;
    }
    
    .semester-controls {
      margin: 20px 0;
      padding: 15px;
      background: #f5f5f5;
      border-radius: 5px;
    }
    
    .semester-controls label {
      cursor: pointer;
    }
  </style>
`;
