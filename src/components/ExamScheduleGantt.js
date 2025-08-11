// // components/ExamScheduleGantt.js
// import React from "react";
// import { TimelineHeaders, DateHeader } from "react-calendar-timeline";
// import Timeline from 'react-calendar-timeline';
// import 'react-calendar-timeline/lib/Timeline.css'; // make sure you import styles too

// import moment from "moment";
// import "./ExamScheduleGantt.css";

// export default function ExamScheduleGantt({ schedules }) {
//   const data = schedules.map((exam) => {
//     const start = moment(`${exam.scheduledDate}T${exam.startTime}`);
//     const end = moment(`${exam.scheduledDate}T${exam.endTime}`);
//     return {
//       id: exam.scheduleId,
//       start: start.toDate(),
//       end: end.toDate(),
//       name: `${exam.courseCode} - ${exam.courseName}`,
//       color: "#007bff",
//     };
//   });

//   const groups = [{ id: 1, title: "Exams" }];

//   return (
//     <div className="gantt-wrapper">
//       <h4 className="gantt-title">Weekly Exam Schedule</h4>
//       <Timeline
//         groups={groups}
//         items={data.map((item) => ({
//           ...item,
//           group: 1,
//         }))}
//         defaultTimeStart={moment("2025-06-14").toDate()}
//         defaultTimeEnd={moment("2025-06-20").toDate()}
//       >
//         <TimelineHeaders>
//           <DateHeader unit="primaryHeader" />
//           <DateHeader />
//         </TimelineHeaders>
//       </Timeline>
//     </div>
//   );
// }
