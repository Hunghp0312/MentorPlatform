import type React from "react"
import { useState } from "react"
import { ArrowLeft, Clock, DollarSign, MessageCircle, Calendar } from "lucide-react"
import ExperienceCard from "../../components/feature/ExperienceCard"
import MentorAvailability from "../../components/feature/MentorAvaibility"
import Button from "../../components/ui/Button"
import BookingSessionDialog from "../../components/dialog/BookingSessionDialog"
import { useNavigate } from "react-router-dom"

interface Mentor {
    id: string
    name: string
    title: string
    rating: number
    reviewCount: number
    availability: string[]
    experience: string
    hourlyRate: number
    profileImage: string
    skills: string[]
    about: string
    mentorshipStyle: string[]
    languages: string[]
}

interface SimilarMentor {
    id: string
    name: string
    title: string
    rating: number
    skills: string[]
    profileImage: string
}
interface BookingData {
    mentorId: string;
    mentorTimeAvailableId: string;
    learnerMessage?: string;
    sessionTypeId: string;
}

const MentorProfile: React.FC = () => {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<"about" | "experience" | "availability">("about")
    const [openDialog, setOpenDialog] = useState(false)
    const mentor: Mentor = {
        id: "1",
        name: "Sarah Johnson",
        title: "Senior Developer",
        rating: 4.5,
        reviewCount: 27,
        availability: ["Mon", "Tue", "Wed", "Thu"],
        experience: "10+ years",
        hourlyRate: 75,
        profileImage: "https://randomuser.me/api/portraits/women/60.jpg",
        skills: ["Frontend Development", "React", "UX Design", "JavaScript", "CSS/SASS", "Responsive Design"],
        about:
            "I'm a passionate frontend developer with extensive experience building modern web applications. I specialize in React and have helped numerous junior developers improve their skills and advance their careers. My teaching approach focuses on practical, hands-on learning with real-world examples.",
        mentorshipStyle: [
            "Practical, hands-on learning approach",
            "Focus on real-world projects and examples",
            "Personalized guidance based on individual goals",
            "Regular feedback and code reviews",
        ],
        languages: ["English (Native)", "Spanish (Conversational)"],
    }

    const similarMentors: SimilarMentor[] = [
        {
            id: "2",
            name: "John Smith",
            title: "Frontend Developer",
            rating: 5,
            skills: ["React", "JavaScript"],
            profileImage: "/placeholder.svg?height=60&width=60",
        },
        {
            id: "3",
            name: "John Smith",
            title: "Frontend Developer",
            rating: 5,
            skills: ["React", "JavaScript"],
            profileImage: "/placeholder.svg?height=60&width=60",
        },
        {
            id: "4",
            name: "John Smith",
            title: "Frontend Developer",
            rating: 5,
            skills: ["React", "JavaScript"],
            profileImage: "/placeholder.svg?height=60&width=60",
        },
    ]

    const tabs = [
        { id: "about" as const, label: "About" },
        { id: "experience" as const, label: "Experience" },
        { id: "availability" as const, label: "Availability" },
    ]
    const handleConfirmBooking = (bookingData: BookingData) => {
        console.log("Booking confirmed:", bookingData);
        setOpenDialog(false);
        // Here you would typically send the booking data to your backend
    }

    return (
        <div className="min-h-screen bg-slate-800 text-white">
            {/* Header */}
            <header className="bg-slate-900 px-6 py-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Mentor Profile</h1>
                </div>
            </header>

            {/* Navigation Bar */}
            <div className="bg-slate-700 px-6 py-3">
                <div className="flex items-center justify-between">
                    <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-4 h-4" />
                        Back to Browse
                    </button>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded text-sm">Share Profile</button>
                        <button className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded text-sm">Save</button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Profile Header */}
                <div className="flex flex-col lg:flex-row gap-8 mb-8">
                    <div className="flex flex-col sm:flex-row gap-6">
                        <img
                            src={mentor.profileImage || "https://randomuser.me/api/portraits/men/56.jpg"}
                            alt={mentor.name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-orange-500"
                        />
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold mb-2">{mentor.name}</h2>



                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {mentor.availability.join(", ")}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {mentor.experience}
                                </div>
                                <div className="flex items-center gap-1">
                                    <DollarSign className="w-4 h-4" />${mentor.hourlyRate} / hour
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-300 mb-3">Areas of Expertise</h3>
                                <div className="flex flex-wrap gap-2">
                                    {mentor.skills.map((skill, index) => (
                                        <span key={index} className="px-3 py-1 bg-slate-600 rounded-full text-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 lg:min-w-[200px]">
                        <Button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition-colors" onClick={() => setOpenDialog(true)}>
                            Book a Session
                        </Button>
                        <button className="px-6 py-3 bg-slate-600 hover:bg-slate-500 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            Message
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-slate-600 mb-8">
                    <nav className="flex gap-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                    ? "border-orange-500 text-orange-500"
                                    : "border-transparent text-gray-300 hover:text-white"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === "about" && (
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-4">About {mentor.name}</h3>
                            <p className="text-gray-300 leading-relaxed">{mentor.about}</p>
                        </div>

                        <div className="grid md:grid-cols-1">
                            <div className="bg-slate-700 rounded-lg p-6">
                                <h4 className="font-semibold mb-4">Mentorship Style</h4>
                                <ul className="space-y-2">
                                    {mentor.mentorshipStyle.map((item, index) => (
                                        <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                                            <span className="text-orange-500 mt-1">•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                    </div>
                )}
                {activeTab === "experience" && (
                    <ExperienceCard />
                )}
                {activeTab === "availability" && (
                    <MentorAvailability
                        onScheduleSession={() => console.log("Schedule a session")}
                    />

                )}

                {/* Similar Mentors */}
                <div className="mt-12">
                    <h3 className="text-xl font-semibold mb-6">Similar Mentors</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        {similarMentors.map((similarMentor) => (
                            <div key={similarMentor.id} className="bg-slate-700 rounded-lg p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src={similarMentor.profileImage || "/placeholder.svg"}
                                        alt={similarMentor.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <h4 className="font-medium">{similarMentor.name}</h4>
                                        <p className="text-sm text-blue-400">{similarMentor.title}</p>
                                    </div>
                                </div>


                                <div className="flex flex-wrap gap-2 mb-4">
                                    {similarMentor.skills.map((skill, index) => (
                                        <span key={index} className="px-2 py-1 bg-slate-600 rounded text-xs">
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                <button className="w-full py-2 bg-slate-600 hover:bg-slate-500 rounded text-sm transition-colors">
                                    View Profile
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {openDialog && (

                <BookingSessionDialog onClose={() => setOpenDialog(false)} onConfirm={handleConfirmBooking} />

            )}
        </div>
    )
}

export default MentorProfile
