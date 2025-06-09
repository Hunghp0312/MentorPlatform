import type React from "react"
import { useEffect, useState } from "react"
import { ArrowLeft, Clock, DollarSign, MessageCircle, Calendar } from "lucide-react"
import ExperienceCard from "../../components/feature/ExperienceCard"
import MentorAvailability from "../../components/feature/MentorAvaibility"
import Button from "../../components/ui/Button"
import BookingSessionDialog from "../../components/dialog/BookingSessionDialog"
import { useNavigate, useParams } from "react-router-dom"
import { sessionService } from "../../services/session.service"
import { BookingRequest } from "../../types/session"
import { toast } from "react-toastify"
import { mentorService } from "../../services/mentorapplication.service"
import DefaultImage from "../../assets/Profile_avatar_placeholder_large.png"
import LoadingOverlay from "../../components/loading/LoadingOverlay"
import { MentorAvailabilitySchedule, MentorProfileDetails, } from "../../types/mentorapplication"



const MentorProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"about" | "experience" | "availability">("about")
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mentor, setMentor] = useState<MentorProfileDetails>({
    photoData: "",
    fullName: "",
    email: "",
    applicantUserId: "",
    lastStatusUpdateDate: "",
    bio: "",
    expertiseAreas: [],
    professionExperience: "",
    documents: [],
    mentorEducations: [],
    mentorWorkExperiences: [],
    mentorCertifications: [],
    teachingApproachResponses: []
  })
  const [availability, setAvailability] = useState<MentorAvailabilitySchedule>({
    weekStartDate: "",
    weekEndDate: "",
    mentorId: "",
    days: []
  })

  const tabs = [
    { id: "about" as const, label: "About" },
    { id: "experience" as const, label: "Experience" },
    { id: "availability" as const, label: "Availability" },
  ]
  const handleConfirmBooking = async (bookingData: BookingRequest) => {
    if (bookingData.learnerMessage.trim() === "") {
      toast.error("Please enter a message for the mentor.");
      return;
    }
    try {
      await sessionService.bookSession(bookingData);
      toast.success("Session booked successfully!");
      setOpenDialog(false);
      navigate(`/booking-session/${id}`);

    }
    catch (error) {
      console.error("Error booking session:", error);
    }
  }
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        // Get the first day of the current week (Monday)
        const getFirstDayOfWeek = () => {
          const today = new Date();
          const day = today.getDay(); // 0 for Sunday, 1 for Monday, etc.
          const diff = day === 0 ? 6 : day - 1; // Calculate days to subtract to get to Monday

          const monday = new Date(today);
          monday.setDate(today.getDate() - diff);
          monday.setHours(0, 0, 0, 0); // Set to beginning of day

          // Format as YYYY-MM-DD
          const year = monday.getFullYear();
          const month = String(monday.getMonth() + 1).padStart(2, '0');
          const date = String(monday.getDate()).padStart(2, '0');

          return `${year}-${month}-${date}`;
        };

        const firstDayOfWeek = getFirstDayOfWeek();
        if (id) {
          const response = await sessionService.getAvaibilityTime(id, firstDayOfWeek);
          setAvailability(response);
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    }
    const fetchMentorProfile = async () => {
      try {
        if (id) {
          const response = await mentorService.getMentorApplicationProfile(id);
          setMentor(response);
        }
      } catch (error) {
        console.error("Error fetching mentor profile:", error);
      }
    };
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchAvailability(),
          fetchMentorProfile()
        ]);
      } catch (error) {
        console.error("Error fetching mentor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id])

  const getTimeAvailable = (): string[] => {
    const timeAvailable = [] as string[];
    const dayName = {
      "Wednesday": "Wed",
      "Thursday": "Thu",
      "Friday": "Fri",
      "Saturday": "Sat",
      "Sunday": "Sun",
      "Monday": "Mon",
      "Tuesday": "Tue"
    }
    availability.days.forEach((day) => {
      if (day.timeBlocks.length > 0) {
        timeAvailable.push(dayName[day.dayName as keyof typeof dayName])
      }
    })
    return timeAvailable;
  }
  const getTimeAvailableSlots = (): { dayName: string; TimeSlot: { startTime: string; endTime: string }[] }[] => {
    const dayNameMap: Record<string, string> = {
      "Tuesday": "Tue",
      "Wednesday": "Wed",
      "Thursday": "Thu",
      "Friday": "Fri",
      "Saturday": "Sat",
      "Sunday": "Sun",
      "Monday": "Mon",
    };

    // Get all days that have time blocks
    const availableDays = availability.days.filter(day => day.timeBlocks.length > 0);

    if (availableDays.length === 0) {
      return [];
    }

    // Return all days with time blocks
    return availableDays.map(day => ({
      dayName: dayNameMap[day.dayName] || day.dayName,
      TimeSlot: day.timeBlocks.map(block => ({
        startTime: block.startTime,
        endTime: block.endTime
      }))
    }));
  }

  const handleCopyLink = () => {
    const profileUrl = window.location.href;
    navigator.clipboard.writeText(profileUrl)
      .then(() => {
        toast.success("Profile link copied to clipboard!");
      })
      .catch((error) => {
        console.error("Error copying link:", error);
        toast.error("Failed to copy profile link.");
      });
  }

  if (loading) {
    return <LoadingOverlay />
  }
  return (
    <div className="min-h-screen bg-slate-800 text-white">
      {/* Header */}
      <header className="bg-slate-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold" data-testid="mentor-profile-header">Mentor Profile</h1>
        </div>
      </header>

      {/* Navigation Bar */}
      <div className="bg-slate-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <button
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
            onClick={() => navigate(-1)}
            data-testid="back-to-browse-button"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Browse
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => handleCopyLink()}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded text-sm"
              data-testid="share-profile-button"
            >
              Share Profile
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="flex justify-between lg:flex-row gap-8 mb-8" data-testid="mentor-profile-header-section">
          <div className="flex flex-col sm:flex-row gap-6">
            <img
              src={mentor?.photoData || DefaultImage}
              alt={mentor?.fullName}
              className="w-32 h-32 rounded-full object-cover border-4 border-orange-500"
              data-testid="mentor-profile-image"
            />
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2" data-testid="mentor-full-name">{mentor?.fullName}</h2>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
                <div className="flex items-center gap-1" data-testid="mentor-availability">
                  <Calendar className="w-4 h-4" />
                  {getTimeAvailable()}
                </div>
                <div className="flex items-center gap-1" data-testid="mentor-experience">
                  <Clock className="w-4 h-4" />
                  {mentor?.professionExperience}
                </div>
                <div className="flex items-center gap-1" data-testid="mentor-hourly-rate">
                  <DollarSign className="w-4 h-4" />$75 / hour
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-300 mb-3" data-testid="expertise-areas-label">Areas of Expertise</h3>
                <div className="flex flex-wrap gap-2" data-testid="expertise-areas-list">
                  {mentor?.expertiseAreas.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-slate-600 rounded-full text-sm"
                      data-testid={`expertise-area-${index}`}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:min-w-[200px]" data-testid="mentor-actions">
            <Button
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition-colors"
              onClick={() => setOpenDialog(true)}
              data-testid="book-session-button"
            >
              Book a Session
            </Button>
            <button
              className="px-6 py-3 bg-slate-600 hover:bg-slate-500 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              data-testid="message-mentor-button"
            >
              <MessageCircle className="w-4 h-4" />
              Message
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-600 mb-8">
          <nav className="flex gap-8" data-testid="mentor-profile-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                  ? "border-orange-500 text-orange-500"
                  : "border-transparent text-gray-300 hover:text-white"
                  }`}
                data-testid={`tab-${tab.id}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "about" && (
          <div className="space-y-8" data-testid="about-tab-content">
            <div>
              <h3 className="text-xl font-semibold mb-4" data-testid="about-section-title">About {mentor?.fullName}</h3>
              <p className="text-gray-300 leading-relaxed" data-testid="mentor-bio">{mentor?.bio}</p>
            </div>

            <div className="grid md:grid-cols-1">
              <div className="bg-slate-700 rounded-lg p-6" data-testid="mentorship-style-section">
                <h4 className="font-semibold mb-4" data-testid="mentorship-style-title">Mentorship Style</h4>
                <ul className="space-y-2" data-testid="teaching-approaches-list">
                  {mentor?.teachingApproachResponses.map((item, index) => (
                    <li
                      key={index}
                      className="text-gray-300 text-sm flex items-start gap-2"
                      data-testid={`teaching-approach-${index}`}
                    >
                      <span className="text-orange-500 mt-1">•</span>
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        {activeTab === "experience" && (
          <div data-testid="experience-tab-content">
            <ExperienceCard experiences={mentor?.mentorWorkExperiences} education={mentor?.mentorEducations} />
          </div>
        )}
        {activeTab === "availability" && (
          <div data-testid="availability-tab-content">
            <MentorAvailability
              initialSelectedDays={getTimeAvailable()}
              initialTimeSlots={getTimeAvailableSlots()}
              onScheduleSession={() => navigate(`/booking-session/${id}`)}
            />
          </div>
        )}
      </div>
      {openDialog && (
        <div data-testid="booking-session-dialog">
          <BookingSessionDialog mentorId={id as string} onClose={() => setOpenDialog(false)} onConfirm={handleConfirmBooking} />
        </div>
      )}
    </div>
  )
}

export default MentorProfile
