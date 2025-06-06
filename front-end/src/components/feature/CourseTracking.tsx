import React from 'react';
import { Link } from 'react-router-dom';

type CourseType = {
  name: string;
  duration: string;
  level: {
    id: number;
  };
  category?: {
    name: string;
  };
  students?: number;
  completion?: number;
  status: {
    id: number;
  };
};

type CourseCardProps = {
  course: CourseType;
};

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const getLevelText = (levelId: number) => {
    switch (levelId) {
      case 1: return 'Beginner';
      case 2: return 'Intermediate';
      default: return 'Advanced';
    }
  };

  const getStatusColor = (statusId: number) => {
    switch (statusId) {
      case 1: return 'text-gray-400';
      case 2: return 'text-green-500';
      default: return 'text-amber-500';
    }
  };

  const getStatusText = (statusId: number) => {
    switch (statusId) {
      case 1: return 'Draft';
      case 2: return 'Published';
      default: return 'Archived';
    }
  };

  const getCompletionColor = (completion: number = 0) => {
    if (completion >= 80) return 'bg-green-500';
    if (completion >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-gray-700 rounded-lg shadow p-6 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Title Column */}
        <div className="md:col-span-2">
          <h3 className="font-medium text-lg">{course.name}</h3>
          <p className="text-sm text-gray-400">
            {course.duration} • {getLevelText(course.level.id)}
          </p>
        </div>

        {/* Category Column */}
        <div className="flex items-center">
          <span className="font-medium">{course.category?.name || 'Uncategorized'}</span>
        </div>

        {/* Students Column */}
        <div className="flex items-center justify-center">
          <span className="font-medium">{course.students ?? 0}</span>
        </div>

        {/* Completion Column */}
        <div className="flex items-center">
          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
            <div
              className={`h-2 rounded-full ${getCompletionColor(course.completion)}`}
              style={{ width: `${course.completion ?? 0}%` }}
            ></div>
          </div>
          <span>{course.completion ?? 0}%</span>
        </div>

        {/* Status Column */}
        <div className="flex justify-center items-center">
          <span className={`font-medium ${getStatusColor(course.status.id)}`}>
            {getStatusText(course.status.id)}
          </span>
        </div>
      </div>
    </div>
  );
};

// Example usage
const CourseTrackingPage: React.FC = () => {
  const exampleCourses: CourseType[] = [
    {
      name: 'Introduction to React',
      duration: '4 weeks',
      level: { id: 1 },
      category: { name: 'Web Development' },
      students: 45,
      completion: 78,
      status: { id: 2 },
    },
    {
      name: 'Advanced TypeScript Patterns',
      duration: '6 weeks',
      level: { id: 3 },
      category: { name: 'Programming' },
      students: 22,
      completion: 35,
      status: { id: 3 },
    },
  ];

  return (
    <div className="p-6">

      <div className="mb-6">
        <div className="space-y-4">
          {exampleCourses.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 rounded-lg shadow p-4">
          <h3 className="text-gray-500">Total Courses</h3>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="bg-gray-700 rounded-lg shadow p-4">
          <h3 className="text-gray-500">Active Students</h3>
          <p className="text-2xl font-bold">156</p>
        </div>
        <div className="bg-gray-700 rounded-lg shadow p-4">
          <h3 className="text-gray-500">Avg. Completion</h3>
          <p className="text-2xl font-bold">72%</p>
        </div>
        <div className="bg-gray-700 rounded-lg shadow p-4">
          <h3 className="text-gray-500">Published Courses</h3>
          <p className="text-2xl font-bold">8</p>
        </div>
      </div>
      <div className='mt-4 text-center'>
        <Link to="/mentor/course" className='text-blue-500 underline'>View all course</Link>
      </div>
    </div>
  );
};

export default CourseTrackingPage;