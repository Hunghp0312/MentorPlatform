import React, { useState } from 'react';
import { Search } from 'lucide-react';
import InputCustom from '../../components/input/InputCustom';
import { useNavigate } from 'react-router-dom';

interface Mentor {
    id: number;
    fullName: string;
    photoData: string;
    expertiseTags: string[];
    shortBioOrTagline: string;
}

const MentorFinder: React.FC = () => {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectAreaOfExpertise, setSelectAreaOfExpertise] = useState<string>('');
    const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);

    const handleExpertiseChange = (expertise: string) => {
        setSelectAreaOfExpertise(expertise);
    }

    const toggleFilter = (value: string, type: string) => {
        if (type === 'expertise') {
            if (selectedExpertise.includes(value)) {
                setSelectedExpertise(selectedExpertise.filter(item => item !== value));
            } else {
                setSelectedExpertise([...selectedExpertise, value]);
            }
        }
    }

    const expertiseOptions = [
        "Frontend",
        "Backend",
        "Data Science",
        "Machine Learning",
        "DevOps",
        "UI/UX Design",
        "Cybersecurity",
        "Cloud Computing",
        "Mobile Development"
    ];

    const areaOfExpertise = [
        "All Areas",
        "Frontend",
        "Backend",
        "Data Science",
        "Machine Learning",
        "DevOps",
        "UI/UX Design",
        "Cybersecurity",
        "Cloud Computing",
        "Mobile Development"
    ]
    const mentors: Mentor[] = [
        {
            id: 1,
            fullName: "Sarah Johnson",
            photoData: "https://randomuser.me/api/portraits/women/44.jpg",
            expertiseTags: ["Frontend", "React", "UI Design"],
            shortBioOrTagline: "Helping new developers master React and modern UI frameworks"
        },
        {
            id: 2,
            fullName: "Michael Chen",
            photoData: "https://randomuser.me/api/portraits/men/22.jpg",
            expertiseTags: ["Analytics", "Machine Learning", "Python"],
            shortBioOrTagline: "Bridging the gap between data science theory and practical applications"
        },
        {
            id: 3,
            fullName: "Aisha Patel",
            photoData: "https://randomuser.me/api/portraits/women/29.jpg",
            expertiseTags: ["Problem Solving", "System Design", "Java"],
            shortBioOrTagline: "Specialized in scaling distributed systems and solving complex backend challenges"
        },
        {
            id: 4,
            fullName: "Daniel Rodriguez",
            photoData: "https://randomuser.me/api/portraits/men/56.jpg",
            expertiseTags: ["Networking", "Cybersecurity", "Cloud Infrastructure"],
            shortBioOrTagline: "Securing networks and teaching best practices in cybersecurity"
        },
        {
            id: 5,
            fullName: "Emma Wilson",
            photoData: "https://randomuser.me/api/portraits/women/33.jpg",
            expertiseTags: ["Frontend", "UX Research", "Design Systems"],
            shortBioOrTagline: "Creating beautiful, accessible, and user-friendly interfaces"
        },
        {
            id: 6,
            fullName: "Jamal Williams",
            photoData: "https://randomuser.me/api/portraits/men/32.jpg",
            expertiseTags: ["Problem Solving", "AWS", "CI/CD"],
            shortBioOrTagline: "Automating infrastructure and optimizing deployment pipelines "
        }
    ];

    return (
        <div className="min-h-screen bg-slate-800 text-white p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <h1 className="text-2xl font-semibold mb-8">Find a Mentor</h1>

                {/* Search and Filter Section */}
                <div className="bg-slate-700 rounded-lg p-6 mb-8">
                    {/* Search Bar */}
                    <div className="flex gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search mentors by name, role, or expertise..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-600 border border-slate-500 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="relative">
                            <InputCustom
                                name="areaOfExpertise"
                                type="select"
                                value={selectAreaOfExpertise}
                                onChange={(e) => handleExpertiseChange(e.target.value)}
                                className="bg-slate-600 border border-slate-500 rounded-lg pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 max-h-60 overflow-y-auto"
                                optionList={[
                                    { id: "", name: "Select Area of Expertise" },
                                    ...areaOfExpertise.map(expertise => ({ id: expertise, name: expertise }))
                                ]}
                            />
                        </div>

                    </div>
                    <div className="mb-6">
                        <h3 className="text-sm font-medium mb-3">Areas of Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                            {expertiseOptions.map((expertise) => (
                                <button
                                    key={expertise}
                                    onClick={() => toggleFilter(expertise, 'expertise')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedExpertise.includes(expertise)
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
                                        }`}
                                >
                                    {expertise}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-6">Available Mentors</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
                        {mentors.map((mentor) => (
                            <div key={mentor.id} className="bg-slate-700 rounded-lg p-6">
                                {/* Mentor Header */}
                                <div className="flex items-center gap-3 mb-4 ">
                                    <img
                                        src={mentor.photoData || "/placeholder.svg"}
                                        alt={mentor.fullName}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white">{mentor.fullName}</h3>
                                    </div>
                                </div>


                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-300 mb-2">Expertise</p>
                                    <div className="flex flex-wrap gap-1">
                                        {mentor.expertiseTags.map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-2 py-1 bg-slate-600 text-xs rounded text-gray-300"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>


                                <p className="text-sm text-gray-300 mb-6 line-clamp-3">
                                    {mentor.shortBioOrTagline || "No description available."}
                                </p>


                                <div className="flex gap-2">
                                    <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors" onClick={() => navigate("/mentor-profile")} >
                                        View Profile
                                    </button>
                                    <button className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                                        Message
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorFinder;