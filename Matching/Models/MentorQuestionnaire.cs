using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Matching.Models
{
    public class MentorQuestionnaire
    {
        //internal
        public DateTime TimeCompleted { get; set; }

        public string WhatKindOfMentor { get; set; }
        public string PastEffectiveMentors { get; set; }
        public string WhatMadeMostInfluence { get; set; }
        public string GreatMentors { get; set; }
        public string MentoringImportance { get; set; }
        public string PlanToGain { get; set; }
        public string MenteeWillGain { get; set; }

        public MentorQuestionnaire(string whatKindOfMentor, string pastEffectiveMentors, string whatMadeMostInfluence, string greatMentors, string mentoringImportance, string planToGain, string menteeWillGain)
        {
            this.TimeCompleted = DateTime.Now;

            this.WhatKindOfMentor = whatKindOfMentor;
            this.PastEffectiveMentors = pastEffectiveMentors;
            this.WhatMadeMostInfluence = whatMadeMostInfluence;
            this.GreatMentors = greatMentors;
            this.MentoringImportance = mentoringImportance;
            this.PlanToGain = planToGain;
            this.MenteeWillGain = menteeWillGain;
        }
    }
}