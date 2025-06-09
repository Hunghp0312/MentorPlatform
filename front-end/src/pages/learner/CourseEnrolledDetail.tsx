import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Download, FileText, Video, Clock, Users,  Tag, Calendar, File, Image, Archive } from 'lucide-react';
import LoadingOverlay from '../../components/loading/LoadingOverlay';

// Extended TypeScript interfaces
interface CourseResource {
    id: string;
    title: string;
    type: 'video' | 'pdf' | 'document' | 'image' | 'archive';
    url: string;
    size: string;
    duration?: string; // for videos
    description?: string;
    isCompleted?: boolean;
}



interface DetailedCourse {
    id: string;
    title: string;
    category: string;
    status: 'Draft' | 'Published' | 'Archived';
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    duration: string;
    tags: string[];
    description: string;
    fullDescription: string;
    students: number;
    createdAt: string;
    updatedAt: string;
    resources: CourseResource[];
}

// Sample detailed course data
const sampleCourse: DetailedCourse = {
    id: '1',
    title: 'Introduction to React Development',
    category: 'Web Development',
    status: 'Published',
    level: 'Beginner',
    duration: '8 weeks',
    tags: ['React', 'JavaScript', 'Frontend', 'Web Development'],
    description: 'Learn the fundamentals of React development including components, state management, and modern React patterns.',
    fullDescription: `This comprehensive React course is designed for beginners who want to master modern web development. You'll start with the basics of React and gradually build up to advanced concepts like state management, hooks, and performance optimization.

Throughout this course, you'll work on real-world projects that will help you build a strong portfolio. By the end of this course, you'll be able to create dynamic, interactive web applications using React and its ecosystem.

The course includes hands-on exercises, quizzes, and projects that will reinforce your learning. You'll also get access to a community of fellow learners and instructors who can help you along your journey.`,
    students: 245,
    createdAt: '2024-01-15',
    updatedAt: '2024-02-20',
    resources: [
        {
            id: 'video-1',
            title: 'What is React?',
            type: 'video',
            url: '/videos/what-is-react.mp4',
            size: '45 MB',
            duration: '15:30',
            description: 'Introduction to React and its core concepts'
        },
        {
            id: 'video-2',
            title: 'Setting up Development Environment',
            type: 'video',
            url: '/videos/setup-environment.mp4',
            size: '62 MB',
            duration: '22:15',
            description: 'Step-by-step guide to setting up your React development environment'
        },
        {
            id: 'pdf-1',
            title: 'React Fundamentals Cheat Sheet',
            type: 'pdf',
            url: '/documents/react-cheat-sheet.pdf',
            size: '2.3 MB',
            description: 'Quick reference guide for React fundamentals'
        },
        {
            id: 'doc-1',
            title: 'Exercise: Your First Component',
            type: 'document',
            url: '/documents/first-component-exercise.docx',
            size: '1.1 MB',
            description: 'Hands-on exercise to create your first React component'
        }
    ],
};

const CourseDetailPage: React.FC = () => {
    const [course, setCourse] = useState<DetailedCourse>(sampleCourse);
    const [activeTab, setActiveTab] = useState<'overview' | 'resources'>('overview');
    const [loading, setLoading] = useState<boolean>(true);
    const getResourceIcon = (type: string) => {
        switch (type) {
            case 'video':
                return <Video className="w-5 h-5 text-red-400" />;
            case 'pdf':
                return <FileText className="w-5 h-5 text-red-400" />;
            case 'document':
                return <File className="w-5 h-5 text-blue-400" />;
            case 'image':
                return <Image className="w-5 h-5 text-green-400" />;
            case 'archive':
                return <Archive className="w-5 h-5 text-purple-400" />;
            default:
                return <FileText className="w-5 h-5 text-gray-400" />;
        }
    };

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

    useEffect(() => {
        // Simulate data fetching
        const fetchData = async () => {
            setLoading(true);
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setCourse(sampleCourse); // Replace with actual API call
            setLoading(false);
        };

        fetchData();
    }, []); 
    const handleResourceAction = (resource: CourseResource) => {
        if (resource.type === 'video') {
            // Handle video play
            console.log('Playing video:', resource.title);
        } else {
            // Handle download
            console.log('Downloading:', resource.title);
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
                {/* Back Button */}
                <button className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Courses
                </button>

                {/* Course Header */}
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Course Info */}
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(course.status)}`}>
                                    {course.status}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
                                    {course.level}
                                </span>
                                <span className="text-gray-400 text-sm">{course.category}</span>
                            </div>

                            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                                {course.title}
                            </h1>

                            <p className="text-gray-300 text-lg mb-6">
                                {course.description}
                            </p>

                            {/* Course Stats */}
                            <div className="flex flex-wrap items-center gap-6 mb-6">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Users className="w-5 h-5" />
                                    <span>{course.students} students</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Clock className="w-5 h-5" />
                                    <span>{course.duration}</span>
                                </div>

                                <div className="flex items-center gap-2 text-gray-400">
                                    <Calendar className="w-5 h-5" />
                                    <span>Updated {new Date(course.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Instructor */}

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                {course.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-slate-700 text-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                                    >
                                        <Tag className="w-3 h-3" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="mb-8">
                    <div className="flex border-b border-slate-700">
                        {[
                            { key: 'overview', label: 'Overview' },
                            { key: 'resources', label: 'All Resources' }
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as 'overview' | 'resources')}
                                className={`px-6 py-3 font-medium transition-colors duration-200 border-b-2 ${activeTab === tab.key
                                    ? 'text-orange-400 border-orange-400'
                                    : 'text-gray-400 border-transparent hover:text-gray-300'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="space-y-8">
                    {activeTab === 'overview' && (

                        <div className=" space-y-8">
                            {/* Full Description */}
                            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-white mb-4">About This Course</h2>
                                <div className="text-gray-300 space-y-4">
                                    {course.fullDescription.split('\n\n').map((paragraph, index) => (
                                        <p key={index}>{paragraph}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'resources' && (
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                            <h2 className="text-2xl font-bold text-white mb-6">All Course Resources</h2>
                            <div className="space-y-4">
                                {course.resources.map((resource) => (
                                    <div
                                        key={resource.id}
                                        className="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors duration-200"
                                    >
                                        <div className="flex items-center gap-3">
                                            {getResourceIcon(resource.type)}
                                            <div>
                                                <h5 className="text-white font-medium">{resource.title}</h5>
                                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                                    <span className="text-orange-400">{course.category}</span>
                                                    <span>•</span>
                                                    <span>{resource.size}</span>
                                                    {resource.duration && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{resource.duration}</span>
                                                        </>
                                                    )}
                                                </div>
                                                {resource.description && (
                                                    <p className="text-sm text-gray-400 mt-1">{resource.description}</p>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleResourceAction(resource)}
                                            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                                        >
                                            {resource.type === 'video' ? (
                                                <>
                                                    <Play className="w-4 h-4" />
                                                    Play
                                                </>
                                            ) : (
                                                <>
                                                    <Download className="w-4 h-4" />
                                                    Download
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default CourseDetailPage;