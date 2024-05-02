import { t } from "@lingui/macro";
import {AspectRatio, Button, Dialog, RichInput, Separator} from "@reactive-resume/ui";

import {Recommendation, useResumeStore} from "@/client/stores/resume";

import { getSectionIcon } from "../shared/section-icon";
import {CircleNotch} from "@phosphor-icons/react";
import {cn, templatesList} from "@reactive-resume/utils";
import {ForgotPasswordDto, ImportResumeDto, ResumeDto} from "@reactive-resume/dto";
import {axios} from "@/client/libs/axios";
import {AxiosResponse} from "axios";
import {string} from "zod";
import get from "lodash.get";
import {motion} from "framer-motion";
import React, { useState } from 'react';

const BaseUrl = "https://localhost:7172/Job"
export const GETHARDSKILLURL = BaseUrl + "/predict-hard-skills"
export const GETSOFTSKILLURL = BaseUrl + "/Job/predict-soft-skills"
export const GETSCOREURL = BaseUrl + "/Job/predict-similarity"
export const GETRECOMMENDATIONS = BaseUrl + "/Job/predict-similarity"

export const getHardSkills = async (data: unknown) => {

  const response = await axios.post<unknown, AxiosResponse<string[]>, unknown>(
    GETHARDSKILLURL,
    data,
  );

  return response.data;
};

export const getSoftSkills = async (data: unknown) => {

  const response = await axios.post<unknown, AxiosResponse<string[]>, unknown>(
    GETSOFTSKILLURL,
    data,
  );

  return response.data;
};

export const getScore = async (data: unknown) => {
  const response = await axios.post<unknown, AxiosResponse<string>, unknown>(
    GETSCOREURL,
    data,
  );

  return response.data;
}

export const getRecommendations = async (resume: unknown) => {
  const response = await axios.post<unknown, AxiosResponse<Recommendation[]>, unknown>(
    GETRECOMMENDATIONS,
    resume,
  );

  return response.data;
}

