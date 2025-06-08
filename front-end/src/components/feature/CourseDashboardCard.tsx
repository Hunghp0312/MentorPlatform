import { CourseListItemType } from "../../types/course";

type CourseCardProps = {
    course: CourseListItemType;
};


const CourseCard: React.FC<CourseCardProps> = ({ course }) => {


    const getStatusColor = (statusId: string) => {
        switch (statusId) {
            case "Draft": return 'text-gray-400';
            case "Published": return 'text-green-500';
            default: return 'text-amber-500';
        }
    };

    const formatDate = (date : string | Date) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        return new Date(date).toLocaleDateString('en-US', options);
    }


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
                        {formatDate(new Date(course.created))} • {course.courseLevel}
                    </p>
                </div>

                {/* Category Column */}
                <div className="flex items-center">
                    <span className="font-medium">{course.categoryName || 'Uncategorized'}</span>
                </div>

                {/* Students Column */}
                <div className="flex items-center justify-center">
                    <span className="font-medium">{course.numberOfStudent ?? 0}</span>
                </div>

                {/* Completion Column */}
                <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                            className={`h-2 rounded-full ${getCompletionColor(course.completePercent)}`}
                            style={{ width: `${course.completePercent ?? 0}%` }}
                        ></div>
                    </div>
                    <span>{course.completePercent ?? 0}%</span>
                </div>

                {/* Status Column */}
                <div className="flex justify-center items-center">
                    <span className={`font-medium ${getStatusColor(course.courseStatus)}`}>
                        {course.courseStatus}
                    </span>
                </div>
            </div>
        </div>
    );
};


export default CourseCard;