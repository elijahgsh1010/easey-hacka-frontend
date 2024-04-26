import { t } from "@lingui/macro";
import {Button, RichInput} from "@reactive-resume/ui";

import { useResumeStore } from "@/client/stores/resume";

import { getSectionIcon } from "../shared/section-icon";
import {CircleNotch} from "@phosphor-icons/react";
import {cn} from "@reactive-resume/utils";
import {ForgotPasswordDto} from "@reactive-resume/dto";
import {axios} from "@/client/libs/axios";
import {AxiosResponse} from "axios";

export const GETHARDSKILLURL = "https://localhost:7172/Job/get-all-specialized-skills?description="
export const GETSOFTSKILLURL = "https://localhost:7172/Job/get-all-common-skills?description="

export const getHardSkills = async (data: string) => {
  const response = await axios.get<unknown, AxiosResponse<unknown>>(
    GETHARDSKILLURL + data
  );

  return response.data;
};

export const getSoftSkills = async (data: string) => {
  const response = await axios.get<unknown, AxiosResponse<unknown>>(
    GETSOFTSKILLURL + data
  );

  return response.data;
};


export const JobDescriptionSection = () => {
  const setValue = useResumeStore((state) => state.setValue);
  const setJobDescription = useResumeStore((state) => state.setJobDescription);
  const setScore = useResumeStore((state) => state.setScore);
  const setHardSkills = useResumeStore((state) => state.setHardSkills);
  const setSoftSkills = useResumeStore((state) => state.setSoftSkills);
  const notes = useResumeStore((state) => state.resume.data.metadata.notes);
  const jd = useResumeStore((state) => state.jobdescription);

  var score = useResumeStore((state) => state.score) as number;
  var hardSkills = ['.net framework'];
  var softSkills = ['problem-solving'];
  const tags = ['Tag1', 'Tag2', 'Tag3', 'Tag4'];
  const predict = async () => {
    var formatJd = jd.replace('<p>', '')
    formatJd = formatJd.replace('</p>', '')
    setScore(10)
    var hardSkills = await getHardSkills("Finance Manager,\"As a Finance Manager, you will play a key role in overseeing and managing financial operations for Singapore. You will be responsible for ensuring timely monthly closing and financial reporting, budget and forecast, financial compliance, analyzing financial performance. You will also provide strategic financial guidance, and overseeing the consolidation of financial data across the region. This position requires a strong understanding of finance, excellent analytical skills, and the ability to work collaboratively with various stakeholders. Responsibilities Financial Reporting and Consolidation: Prepare accurate and timely financial reports, including P&L statements, balance sheets, and cash flow statements. Lead the consolidation of financial data from multiple entities. Ensure compliance with accounting standards, regulations, and company policies. Budget Management: Monitor and control regional budgets, providing insights into variances and recommending corrective actions. Work closely with department heads to align budgetary goals with operational needs. Risk Management: Identify financial risks and opportunities within the region, proposing strategies to mitigate risks and capitalize on opportunities. Implement and monitor internal controls to safeguard company assets. Collaboration: Partner with other departments, including sales, operations, and supply chain, to align financial goals with overall business objectives. Provide financial insights and guidance to support decision-making at the regional level. Audit and Compliance: Coordinate and manage external audits, ensuring compliance with regulatory requirements. Implement and enforce financial policies and procedures to maintain high standards of financial integrity. Consolidation Leadership: Oversee the consolidation process, ensuring accuracy and completeness of financial data across the region. Collaborate with finance teams in different entities to streamline consolidation procedures. Financial Planning and Analysis: Develop and implement financial strategies to achieve regional business objectives. Conduct regular financial analysis and forecasting to support decision-making processes. Collaborate with senior management to develop budgets and financial plans for the regions Team Leadership: Lead and develop a regional finance team, providing guidance and support for professional growth. Foster a collaborative and results-oriented work environment. Qualifications: ISCA / Chartered Accountant / ACCA Member Bachelor's degree in Finance, Accounting, or a related field Proven experience in a finance manager in both financial operations, month end closing, reporting and leading a team Preferably in the distribution industry. ERP Implementation experience is a plus. Strong understanding of financial regulations, accounting principles, and financial analysis. Excellent communication and interpersonal skills. Proficient in MS Office suite especially MS Excel (Pivot, V-Lookup) and PowerPoint Proficiency in ERP system i.e. Navision/Business Central. Well organized, meticulous, analytical and can work independently. A team player who can deliver under tight deadlines\",SPD Scientific Pte Ltd");
    alert(hardSkills)
    setHardSkills(hardSkills)
  };

  return (
    <section id="jobdescription" className="grid gap-y-6">

      <Button variant="outline" className="mr-auto" onClick={predict}>
        <CircleNotch/>
        <span className="ml-2">{t`Predict`}</span>
      </Button>

      <div>
        <h3 className={cn("text-4xl font-bold blur-none transition-all")}>
          {score}
        </h3>
        <p className="opacity-75">{t`Score`}</p>
      </div>

      <div className="hardSkills">
        {tags.map((tag, index) => <span key={index} className="tag">{tag}, </span>)}
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
    </section>
  );
};
