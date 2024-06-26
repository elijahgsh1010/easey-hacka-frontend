import { t } from "@lingui/macro";
import { createId } from "@paralleldrive/cuid2";
import { ResumeDto } from "@reactive-resume/dto";
import { CustomSectionGroup, defaultSection, SectionKey } from "@reactive-resume/schema";
import { removeItemInLayout } from "@reactive-resume/utils";
import _set from "lodash.set";
import { temporal, TemporalState } from "zundo";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useStoreWithEqualityFn } from "zustand/traditional";

import { debouncedUpdateResume } from "../services/resume";

export class Recommendation {
  title: string;
  description: string;
  company: string;

  constructor(title: string, description: string, company: string) {
    this.title = title;
    this.description = description;
    this.company = company;
  }
}

type ResumeStore = {
  resume: ResumeDto;

  jobdescription: string;
  score: unknown;
  hardSkills: unknown[];
  softSkills: unknown[];
  userHardSkills: unknown[];
  userSoftSkills: unknown[];
  recommendations: Recommendation[];

  // Actions
  setValue: (path: string, value: unknown) => void;
  setJobDescription: (description: string) => void;
  setScore: (value: unknown) => void;

  setHardSkills: (value: string[]) => void;
  setSoftSkills: (value: string[]) => void;
  setUserHardSkills: (value: string[]) => void;
  setUserSoftSkills: (value: string[]) => void;

  setRecommendations: (value: Recommendation[]) => void;

  // Custom Section Actions
  addSection: () => void;
  removeSection: (sectionId: SectionKey) => void;
};

export const useResumeStore = create<ResumeStore>()(
  temporal(
    immer((set) => ({
      resume: {} as ResumeDto,
      jobdescription: "",
      score: 0,
      hardSkills: [],
      softSkills: [],
      userHardSkills: [],
      userSoftSkills: [],
      recommendations: [],
      setHardSkills: (skillArr : unknown[]) => {
        set((state) => {
          state.hardSkills = skillArr;
        });
      },
      setSoftSkills: (skillArr : string[]) => {
        set((state) => {
          state.softSkills = skillArr;
        });
      },
      setUserHardSkills: (skillArr : string[]) => {
        set((state) => {
          state.userHardSkills = skillArr;
        });
      },
      setUserSoftSkills: (skillArr : string[]) => {
        set((state) => {
          state.userSoftSkills = skillArr;
        });
      },
      setJobDescription: (description : string) => {
        set((state) => {
          state.jobdescription = description;

          debouncedUpdateResume(JSON.parse(JSON.stringify(state.resume)));
        });
      },
      setRecommendations: (recommendations : Recommendation[]) => {
        set((state) => {
          state.recommendations  = recommendations;
        });
      },
      setScore: (value: unknown) => {
        set((state) => {
          state.score = value;
        });
      },
      setValue: (path, value) => {
        set((state) => {
          if (path === "visibility") {
            state.resume.visibility = value as "public" | "private";
          } else {
            state.resume.data = _set(state.resume.data, path, value);
          }

          debouncedUpdateResume(JSON.parse(JSON.stringify(state.resume)));
        });
      },
      addSection: () => {
        const section: CustomSectionGroup = {
          ...defaultSection,
          id: createId(),
          name: t`Custom Section`,
          items: [],
        };

        set((state) => {
          const lastPageIndex = state.resume.data.metadata.layout.length - 1;
          state.resume.data.metadata.layout[lastPageIndex][0].push(`custom.${section.id}`);
          state.resume.data = _set(state.resume.data, `sections.custom.${section.id}`, section);

          debouncedUpdateResume(JSON.parse(JSON.stringify(state.resume)));
        });
      },
      removeSection: (sectionId: SectionKey) => {
        if (sectionId.startsWith("custom.")) {
          const id = sectionId.split("custom.")[1];

          set((state) => {
            removeItemInLayout(sectionId, state.resume.data.metadata.layout);
            delete state.resume.data.sections.custom[id];

            debouncedUpdateResume(JSON.parse(JSON.stringify(state.resume)));
          });
        }
      },
    })),
    {
      limit: 100,
      wrapTemporal: (fn) => devtools(fn),
      partialize: ({ resume }) => ({ resume }),
    },
  ),
);

export const useTemporalResumeStore = <T>(
  selector: (state: TemporalState<Pick<ResumeStore, "resume">>) => T,
  equality?: (a: T, b: T) => boolean,
) => useStoreWithEqualityFn(useResumeStore.temporal, selector, equality);
