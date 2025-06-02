import React from 'react';

interface ExperienceItem {
    title: string;
    company: string;
    period: string;
}

interface EducationItem {
    degree: string;
    institution: string;
    year: string;
}

const ExperienceCard: React.FC = () => {
    const workHistory: ExperienceItem[] = [
        {
            title: 'Senior Frontend Developer',
            company: 'Tech Innovations Inc.',
            period: '2018 - Present'
        },
        {
            title: 'Frontend Developer',
            company: 'WebSolutions Co.',
            period: '2014 - 2018'
        },
        {
            title: 'Junior Developer',
            company: 'Digital Creations',
            period: '2012 - 2014'
        }
    ];

    const education: EducationItem[] = [
        {
            degree: 'M.S. Computer Science',
            institution: 'Samford University',
            year: '2012'
        },
        {
            degree: 'B.S. Web Development',
            institution: 'UC Berkeley',
            year: '2010'
        }
    ];

    return (
        <div className="w-full mx-auto  rounded-xl shadow-md overflow-hidden md:max-w-full">
            <div className="">
                <h1 className="text-xl font-bold text-white mb-6">Experience</h1>

                <div className="mb-8">
                    <h4 className="text-md font-normal text-gray-300 mb-4">Work History</h4>
                    <div className="space-y-6">
                        {workHistory.map((job, index) => (
                            <div key={index} className='bg-gray-600 px-4 py-4 rounded-lg'>
                                <div className='flex justify-between'>
                                    <div>
                                        <h5 className="font-medium text-white mb-2">{job.title}</h5>
                                        <p className="text-gray-300">{job.company}</p>
                                    </div>
                                    <span className="text-gray-400 text-sm">{job.period}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-md font-normal text-gray-300 mb-4">Education</h2>
                    <div className="space-y-4">
                        {education.map((edu, index) => (
                            <div key={index} className='bg-gray-600 px-4 py-4 rounded-lg'>
                                <div className='flex justify-between'>
                                    <div>
                                        <h5 className="font-medium text-white mb-2">{edu.degree}</h5>
                                        <p className="text-gray-300">{edu.institution}</p>
                                    </div>
                                    <span className="text-gray-400 text-sm">{edu.year}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExperienceCard;