import React, { useState, useEffect } from 'react';

// Grade to points mapping
const gradeMap = {
  AA: 10,
  AB: 9,
  BB: 8,
  BC: 7,
  CC: 6,
  CD: 5,
  DD: 4,
  FF: 0,
};

const App = () => {
  // State variables
  const [numCourses, setNumCourses] = useState(0); // Number of courses selected
  const [courses, setCourses] = useState([]); // List of course objects with credits and grade
  const [cg, setCg] = useState(null); // Computed CG value
  const [courseGradePoints, setCourseGradePoints] = useState([]); // Store total grade points for each course
  const [bgColor, setBgColor] = useState('bg-gray-100'); // Initial background color

  // Handle dropdown selection for number of courses
  const handleNumCoursesChange = (e) => {
    const count = parseInt(e.target.value, 10) || 0;
    setNumCourses(count);
    setCourses(Array.from({ length: count }, () => ({ credits: '', grade: '' })));
    setCourseGradePoints(Array(count).fill(0)); // Reset grade points
  };

  // Update individual course details
  const handleCourseChange = (index, field, value) => {
    setCourses((prevCourses) => {
      const updatedCourses = [...prevCourses];
      updatedCourses[index] = { ...updatedCourses[index], [field]: value };
      return updatedCourses;
    });
  };

  // Calculate CG based on entered values
  const calculateCG = () => {
    let totalCredits = 0;
    let totalPoints = 0;
    let updatedGradePoints = [];

    courses.forEach(({ credits, grade }) => {
      const numericGrade = gradeMap[grade];
      const parsedCredits = parseFloat(credits);

      if (numericGrade !== undefined && !isNaN(parsedCredits) && parsedCredits > 0) {
        const gradePoints = numericGrade * parsedCredits;
        totalCredits += parsedCredits;
        totalPoints += gradePoints;
        updatedGradePoints.push(gradePoints); // Store the total grade points for each course
      } else {
        updatedGradePoints.push(0); // In case of invalid input, set grade points to 0
      }
    });

    // Calculate CG if valid data is present
    if (totalCredits > 0) {
      const calculatedCG = Math.floor((totalPoints / totalCredits) * 100) / 100;
      setCg(calculatedCG.toFixed(2));
      setCourseGradePoints(updatedGradePoints); // Update the total grade points for each course

      // Set background color based on CG value
      if (calculatedCG >= 9) {
        setBgColor('bg-green-500'); // Excellent CG
      } else if (calculatedCG >= 7) {
        setBgColor('bg-yellow-500'); // Good CG
      } else if (calculatedCG >= 5) {
        setBgColor('bg-orange-500'); // Average CG
      } else {
        setBgColor('bg-red-500'); // Below average CG
      }
    } else {
      setCg('Invalid Input');
      setCourseGradePoints([]); // Clear grade points if input is invalid
      setBgColor('bg-gray-100'); // Reset to default color
    }
  };

  useEffect(() => {
    // Automatically change page background color based on CG calculation
    document.body.className = bgColor;
  }, [bgColor]);

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-4xl"> {/* 70% of the page width */}
        <h1 className="text-5xl font-bold text-gray-400 text-center mb-10">IIITN</h1>
        <h1 className="text-4xl font-bold mb-5 text-gray-800 text-center">CG CALCULATOR</h1>


        <label htmlFor="numCourses" className="mb-3 text-lg text-gray-700 block">
          Number of Courses:
        </label>
        <select
          id="numCourses"
          className="mb-5 p-3 border-2 rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          onChange={handleNumCoursesChange}
          value={numCourses}
        >
          <option value="">Select</option>
          {[...Array(10).keys()].map((i) => (
            <option key={i} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

        {courses.map((course, index) => (
          <div key={index} className="flex space-x-3 mb-5 p-4 bg-white shadow-lg rounded-lg">
            <input
              type="number"
              className="p-3 border-2 rounded-lg w-24 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Credits"
              min="1"
              value={course.credits}
              onChange={(e) => handleCourseChange(index, 'credits', e.target.value)}
            />
            <select
              className="p-3 border-2 rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={course.grade}
              onChange={(e) => handleCourseChange(index, 'grade', e.target.value)}
            >
              <option value="">Grade</option>
              {Object.keys(gradeMap).map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </div>
        ))}

        <button
          onClick={calculateCG}
          className="mt-5 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transform transition duration-300 ease-in-out shadow-md hover:scale-105 w-full"
        >
          Calculate CG
        </button>

        {cg !== null && (
          <div className="mt-5 text-2xl p-4 rounded-lg bg-white shadow-lg w-full text-center">
            Your CG: <span className="font-bold">{cg}</span>
          </div>
        )}

        {/* Display total grade points for each course */}
        {courses.length > 0 && (
          <div className="mt-5 text-center">
            <h2 className="text-xl font-semibold text-gray-800">Total Grade Points for Each Course:</h2>
            <ul className="mt-2 space-y-2">
              {courses.map((course, index) => (
                <li
                  key={index}
                  className="bg-white shadow-lg p-3 rounded-lg"
                >
                  <strong>Course {index + 1}:</strong> {courseGradePoints[index] || 'Invalid'}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
