export type Religion = {
  id: string;
  name: string;
  logo: string;
  colorVar: string;
  scriptures: Scripture[];
};

export type Scripture = {
  id: string;
  name: string;
  tagline: string;
  religionId: string;
  available: boolean;
  chapters?: number;
  verses?: number;
  unitType?: string;
};

export type DailyWisdom = {
  verse: string;
  reference: string;
  scripture: string;
  religion: string;
  religionId: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "ai";
  content: string;
  verses?: VerseBlock[];
  sentiment?: string;
  followUps?: string[];
};

export type VerseBlock = {
  reference: string;
  text: string;
};

export const religions: Religion[] = [
  {
    id: "buddhism",
    name: "Buddhism",
    logo: "/dlogo.webp",
    colorVar: "--buddhism",
    scriptures: [
      { id: "dhammapada", name: "Dhammapada", tagline: "The path of truth — core teachings of the Buddha", religionId: "buddhism", available: true, chapters: 26, verses: 423, unitType: "chapters" },
    ],
  },
  {
    id: "hinduism",
    name: "Hinduism",
    logo: "/glogo.jpg",
    colorVar: "--hindu",
    scriptures: [
      { id: "bhagavad-gita", name: "Bhagavad Gita", tagline: "The Song of the Divine — 700 verses of timeless wisdom", religionId: "hinduism", available: true, chapters: 18, verses: 700, unitType: "chapters" },
    ],
  },
  {
    id: "judaism",
    name: "Judaism",
    logo: "/jlogo.svg",
    colorVar: "--judaism",
    scriptures: [
      { id: "torah", name: "Torah", tagline: "The five books of Moses — foundation of Jewish law", religionId: "judaism", available: true, chapters: 187, verses: 5845, unitType: "chapters" },
    ],
  },
  {
    id: "sikhism",
    name: "Sikhism",
    logo: "/slogo.svg",
    colorVar: "--sikhism",
    scriptures: [
      { id: "guru-granth-sahib", name: "Guru Granth Sahib", tagline: "The eternal Guru — divine poetry across 1430 Angs", religionId: "sikhism", available: true, chapters: 31, verses: 1430, unitType: "angs" },
    ],
  },
  {
    id: "christianity",
    name: "Christianity",
    logo: "/clogo.webp",
    colorVar: "--christianity",
    scriptures: [
      { id: "bible", name: "Bible", tagline: "The word of God — Old and New Testament combined", religionId: "christianity", available: true, chapters: 1189, verses: 31102, unitType: "chapters" },
    ],
  },
  {
    id: "islam",
    name: "Islam",
    logo: "/ilogo.jpg",
    colorVar: "--islam",
    scriptures: [
      { id: "quran", name: "Quran", tagline: "The final revelation — guidance for all of humanity", religionId: "islam", available: true, chapters: 114, verses: 6236, unitType: "surahs" },
    ],
  },
];

export const dailyWisdoms: Record<string, DailyWisdom> = {
  buddhism: {
    verse: "Conquer anger with non-anger. Conquer badness with goodness. Conquer meanness with generosity. Conquer dishonesty with truth.",
    reference: "Dhammapada 223",
    scripture: "Dhammapada",
    religion: "Buddhism",
    religionId: "buddhism",
  },
  hinduism: {
    verse: "You have the right to perform your duty, but you are not entitled to the fruits of your actions.",
    reference: "Bhagavad Gita 2.47",
    scripture: "Bhagavad Gita",
    religion: "Hinduism",
    religionId: "hinduism",
  },
  judaism: {
    verse: "What is hateful to you, do not do to your neighbor. That is the whole Torah; the rest is the explanation. Go and study.",
    reference: "Talmud, Shabbat 31a",
    scripture: "Oral Torah",
    religion: "Judaism",
    religionId: "judaism",
  },
  sikhism: {
    verse: "Recognize the Lord's Light within all, and do not consider social class or status; there are no classes or castes in the world hereafter.",
    reference: "Guru Granth Sahib, Ang 349",
    scripture: "Guru Granth Sahib",
    religion: "Sikhism",
    religionId: "sikhism",
  },
  christianity: {
    verse: "Love your enemies, do good to those who hate you, bless those who curse you, pray for those who mistreat you.",
    reference: "Luke 6:27-28",
    scripture: "Bible",
    religion: "Christianity",
    religionId: "christianity",
  },
  islam: {
    verse: "Show forgiveness, enjoin what is good, and turn away from the ignorant.",
    reference: "Quran 7:199",
    scripture: "Quran",
    religion: "Islam",
    religionId: "islam",
  }
};

export const themeTopics = [
  { label: "Inner Peace", icon: "🕊" },
  { label: "Compassion", icon: "💛" },
  { label: "Purpose", icon: "🎯" },
  { label: "Forgiveness", icon: "🤝" },
  { label: "Gratitude", icon: "✨" },
  { label: "Mindfulness", icon: "🧘" },
  { label: "Love", icon: "❤️" },
  { label: "Courage", icon: "🦁" },
];

export const sampleChatMessages: ChatMessage[] = [
  {
    id: "1",
    role: "user",
    content: "What does the Gita say about dealing with anxiety and fear?",
  },
  {
    id: "2",
    role: "ai",
    content: "The Bhagavad Gita addresses anxiety and fear extensively. Krishna teaches Arjuna that fear arises from attachment to outcomes and identification with the temporary body rather than the eternal self. Here are key verses that speak to this:",
    verses: [
      {
        reference: "Gita 2.47",
        text: "You have the right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.",
      },
      {
        reference: "Gita 2.56",
        text: "One who is not disturbed in mind even amidst the threefold miseries or elated when there is happiness, and who is free from attachment, fear, and anger, is called a sage of steady mind.",
      },
    ],
    sentiment: "Contemplative",
    followUps: [
      "How can I practice detachment in daily life?",
      "What is the concept of 'Sthitaprajna'?",
      "Compare this with Buddhist teachings on suffering",
    ],
  },
  {
    id: "3",
    role: "user",
    content: "How can I practice detachment in daily life?",
  },
  {
    id: "4",
    role: "ai",
    content: "Krishna outlines a practical approach to detachment — it's not about renouncing the world, but transforming your relationship with it. The key is performing actions with full dedication while releasing attachment to specific outcomes. Think of it as giving your best without being enslaved by results.",
    verses: [
      {
        reference: "Gita 3.19",
        text: "Therefore, without being attached to the fruits of activities, one should act as a matter of duty, for by working without attachment one attains the Supreme.",
      },
    ],
    sentiment: "Peaceful",
    followUps: [
      "What role does meditation play in this?",
      "How does karma yoga relate to modern work?",
    ],
  },
];

export function getReligionColor(religionId: string): string {
  const r = religions.find((r) => r.id === religionId);
  return r ? r.colorVar : "--primary";
}

export function getScripture(scriptureId: string): Scripture | undefined {
  for (const r of religions) {
    const s = r.scriptures.find((s) => s.id === scriptureId);
    if (s) return s;
  }
  return undefined;
}

export function getReligionByScriptureId(scriptureId: string): Religion | undefined {
  return religions.find((r) => r.scriptures.some((s) => s.id === scriptureId));
}
