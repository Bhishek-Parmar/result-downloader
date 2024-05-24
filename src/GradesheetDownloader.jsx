import React, { useState } from 'react';
import axios from 'axios';
import './GradesheetDownloader.css'; // Import CSS file for styling

async function fetchGradesheet(admnNo) {
  const url = "https://parent.iitism.ac.in/index.php/parent_portal/grade_sheet/print_grade_report/0/B.TECH";
  const data = { "admn_no": admnNo };

  try {
    const response = await axios.post(url, data, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching gradesheet for admission number ${admnNo}: ${error}`);
  }
}

function GradesheetDownloader() {
  const [rollNo, setRollNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRollNoChange = (event) => {
    setRollNo(event.target.value);
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      const gradesheet = await fetchGradesheet(rollNo);
      downloadFile(gradesheet, `gradesheet_${rollNo}.pdf`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (data, filename) => {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="gradesheet-container">
      <h2>Download Gradesheet</h2>
      <input
        type="text"
        placeholder="Enter Roll Number"
        value={rollNo}
        onChange={handleRollNoChange}
        className="roll-input"
      />
      <button onClick={handleDownload} disabled={loading} className="download-button">
        {loading ? 'Downloading...' : 'Download Gradesheet'}
      </button>
      {error && <div className="error-message">Error: {error}</div>}
    </div>
  );
}

export default GradesheetDownloader;
