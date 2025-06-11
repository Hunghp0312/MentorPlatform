import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import InputCustom from '../../components/input/InputCustom';
import { useNavigate } from 'react-router-dom';
import { mentorService } from '../../services/mentorapplication.service';
import DefaultImage from '../../assets/Profile_avatar_placeholder_large.png'
import useDebounce from '../../hooks/usedebounce';
import TableFooter from '../../components/table/TableFooter';
import LoadingOverlay from '../../components/loading/LoadingOverlay';
interface Mentor {
    id: number;
    fullName: string;
    photoData: string;
    expertiseTags: string[];
    shortBioOrTagline: string;
}


const TopicOption = [
    { id: 1, name: "Career Development" },
    { id: 2, name: "Technical Skills" },
    { id: 3, name: "Leadership" },
    { id: 4, name: "Communication" },
    { id: 5, name: "Work-Life Balance" },
    { id: 6, name: "Industry Insights" },
    { id: 7, name: "Networking" },
    { id: 8, name: "Entrepreneurship" }
];

const areaOfExpertise = [
    { id: 1, name: "Leadership" },
    { id: 2, name: "Programming" },
    { id: 3, name: "Design" },
    { id: 4, name: "Marketing" },
    { id: 5, name: "Data Science" },
    { id: 6, name: "Business" },
    { id: 7, name: "Project Management" },
    { id: 8, name: "Communication" }
]

const MentorFinder: React.FC = () => {
    const navigate = useNavigate();
    const [totalItems, setTotalItems] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const [selectedTopic, setSelectedTopic] = useState<number>();
    const [selectedExpertise, setSelectedExpertise] = useState<number[]>([]);
    const [mentors, setMentors] = useState<Mentor[]>([])
    const handleTopicChange = (expertise: number) => {
        setSelectedTopic(expertise);
    }

    const fetchMentors = async () => {

        try {
            setLoading(true);
            const res = await mentorService.getAvailableMentors(searchTerm, pageIndex, pageSize, selectedTopic ?? null, selectedExpertise)
            setMentors(res.items);
            setTotalItems(res.totalItems);
            setPageSize(res.pageSize);
        }
        catch (error) {
            console.error("Error fetching mentors:", error);
            setMentors([]);
        }
        finally {
            setLoading(false);
        }

    }
    useEffect(() => {
        fetchMentors();
    }, [debouncedSearchTerm, selectedTopic, selectedExpertise.length, pageIndex, pageSize]);

    if (loading) {
        return (
            <LoadingOverlay />
        )
    }

    const handleToggleExpertise = (id: number): void => {
        if (selectedExpertise.includes(id)) {
            // Remove expertise if already selected
            setSelectedExpertise(selectedExpertise.filter(expertiseId => expertiseId !== id));
        } else {
            // Add expertise if not selected
            setSelectedExpertise([...selectedExpertise, id]);
        }
    };

    return (
        <div className="min-h-screen bg-slate-800 text-white p-6" data-testid="mentor-finder-container">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <h1 className="text-2xl font-semibold mb-8" data-testid="page-title">Find a Mentor</h1>

                {/* Search and Filter Section */}
                <div className="bg-slate-700 rounded-lg p-6 mb-8" data-testid="search-filter-section">
                    {/* Search Bar */}
                    <div className="flex gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search mentors by name, role, or expertise..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setPageIndex(1); // Reset to first page on new search
                                }}
                                className="w-full bg-slate-600 border border-slate-500 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                data-testid="search-input"
                            />
                        </div>
                        <div className="relative">
                            <InputCustom
                                name="areaOfExpertise"
                                type="select"
                                value={selectedTopic?.toString() || ""}
                                onChange={(e) => handleTopicChange(Number(e.target.value))}
                                className="bg-slate-600 border border-slate-500 rounded-lg pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 max-h-60 overflow-y-auto"
                                optionList={[
                                    { id: "", name: "Select Topic Of Interesting" },
                                    ...TopicOption.map(expertise => ({ id: expertise.id, name: expertise.name }))
                                ]}
                                data-testid="topic-select"
                            />
                        </div>

                    </div>
                    <div className="mb-6">
                        <h3 className="text-sm font-medium mb-3" data-testid="expertise-label">Areas of Expertise</h3>
                        <div className="flex flex-wrap gap-2" data-testid="expertise-buttons-container">
                            {areaOfExpertise.map((expertise) => (
                                <button
                                    key={expertise.id}
                                    onClick={() => handleToggleExpertise(expertise.id)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedExpertise.includes(expertise.id)
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
                                        }`}
                                    data-testid={`expertise-button-${expertise.id}`}
                                >
                                    {expertise.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-6" data-testid="mentors-section-title">Available Mentors</h2>
                    {mentors.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="mentors-grid">
                            {mentors.map((mentor) => (
                                <div key={mentor.id} className="bg-slate-700 rounded-lg p-6 flex flex-col h-[320px]" data-testid={`mentor-card-${mentor.id}`}>
                                    {/* Mentor Header */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <img
                                            src={mentor.photoData || DefaultImage}
                                            alt={mentor.fullName}
                                            className="w-12 h-12 rounded-full object-cover"
                                            data-testid={`mentor-avatar-${mentor.id}`}
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-white" data-testid={`mentor-name-${mentor.id}`}>{mentor.fullName}</h3>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-300 mb-2">Expertise</p>
                                        <div className="flex items-center flex-wrap gap-1 h-[40px]" data-testid={`mentor-expertise-${mentor.id}`}>
                                            {mentor.expertiseTags.slice(0, 3).map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="px-2 py-1 bg-slate-600 text-xs rounded text-gray-300"
                                                    data-testid={`mentor-skill-${mentor.id}-${skill}`}
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                            {mentor.expertiseTags.length > 3 && (
                                                <span className="px-2 py-1 bg-slate-600 text-xs rounded text-gray-300" data-testid={`mentor-more-skills-${mentor.id}`}>
                                                    +{mentor.expertiseTags.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-300 mb-4 h-[60px] overflow-hidden line-clamp-3" data-testid={`mentor-bio-${mentor.id}`}>
                                        {mentor.shortBioOrTagline || "No description available."}
                                    </p>

                                    <div className="flex gap-2 mt-auto">
                                        <button
                                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                                            onClick={() => navigate(`/mentor-profile/${mentor.id}`)}
                                            data-testid={`view-profile-button-${mentor.id}`}
                                        >
                                            View Profile
                                        </button>
                                        <button
                                            className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                                            data-testid={`message-button-${mentor.id}`}
                                        >
                                            Message
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-300" data-testid="no-mentors-message">No mentors found matching your criteria.</p>
                    )}
                    <div data-testid="pagination-container">
                        <TableFooter
                            pageSizeOptions={[3, 6, 12]}
                            className="mt-6"
                            pageIndex={pageIndex}
                            pageSize={pageSize}
                            totalItems={totalItems}
                            changePage={(page) => setPageIndex(page)}
                            setPageSize={(size) => {
                                setPageSize(size);
                                setPageIndex(1);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorFinder;