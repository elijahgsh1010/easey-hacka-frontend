import { defaultSections } from "@reactive-resume/schema";
import { Button, RichInput } from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";

import { AiActions } from "@/client/components/ai-actions";
import { useResumeStore } from "@/client/stores/resume";

import { getSectionIcon } from "./shared/section-icon";
import { SectionOptions } from "./shared/section-options";
import {axios} from "@/client/libs/axios";
import {AxiosResponse} from "axios";
import {string} from "zod";
import {GETHARDSKILLURL} from "@/client/pages/builder/sidebars/right/sections/jobdescription";
import {Res} from "@nestjs/common";

const BaseUrl = "https://localhost:7172/Job"
export const GenerateSummaryUrl = BaseUrl + "/get-resume-summary"
export const SummarySection = () => {

  const setValue = useResumeStore((state) => state.setValue);
  const resume = useResumeStore((state) => state.resume);
  var section = useResumeStore(
    (state) => state.resume.data.sections.summary ?? defaultSections.summary,
  );

  const generateSummary = async () => {
    const response = await axios.post<unknown, AxiosResponse<string>, string>(
      GETHARDSKILLURL,
      JSON.stringify(resume.data),
    );

    setValue("sections.summary.content", response.data);
  }

  return (
    <section id="summary" className="grid gap-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          {getSectionIcon("summary")}
          <h2 className="line-clamp-1 text-3xl font-bold">{section.name}</h2>
        </div>

        <div className="flex items-center gap-x-2">
          <Button variant="outline" className="mr-auto" onClick={generateSummary}>
        <span className="">Generate</span>
      </Button>
          <SectionOptions id="summary" />
        </div>
      </header>

      <main className={cn(!section.visible && "opacity-50")}>
        <RichInput
          content={section.content}
          onChange={(value) => setValue("sections.summary.content", value)}
          footer={(editor) => (
            <AiActions value={editor.getText()} onChange={editor.commands.setContent} />
          )}
        />
      </main>
    </section>
  );
};
