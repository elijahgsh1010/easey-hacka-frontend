import React from 'react';
import {
  Button,
} from "@reactive-resume/ui";

export const jobs = [
  {
    id: 1,
    title: 'Software Engineer',
    company: 'Acme Corporation',
    location: 'San Francisco, CA',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nec justo id lorem consequat maximus.',
  },
  {
    id: 2,
    title: 'Data Scientist',
    company: 'Tech Co.',
    location: 'New York, NY',
    description: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
  },
  {
    id: 3,
    title: 'Product Manager',
    company: 'Startup XYZ',
    location: 'Seattle, WA',
    description: 'Sed euismod, enim vel tempor fermentum, nunc sapien aliquet magna, sit amet mattis purus elit eget leo.',
  },
];


export const JobsRecommendation = () => {
  return (
    <section>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-4"> {/* Aligning with title */}
          <h1 className="text-3xl font-bold">Job Recommendations</h1>
          <div>
          <Button variant="outline" className="mr-auto">
            Back
          </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map(job => (
            <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2 text-black">{job.title}</h2>
              <p className="text-gray-600 mb-2">{job.company}</p>
              <p className="text-gray-600 mb-2">{job.location}</p>
              <p className="text-gray-700">{job.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}