export const JobDescriptionSection = () => {
  const setValue = useResumeStore((state) => state.setValue);
  const setJobDescription = useResumeStore((state) => state.setJobDescription);
  const setScore = useResumeStore((state) => state.setScore);
  const setHardSkills = useResumeStore((state) => state.setHardSkills);
  const setSoftSkills = useResumeStore((state) => state.setSoftSkills);
  const setUserHardSkills = useResumeStore((state) => state.setUserHardSkills);
  const setUserSoftSkills = useResumeStore((state) => state.setUserSoftSkills);
  const notes = useResumeStore((state) => state.resume.data.metadata.notes);
  const jd = useResumeStore((state) => state.jobdescription);
  const resume = useResumeStore((state) => state.resume);

  var score = useResumeStore((state) => state.score) as number;
  var hardSkills = useResumeStore((state) => state.hardSkills) as string[];
  var softSkills = useResumeStore((state) => state.softSkills) as string[];
  const tags = ['Tag1', 'Tag2', 'Tag3', 'Tag4'];
  var userHardSkills = useResumeStore((state) => state.userHardSkills) as string[]
  var userSoftSkills = useResumeStore((state) => state.userSoftSkills) as string[]
  var recommendations = useResumeStore((state) => state.recommendations)

  const setRecommendations = useResumeStore((state) => state.setRecommendations);

  const [isOpen, setIsOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);

  const findRecommendation = async () => {
    var result = await getRecommendations({ resume: JSON.stringify(resume.data) });
    setRecommendations(result);
  }

  const predict = async () => {
    var formatJd = jd.replace(/<p>/g, '');
    formatJd = formatJd.replace(/<\/p>/g, '');

    var score = await getScore( { resume: JSON.stringify(resume.data), description: formatJd });

    setScore(score);

    var hardSkills = await getHardSkills({ message: formatJd});
    setHardSkills(hardSkills);

    var userHardSkillsDto = await getHardSkills({ message: JSON.stringify(resume.data)}) as any[];
    setUserHardSkills(userHardSkillsDto);

    var userSoftSkillsDto = await getSoftSkills({ message: JSON.stringify(resume.data)}) as any[];
    setUserSoftSkills(userSoftSkillsDto);

    console.log(userHardSkills.includes("javascript-(programming-language)"))
    var softSkills = await getSoftSkills({ message: formatJd });
    setSoftSkills(softSkills);
  };
  const isMatched = parseInt(score) >= 50;


  const [openDialog, setOpenDialog] = useState(false);

  const handleClick = () => {
    setOpenDialog(true);
    // Additional logic to handle the click event
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <section id="jobdescription" className="grid gap-y-6">
      <Button variant="outline" className="mr-auto" onClick={predict}>
        <CircleNotch/>
        <span className="ml-2">{t`Predict`}</span>
      </Button>

      <div className="text-center">
        <div className="flex items-center justify-center mb-3">
          <svg className="transform -rotate-90 w-72 h-72">
            <circle cx="145" cy="145" r="120" stroke={isMatched ? '#316c38' : '#472e2e'} strokeWidth="30"
                    fill="transparent" className="text-gray-700"/>
            <circle
              cx="145"
              cy="145"
              r="120"
              stroke={isMatched ? '#0faf22' : '#c21f1f'}
              strokeWidth="30"
              fill="transparent"
              strokeDasharray={2 * 22 / 7 * 120}
              strokeDashoffset={2 * 22 / 7 * 120 - score / 100 * 2 * 22 / 7 * 120}
              className="text-blue-500"
            />
          </svg>
          <span className="absolute text-5xl">{`${score}%`}</span>
        </div>
        {/* <h3 className={cn("text-4xl font-bold blur-none transition-all")}> {score}</h3> */}
        <span
          className={`rounded-full text-white px-3 py-1 ${isMatched ? 'bg-green-500' : 'bg-red-500'}`}>{`${isMatched ? 'Qualified!' : 'Not Qualified'}`}</span>
        {/* <p className="opacity-75">{t`Score`}</p> */}
      </div>

      <h1><b>Hard skills:</b></h1>
      <div className="hardSkills flex flex-wrap gap-2 gap-y-4">
        {hardSkills.map((s, index) =>
          <div key={index} className="">
            <span
              className={`mb-3 text-center px-4 rounded-full py-1 ${(userHardSkills.includes(s) ? 'bg-green-500 text-white' : 'bg-white text-black')}`}>{s} </span>
          </div>
        )}
      </div>

      <h1><b>Soft skills:</b></h1>
      <div className="softSkills flex flex-wrap gap-2 gap-y-4">
        {softSkills.map((s, index) =>
          <div key={index} className="">
            <span
              className={`mb-3 text-center px-4 rounded-full py-1 ${userSoftSkills.includes(s) ? 'bg-green-500 text-white' : 'bg-white text-black'}`}>{s} </span>
          </div>
        )}
      </div>

      <header className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          {getSectionIcon("jobdescription")}
          <h2 className="line-clamp-1 text-3xl font-bold">{t`Job Description`}</h2>
        </div>
      </header>

      <main className="grid gap-y-4">
        <p className="leading-relaxed">
          {t`Input your job description here`}
        </p>

        <div className="space-y-1.5">
          <RichInput content={jd} onChange={(content) => setJobDescription(content)}/>

          <p className="text-xs leading-relaxed opacity-75">
            {t`This job description will match against your resume to determine how good of a match it is for you.`}
          </p>
        </div>
      </main>

      <Button variant="outline" className="mr-auto" onClick={findRecommendation}>
        <CircleNotch/>
        <span className="ml-2">{t`Find Recommendation`}</span>
      </Button>
      <section id="template" className="grid gap-y-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-x-4">
            {getSectionIcon("template")}
            <h2 className="line-clamp-1 text-3xl font-bold">{t`Recommendations`}</h2>
          </div>
        </header>

        <main className="">
          {recommendations.map((template, index) => (
            <div className=" flex flex-wrap gap-2 gap-y-4">
              <p className="text-xs leading-relaxed opacity-75">
                <h1 className=" inset-x-0 bottom-2 text-center font-bold capitalize text-primary">
                  {template.title}
                </h1>
                <p className=" inset-x-0 bottom-2 text-center text-primary">
                  {template.company}
                </p>
                <p className=" inset-x-0 bottom-2 text-center font-bold capitalize text-primary">
                  {template.description}
                </p>
              </p>
            <Separator/>
            </div>
            ))}
        </main>
      </section>
    </section>
  );
};
