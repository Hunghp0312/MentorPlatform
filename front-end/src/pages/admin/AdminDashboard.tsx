import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  Star,
  TrendingUp,
  Download,
  UserPlus,
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-400">
            Platform metrics and statistics overview
          </p>
        </div>

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="bg-slate-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Users className="w-5 h-5 text-orange-500 mr-2" />
              <h3 className="text-orange-500 font-medium">Total Users</h3>
            </div>
            <div className="mb-3">
              <span className="text-4xl font-bold text-white">330</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-slate-400 text-sm">
                <span className="text-blue-400">76 Mentors</span>
                <span className="mx-2">•</span>
                <span className="text-green-400">254 Learners</span>
              </div>
              <span className="text-green-400 text-sm font-medium">
                +15% this month
              </span>
            </div>
          </div>

          {/* Resources Card */}
          <div className="bg-slate-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <BookOpen className="w-5 h-5 text-orange-500 mr-2" />
              <h3 className="text-orange-500 font-medium">Resources</h3>
            </div>
            <div className="mb-3">
              <span className="text-4xl font-bold text-white">128</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">14 added this week</span>
              <span className="text-green-400 text-sm font-medium">
                +8% this month
              </span>
            </div>
          </div>

          {/* Sessions Card */}
          <div className="bg-slate-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 text-orange-500 mr-2" />
              <h3 className="text-orange-500 font-medium">Sessions</h3>
            </div>
            <div className="mb-3">
              <span className="text-4xl font-bold text-white">538</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">
                32 sessions this week
              </span>
              <span className="text-green-400 text-sm font-medium">
                +12% this month
              </span>
            </div>
          </div>

          {/* Pending Approvals Card */}
          <div className="bg-slate-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Clock className="w-5 h-5 text-orange-500 mr-2" />
              <h3 className="text-orange-500 font-medium">Pending Approvals</h3>
            </div>
            <div className="mb-3">
              <span className="text-4xl font-bold text-white">12</span>
            </div>
            <div className="flex items-center justify-between">
              <button className="text-orange-500 text-sm font-medium hover:text-orange-400 transition-colors">
                Review Approvals →
              </button>
            </div>
          </div>
        </div>

        {/* Platform Performance Section */}
        <div className="bg-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">
            Platform Performance
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Avg Session Rating */}
            <div>
              <div className="flex items-center mb-2">
                <Star className="w-4 h-4 text-slate-400 mr-1" />
                <span className="text-slate-400 text-sm">
                  Avg. Session Rating
                </span>
              </div>
              <span className="text-2xl font-bold text-white">4.8/5</span>
            </div>

            {/* Mentor Retention */}
            <div>
              <div className="flex items-center mb-2">
                <TrendingUp className="w-4 h-4 text-slate-400 mr-1" />
                <span className="text-slate-400 text-sm">Mentor Retention</span>
              </div>
              <span className="text-2xl font-bold text-white">92%</span>
            </div>

            {/* Resource Downloads */}
            <div>
              <div className="flex items-center mb-2">
                <Download className="w-4 h-4 text-slate-400 mr-1" />
                <span className="text-slate-400 text-sm">
                  Resource Downloads
                </span>
              </div>
              <span className="text-2xl font-bold text-white">3.2K</span>
            </div>

            {/* New Users */}
            <div>
              <div className="flex items-center mb-2">
                <UserPlus className="w-4 h-4 text-slate-400 mr-1" />
                <span className="text-slate-400 text-sm">New Users (30d)</span>
              </div>
              <span className="text-2xl font-bold text-white">+48</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
