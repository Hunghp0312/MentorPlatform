import type React from "react";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Clock,
  DollarSign,
  MessageCircle,
  Calendar,
} from "lucide-react";
import ExperienceCard from "../../components/feature/ExperienceCard";
import MentorAvailability from "../../components/feature/MentorAvaibility";
import Button from "../../components/ui/Button";
import BookingSessionDialog from "../../components/dialog/BookingSessionDialog";
import { useNavigate, useParams } from "react-router-dom";
import { sessionService } from "../../services/session.service";
import { BookingRequest } from "../../types/session";
import { toast } from "react-toastify";
import { mentorService } from "../../services/mentorapplication.service";
import DefaultImage from "../../assets/Profile_avatar_placeholder_large.png";
import LoadingOverlay from "../../components/loading/LoadingOverlay";

interface ExpertiseArea {
  id: number;
  name: string;
}

interface Document {
  fileId: string;
  fileName: string;
  fileContent: string;
  fileType: string;
}

interface Education {
  institutionName: string;
  fieldOfStudy: string;
  graduationYear: number;
}

interface WorkExperience {
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Certification {
  certificationName: string;
  issuingOrganization: string;
}

interface TeachingApproachResponse {
  id: number;
  name: string;
}

interface MentorProfile {
  photoData: string;
  fullName: string;
  email: string;
  applicantUserId: string;
  lastStatusUpdateDate: string;
  bio: string;
  expertiseAreas: ExpertiseArea[];
  professionExperience: string;
  documents: Document[];
  mentorEducations: Education[];
  mentorWorkExperiences: WorkExperience[];
  mentorCertifications: Certification[];
  teachingApproachResponses: TeachingApproachResponse[];
}

interface TimeBlock {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface AvailabilityDay {
  date: string;
  dayName: string;
  workStartTime: string | null;
  workEndTime: string | null;
  sessionDurationMinutes: number | null;
  bufferMinutes: number | null;
  timeBlocks: TimeBlock[];
}

interface MentorAvailabilitySchedule {
  weekStartDate: string;
  weekEndDate: string;
  mentorId: string;
  days: AvailabilityDay[];
}
const MentorProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "about" | "experience" | "availability"
  >("about");
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mentor, setMentor] = useState<MentorProfile>({
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
    teachingApproachResponses: [],
  });
  const [availability, setAvailability] = useState<MentorAvailabilitySchedule>({
    weekStartDate: "",
    weekEndDate: "",
    mentorId: "",
    days: [],
  });

  const tabs = [
    { id: "about" as const, label: "About" },
    { id: "experience" as const, label: "Experience" },
    { id: "availability" as const, label: "Availability" },
  ];
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
    } catch (error) {
      console.error("Error booking session:", error);
    }
  };
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
          const month = String(monday.getMonth() + 1).padStart(2, "0");
          const date = String(monday.getDate()).padStart(2, "0");

          return `${year}-${month}-${date}`;
        };

        const firstDayOfWeek = getFirstDayOfWeek();
        if (id) {
          const response = await sessionService.getAvaibilityTime(
            id,
            firstDayOfWeek
          );
          setAvailability(response);
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };
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
        await Promise.all([fetchAvailability(), fetchMentorProfile()]);
      } catch (error) {
        console.error("Error fetching mentor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getTimeAvailable = (): string[] => {
    const timeAvailable = [] as string[];
    const dayName = {
      Wednesday: "Wed",
      Thursday: "Thu",
      Friday: "Fri",
      Saturday: "Sat",
      Sunday: "Sun",
      Monday: "Mon",
      Tuesday: "Tue",
    };
    availability.days.forEach((day) => {
      if (day.timeBlocks.length > 0) {
        timeAvailable.push(dayName[day.dayName as keyof typeof dayName]);
      }
    });
    return timeAvailable;
  };
  const getTimeAvailableSlots = (): {
    dayName: string;
    TimeSlot: { startTime: string; endTime: string }[];
  }[] => {
    const dayNameMap: Record<string, string> = {
      Monday: "Mon",
      Tuesday: "Tue",
      Wednesday: "Wed",
      Thursday: "Thu",
      Friday: "Fri",
      Saturday: "Sat",
      Sunday: "Sun",
    };

    // Get all days that have time blocks
    const availableDays = availability.days.filter(
      (day) => day.timeBlocks.length > 0
    );

    if (availableDays.length === 0) {
      return [];
    }

    // Return all days with time blocks
    return availableDays.map((day) => ({
      dayName: dayNameMap[day.dayName] || day.dayName,
      TimeSlot: day.timeBlocks.map((block) => ({
        startTime: block.startTime,
        endTime: block.endTime,
      })),
    }));
  };

  if (loading) {
    return <LoadingOverlay />;
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
          <button
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Browse
          </button>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded text-sm">
              Share Profile
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="flex justify-between lg:flex-row gap-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-6">
            <img
              src={mentor?.photoData || DefaultImage}
              alt={mentor?.fullName}
              className="w-32 h-32 rounded-full object-cover border-4 border-orange-500"
            />
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{mentor?.fullName}</h2>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {/* {mentor.availability.join(", ")} */}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {mentor?.professionExperience}
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  $75 / hour
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-300 mb-3">
                  Areas of Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {mentor?.expertiseAreas.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-slate-600 rounded-full text-sm"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:min-w-[200px]">
            <Button
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition-colors"
              onClick={() => setOpenDialog(true)}
            >
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
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
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
              <h3 className="text-xl font-semibold mb-4">
                About {mentor?.fullName}
              </h3>
              <p className="text-gray-300 leading-relaxed">{mentor?.bio}</p>
            </div>

            <div className="grid md:grid-cols-1">
              <div className="bg-slate-700 rounded-lg p-6">
                <h4 className="font-semibold mb-4">Mentorship Style</h4>
                <ul className="space-y-2">
                  {mentor?.teachingApproachResponses.map((item, index) => (
                    <li
                      key={index}
                      className="text-gray-300 text-sm flex items-start gap-2"
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
          <ExperienceCard
            experiences={mentor?.mentorWorkExperiences}
            education={mentor?.mentorEducations}
          />
        )}
        {activeTab === "availability" && (
          <MentorAvailability
            initialSelectedDays={getTimeAvailable()}
            initialTimeSlots={getTimeAvailableSlots()}
            onScheduleSession={() => navigate(`/booking-session/${id}`)}
          />
        )}
      </div>
      {openDialog && (
        <BookingSessionDialog
          mentorId={id as string}
          onClose={() => setOpenDialog(false)}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
};

export default MentorProfile;
