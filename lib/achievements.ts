export type AchievementCategory = "published" | "completed";

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  threshold: number;
  icon: string;
  accentClass: string;
}

export interface AchievementStatus extends AchievementDefinition {
  unlocked: boolean;
  progress: number;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "published-1",
    title: "First Spark",
    description: "Publish your first bootcamp.",
    category: "published",
    threshold: 1,
    icon: "Sparkles",
    accentClass:
      "from-sky-500/25 to-cyan-400/10 border-sky-400/30 text-sky-200",
  },
  {
    id: "published-3",
    title: "Signal Booster",
    description: "Publish 3 bootcamps for the community.",
    category: "published",
    threshold: 3,
    icon: "Radio",
    accentClass:
      "from-cyan-500/25 to-blue-400/10 border-cyan-400/30 text-cyan-200",
  },
  {
    id: "published-5",
    title: "Curriculum Smith",
    description: "Publish 5 bootcamps.",
    category: "published",
    threshold: 5,
    icon: "Hammer",
    accentClass:
      "from-blue-500/25 to-indigo-400/10 border-blue-400/30 text-blue-200",
  },
  {
    id: "published-10",
    title: "Guild Founder",
    description: "Publish 10 bootcamps.",
    category: "published",
    threshold: 10,
    icon: "Castle",
    accentClass:
      "from-indigo-500/25 to-violet-400/10 border-indigo-400/30 text-indigo-200",
  },
  {
    id: "published-20",
    title: "Lorekeeper",
    description: "Publish 20 bootcamps and become a library of paths.",
    category: "published",
    threshold: 20,
    icon: "Library",
    accentClass:
      "from-violet-500/25 to-fuchsia-400/10 border-violet-400/30 text-violet-200",
  },
  {
    id: "completed-1",
    title: "Trail Walker",
    description: "Complete your first bootcamp.",
    category: "completed",
    threshold: 1,
    icon: "Footprints",
    accentClass:
      "from-emerald-500/25 to-green-400/10 border-emerald-400/30 text-emerald-200",
  },
  {
    id: "completed-3",
    title: "Momentum Maker",
    description: "Complete 3 bootcamps.",
    category: "completed",
    threshold: 3,
    icon: "Flame",
    accentClass:
      "from-green-500/25 to-lime-400/10 border-green-400/30 text-green-200",
  },
  {
    id: "completed-5",
    title: "Deep Diver",
    description: "Complete 5 bootcamps.",
    category: "completed",
    threshold: 5,
    icon: "Waves",
    accentClass:
      "from-lime-500/25 to-yellow-400/10 border-lime-400/30 text-lime-200",
  },
  {
    id: "completed-10",
    title: "Mastery Engine",
    description: "Complete 10 bootcamps.",
    category: "completed",
    threshold: 10,
    icon: "Rocket",
    accentClass:
      "from-amber-500/25 to-orange-400/10 border-amber-400/30 text-amber-200",
  },
  {
    id: "completed-20",
    title: "Mythic Learner",
    description: "Complete 20 bootcamps and join the top tier.",
    category: "completed",
    threshold: 20,
    icon: "Crown",
    accentClass:
      "from-orange-500/25 to-rose-400/10 border-orange-400/30 text-orange-200",
  },
];

export function getAchievementStatuses(counts: {
  publishedCount: number;
  completedCount: number;
}): AchievementStatus[] {
  return ACHIEVEMENTS.map((achievement) => {
    const currentValue =
      achievement.category === "published"
        ? counts.publishedCount
        : counts.completedCount;

    return {
      ...achievement,
      unlocked: currentValue >= achievement.threshold,
      progress: Math.min(currentValue, achievement.threshold),
    };
  });
}
