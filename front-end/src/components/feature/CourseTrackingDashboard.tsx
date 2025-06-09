import React from 'react';
import { Link } from 'react-router-dom';
import { CourseDashboardResponseType } from '../../types/course';
import CourseCard from './CourseDashboardCard';




// Example usage
const CourseTrackingPage: React.FC<{ courses: CourseDashboardResponseType }> = ({ courses }) => {

  return (
    <div className="p-6">

      {courses.courses.length > 0 ? (
        <>
          <div className="mb-6">
            <div className="space-y-4">
              {courses.courses.map((course, index: number) => (
                <CourseCard key={course.categoryName || index} course={course} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 rounded-lg shadow p-4 text-center">
              <h3 className="text-gray-500">Total Courses</h3>
              <p className="text-2xl font-bold">{courses.courseKPIs.totalCourses}</p>
            </div>
            <div className="bg-gray-700 rounded-lg shadow p-4 text-center">
              <h3 className="text-gray-500">Active Students</h3>
              <p className="text-2xl font-bold">{courses.courseKPIs.activeStudents}</p>
            </div>
            <div className="bg-gray-700 rounded-lg shadow p-4 text-center">
              <h3 className="text-gray-500">Avg. Completion</h3>
              <p className="text-2xl font-bold">72%</p>
            </div>
            <div className="bg-gray-700 rounded-lg shadow p-4 text-center">
              <h3 className="text-gray-500">Published Courses</h3>
              <p className="text-2xl font-bold">{courses.courseKPIs.publishedCourses}</p>
            </div>
          </div>
          <div className='mt-4 text-center'>
            <Link to="/mentor/course" className='text-blue-500 underline'>View all course</Link>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500">
          <p>No courses available.</p>
          <Link to="/mentor/course" className="text-blue-500 underline">Create a new course</Link>
        </div>
      )}
    </div>
  );
};

export default CourseTrackingPage;