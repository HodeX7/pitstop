export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const options = { month: "long", day: "numeric", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: "short", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);
  return formattedDate;
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  console.log(date.getTime());

  const formattedDate = date.toLocaleTimeString("en-US", {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
  });
  return formattedDate;
};

const GENDER = {
  male: "Only Boys",
  female: "Only Girls",
  all: "All gender",
};

const AGE_GROUP = {
  u14: "Under 14",
  u16: "Under 16",
  u18: "Under 18",
  u24: "Under 24",
};

const PARTICIPATION = {
  singles: "Singles",
  doubles: "Doubles",
  both: "Both",

  "5vs5": "5 vs 5",
  "7vs7": "7 vs 7",
  "9vs9": "9 vs 9",
  "11vs11": "11 vs 11",
};

const getSportsColor = (sports) => {
  switch (sports.toLowerCase()) {
    case "football":
      return "bg-purple-100";
    case "cricket":
      return "bg-green-100";
    case "table tennis":
      return "bg-yellow-100";
    case "hockey":
      return "bg-blue-100";
    case "swimming":
      return "bg-red-100";
    case "basketball":
      return "bg-orange-100";
    case "badminton":
      return "bg-amber-100";
    case "skating":
      return "bg-gray-100";
    case "snooker":
      return "bg-pink-100";
    default:
      return "";
  }
};

export const CONSTANTS = {
  GENDER,
  AGE_GROUP,
  PARTICIPATION,
  getSportsColor,
};

const Gender = [
  { value: "male", label: "Only Boys" },
  { value: "female", label: "Only Girls" },
  { value: "all", label: "All Genders" },
];

const Sports = [
  { value: "cricket", label: "Cricket" },
  { value: "football", label: "Football" },
  { value: "basketball", label: "Basketball" },
  { value: "badminton", label: "Badminton" },
  { value: "skating", label: "Skating" },
  { value: "snooker", label: "Snooker" },
  { value: "table_tennis", label: "Table Tennis" },
  { value: "swimming", label: "Swimming" },
  { value: "hockey", label: "Hockey" },
];

const ParticipationType = [
  { value: "1vs1", label: "Singles" },
  { value: "2vs2", label: "Doubles" },
  { value: "both", label: "Both" },
];

const ageGroup = [
  { value: "u14", label: "Under 14" },
  { value: "u16", label: "Under 16" },
  { value: "u18", label: "Under 18" },
  { value: "u24", label: "Under 24" },
  { value: "open", label: "Open" },
];

export const FORM_OPTIONS = {
  Gender,
  Sports,
  ageGroup,
  ParticipationType,
};

export const rounds = [
  {
    title: "Round one",
    seeds: [
      {
        id: 1,
        date: new Date().toDateString(),
        teams: [{ name: "Team A" }, { name: "Team B" }],
      },
      {
        id: 2,
        date: new Date().toDateString(),
        teams: [{ name: "Team C" }, { name: "Team D" }],
      },
    ],
  },
  {
    title: "Round one",
    seeds: [
      {
        id: 3,
        date: new Date().toDateString(),
        teams: [{ name: "Team A" }, { name: "Team C" }],
      },
    ],
  },
];

export function playerFees(sport, ParticipationType) {
  switch (sport.toLowerCase()) {
    case "football":
    case "basketball":
    case "cricket":
      return 100;
    case "badminton":
      return ParticipationType === "Doubles" ? 350 : 200;
    case "table tennis":
      return ParticipationType === "Doubles" ? 350 : 200;
    case "skating":
    case "snooker":
    case "swimming":
      return 200;
    default:
      return null;
  }
}

// TOURNAMENT FORM CONDITIONING LOGIC
// participationType
// subCategories
// Gender
// everything else

export const FORM_CONDITIONS = {
  badminton: {
    participationType: [
      { value: "singles", label: "Singles" },
      { value: "doubles", label: "Doubles" },
      { value: "both", label: "Both" },
    ],
    subCategories: false,
    noOfPlayers: false,
  },
  table_tennis: {
    participationType: [
      { value: "singles", label: "Singles" },
      { value: "doubles", label: "Doubles" },
      { value: "both", label: "Both" },
    ],
    subCategories: false,
    noOfPlayers: false,
  },

  cricket: {
    participationType: false,
    subCategories: false,
    noOfPlayers: true,
  },
  football: {
    participationType: false,
    subCategories: false,
    noOfPlayers: true,
  },
  basketball: {
    participationType: false,
    subCategories: false,
    noOfPlayers: true,
  },

  skating: {
    participationType: [
      { value: "quad", label: "Quad" },
      { value: "speedline", label: "Speedline" },
      { value: "recreational", label: "Recreational" },
    ],
    subCategories: ["short race", "long race"],
    noOfPlayers: true,
  },
};

export const CATEGORIES_GENERATION = {
  badminton: {
    pt: ["singles", "doubles"],
    sc: [null],
  },
  table_tennis: {
    pt: ["singles", "doubles"],
    sc: [null],
  },
  skating: {
    pt: ["quad", "speedline", "recreational"],
    sc: ["short race", "long race"],
  },
};
