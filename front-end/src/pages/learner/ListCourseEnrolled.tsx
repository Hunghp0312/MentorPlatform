import React, { useState, useEffect } from 'react';
import { Search, Clock, Tag, BookOpen, Users, ChevronDown } from 'lucide-react';
import LoadingOverlay from '../../components/loading/LoadingOverlay';

// TypeScript interfaces
interface Course {
    id: string;
    title: string;
    category: string;
    status: 'Draft' | 'Published' | 'Archived';
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    duration: string;
    tags: string[];
    description: string;
    instructor: string;
    students: number;
    createdAt: string;
}

// Sample course data
const sampleCourses: Course[] = [
    {
        id: '1',
        title: 'Introduction to React Development',
        category: 'Web Development',
        status: 'Published',
        level: 'Beginner',
        duration: '8 weeks',
        tags: ['React', 'JavaScript', 'Frontend'],
        description: 'Learn the fundamentals of React development including components, state management, and modern React patterns.',
        instructor: 'John Smith',
        students: 245,
        createdAt: '2024-01-15'
    },
    {
        id: '2',
        title: 'Advanced TypeScript Patterns',
        category: 'Programming',
        status: 'Published',
        level: 'Advanced',
        duration: '6 weeks',
        tags: ['TypeScript', 'JavaScript', 'Advanced'],
        description: 'Master advanced TypeScript concepts including generics, conditional types, and design patterns.',
        instructor: 'Sarah Johnson',
        students: 128,
        createdAt: '2024-02-01'
    },
    {
        id: '3',
        title: 'UI/UX Design Fundamentals',
        category: 'Design',
        status: 'Draft',
        level: 'Beginner',
        duration: '10 weeks',
        tags: ['Design', 'UI', 'UX', 'Figma'],
        description: 'Learn the principles of user interface and user experience design with hands-on projects.',
        instructor: 'Mike Chen',
        students: 0,
        createdAt: '2024-02-10'
    },
    {
        id: '4',
        title: 'Node.js Backend Development',
        category: 'Backend Development',
        status: 'Published',
        level: 'Intermediate',
        duration: '12 weeks',
        tags: ['Node.js', 'Express', 'MongoDB', 'API'],
        description: 'Build scalable backend applications using Node.js, Express, and modern database technologies.',
        instructor: 'Emily Davis',
        students: 189,
        createdAt: '2024-01-20'
    },
    {
        id: '5',
        title: 'Machine Learning Basics',
        category: 'Data Science',
        status: 'Published',
        level: 'Intermediate',
        duration: '14 weeks',
        tags: ['Python', 'ML', 'Data Science', 'AI'],
        description: 'Introduction to machine learning concepts, algorithms, and practical implementation using Python.',
        instructor: 'Dr. Alex Rodriguez',
        students: 312,
        createdAt: '2024-01-05'
    },
    {
        id: '6',
        title: 'Mobile App Development with React Native',
        category: 'Mobile Development',
        status: 'Archived',
        level: 'Intermediate',
        duration: '10 weeks',
        tags: ['React Native', 'Mobile', 'iOS', 'Android'],
        description: 'Create cross-platform mobile applications using React Native framework.',
        instructor: 'Lisa Wang',
        students: 156,
        createdAt: '2023-11-15'
    }
];

