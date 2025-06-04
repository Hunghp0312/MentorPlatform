import React from 'react';


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

interface ExperienceCardProps {
    experiences: WorkExperience[] | [];
    education: Education[] | [];
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experiences, education }) => {
    const formatDate = (dateString: string): string => {
        if (!dateString) {
            return "present";
        }

        const date = new Date(dateString);
        return date.getFullYear().toString();
    }
    return (
        <div className="w-full mx-auto rounded-xl shadow-md overflow-hidden md:max-w-full">
            <div className="">
                <h1 className="text-xl font-bold text-white mb-6">Experience</h1>

                <div className="mb-8">
                    <h4 className="text-md font-normal text-gray-300 mb-4">Work History</h4>
                    <div>
                        {experiences.map((job, index) => (
                            <div key={`job-${index}`} className='bg-gray-600 px-4 py-4 rounded-lg mb-3 flex justify-between'>
                                <div>
                                    <h5 className="font-medium text-white mb-2">{job.position}</h5>
                                    <p className="text-gray-300">{job.companyName}</p>
                                </div>
                                <span className="text-gray-400 text-sm">{`${formatDate(job.startDate)} - ${formatDate(job.endDate)}`}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-md font-normal text-gray-300 mb-4">Education</h2>
                    <div>
                        {education.map((edu, index) => (
                            <div key={`edu-${index}`} className='bg-gray-600 px-4 py-4 rounded-lg mb-3 flex justify-between '>
                                <div>
                                    <h5 className="font-medium text-white mb-2">{edu.fieldOfStudy}</h5>
                                    <p className="text-gray-300">{edu.institutionName}</p>
                                </div>
                                <span className="text-gray-400 text-sm">{edu.graduationYear}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExperienceCard;