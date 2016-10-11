using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Matching.Models
{
    public class MenteeQuestionnaire
    {
        //internal
        public DateTime TimeCompleted { get; set; }

        public string Improvements { get; set; }
        public string ToDo { get; set; }
        public string HowWillIKnow { get; set; }
        public string WhenSatisfied { get; set; }
        public string HowToHelp { get; set; }
        public string WhenToReachGoal { get; set; }

        public MenteeQuestionnaire(string improvements, string toDo, string howWillIKnow, string whenSatisfied, string howToHelp, string whenToReachGoal)
        {
            this.TimeCompleted = DateTime.Now;

            this.Improvements = improvements;
            this.ToDo = toDo;
            this.HowWillIKnow = howWillIKnow;
            this.WhenSatisfied = whenSatisfied;
            this.HowToHelp = howToHelp;
            this.WhenToReachGoal = whenToReachGoal;
        }
    }
}