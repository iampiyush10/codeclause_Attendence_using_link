document.addEventListener("DOMContentLoaded", function () {
    const attendanceList = document.getElementById("attendanceList");
    const markAttendanceBtn = document.getElementById("markAttendanceBtn");
    const linkContainer = document.querySelector(".link-container");
    const studentCountContainer = document.getElementById("studentCount");
  
    // Function to generate unique link for student
    function generateLink(studentID) {
      return `https://your-attendance-website.com/?student=${encodeURIComponent(studentID)}`;
    }
  
    // Function to display attendance data and student count
    function displayAttendance(attendanceData) {
      attendanceList.innerHTML = "";
      const uniqueStudents = new Set(); // Use Set to store unique student IDs
      attendanceData.forEach((entry) => {
        const listItem = document.createElement("div");
        listItem.textContent = entry;
        attendanceList.appendChild(listItem);
  
        const studentID = getStudentIDFromEntry(entry);
        if (studentID) {
          uniqueStudents.add(studentID);
        }
      });
  
      const studentCount = uniqueStudents.size;
      studentCountContainer.textContent = `Number of Students Marked Attendance: ${studentCount}`;
    }
  
    // Function to extract the student ID from the attendance entry
    function getStudentIDFromEntry(entry) {
      const regex = /Student: (\w+), Time:/;
      const match = entry.match(regex);
      return match ? match[1] : null;
    }
  
    // Function to fetch attendance data from JSON file
    async function fetchAttendanceData() {
      try {
        const response = await fetch("attendance.json");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const attendanceData = await response.json();
        displayAttendance(attendanceData);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    }
  
    // Function to mark attendance
    async function markAttendance() {
      try {
        const studentID = prompt("Enter your student ID or email:");
        if (!studentID) return; // User canceled or provided empty input
  
        const currentTime = new Date();
        const formattedTime = currentTime.toLocaleString();
  
        // Fetch existing attendance data
        const response = await fetch("attendance.json");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const attendanceData = await response.json();
  
        // Add new entry
        attendanceData.push(`Student: ${studentID}, Time: ${formattedTime}`);
  
        // Save updated attendance data to the JSON file
        await fetch("attendance.json", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(attendanceData),
        });
  
        // Display updated attendance and student count
        displayAttendance(attendanceData);
  
        // Generate and display the unique link for the student
        const link = generateLink(studentID);
        linkContainer.innerHTML = `<input type="text" value="${link}" readonly>`;
      } catch (error) {
        console.error("Error marking attendance:", error);
      }
    }
  
    // Attach event listener to mark attendance button
    markAttendanceBtn.addEventListener("click", markAttendance);
  
    // Display attendance data on page load
    fetchAttendanceData();
  });
  
  