const CoursesPage: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>(sampleCourses);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>(sampleCourses);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedStatus, setSelectedStatus] = useState<string>('All');
    const [selectedLevel, setSelectedLevel] = useState<string>('All');
    const [loading, setLoading] = useState<boolean>(false);

    // Get unique categories, statuses, and levels
    const categories = ['All', ...Array.from(new Set(courses.map(course => course.category)))];
    const statuses = ['All', ...Array.from(new Set(courses.map(course => course.status)))];
    const levels = ['All', ...Array.from(new Set(courses.map(course => course.level)))];

    // Filter courses based on search and filters
    useEffect(() => {
        
        let filtered = courses;

        if (searchTerm) {
            filtered = filtered.filter(course =>
                course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(course => course.category === selectedCategory);
        }

        if (selectedStatus !== 'All') {
            filtered = filtered.filter(course => course.status === selectedStatus);
        }

        if (selectedLevel !== 'All') {
            filtered = filtered.filter(course => course.level === selectedLevel);
        }

        setFilteredCourses(filtered);
    }, [courses, searchTerm, selectedCategory, selectedStatus, selectedLevel]);

    useEffect(() =>  {
        // Simulate loading data
        setLoading(true);
        const timer = setTimeout(() => {
            setCourses(sampleCourses);
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    },[])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Published':
                return 'bg-green-600 text-green-100';
            case 'Draft':
                return 'bg-yellow-600 text-yellow-100';
            case 'Archived':
                return 'bg-gray-600 text-gray-100';
            default:
                return 'bg-gray-600 text-gray-100';
        }
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Beginner':
                return 'bg-blue-600 text-blue-100';
            case 'Intermediate':
                return 'bg-purple-600 text-purple-100';
            case 'Advanced':
                return 'bg-red-600 text-red-100';
            default:
                return 'bg-gray-600 text-gray-100';
        }
    };

    if (loading) {
        return (
            <LoadingOverlay/>
        );
    }
    return (
        <div className="min-h-screen bg-slate-900 text-gray-100">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className='flex justify-between items-center '>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Course Management</h1>
                        <p className="text-gray-400">Manage and view all your courses</p>
                    </div>
                    <div className="mb-6">
                        <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            Add New Course
                        </button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="mb-8 space-y-4 flex gap-3">
                    {/* Search Bar */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4">
                        <div className="relative">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="appearance-none bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                        </div>

                        <div className="relative">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="appearance-none bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                {statuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                        </div>

                        <div className="relative">
                            <select
                                value={selectedLevel}
                                onChange={(e) => setSelectedLevel(e.target.value)}
                                className="appearance-none bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                {levels.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Add Course Button */}


                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <div
                            key={course.id}
                            className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors duration-200 flex flex-col h-full"
                        >
                            {/* Course Header */}
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-semibold text-white line-clamp-2 h-14">
                                    {course.title}
                                </h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(course.status)}`}>
                                    {course.status}
                                </span>
                            </div>

                            {/* Course Info */}
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <BookOpen className="w-4 h-4 flex-shrink-0" />
                                    <span className="text-sm truncate">{course.category}</span>
                                </div>

                                <div className="flex items-center gap-2 text-gray-400">
                                    <Clock className="w-4 h-4 flex-shrink-0" />
                                    <span className="text-sm">{course.duration}</span>
                                </div>

                                <div className="flex items-center gap-2 text-gray-400">
                                    <Users className="w-4 h-4 flex-shrink-0" />
                                    <span className="text-sm">{course.students} students</span>
                                </div>
                            </div>

                            {/* Level Badge */}
                            <div className="mb-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                                    {course.level}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-gray-300 text-sm mb-4 line-clamp-3 h-18">
                                {course.description}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {course.tags.slice(0, 3).map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-slate-700 text-gray-300 px-2 py-1 rounded text-xs flex items-center gap-1"
                                    >
                                        <Tag className="w-3 h-3" />
                                        {tag}
                                    </span>
                                ))}
                                {course.tags.length > 3 && (
                                    <span className="bg-slate-700 text-gray-300 px-2 py-1 rounded text-xs">
                                        +{course.tags.length - 3} more
                                    </span>
                                )}
                            </div>

                            {/* Action Buttons - using mt-auto to push to bottom */}
                            <div className="flex gap-2 mt-auto">
                                <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200">
                                    View Details
                                </button>
                               
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results */}
                {filteredCourses.length === 0 && (
                    <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-400 mb-2">No courses found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                    </div>
                )}

                {/* Course Count */}
                <div className="mt-8 text-center text-gray-400">
                    Showing {filteredCourses.length} of {courses.length} courses
                </div>
            </div>
        </div>
    );
};

export default CoursesPage;