export type ApiQuestion = {
  _id: string;
  order: number;
  questionText: string;
  storageKey?: string;
  screenKey?: string;
  attributeId?: string;
  classid?: string;
};

type QuizDefinition = {
  storageKey: string;
  order: number;
  questionText: string;
  attributeIds?: string[];
  classIds?: string[];
  parseAnswer: (rawValue: string) => string | number | string[] | null;
};

export type QuizResponsePayload = {
  questionId: string;
  answer: string | number | string[];
};

const parseJsonArray = (rawValue: string) => {
  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
};

const getBackendApiBaseUrl = () => process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ?? "";

const definitionList: QuizDefinition[] = [
  {
    storageKey: "screen1-age",
    order: 1,
    questionText: "Wie alt bist du?",
    attributeIds: ["age", "age-group"],
    classIds: ["screen1-age"],
    parseAnswer: (rawValue) => rawValue || null,
  },
  {
    storageKey: "screen2-flash",
    order: 2,
    questionText: "Leidest du unter Hitzewallungen?",
    attributeIds: ["hot-flashes"],
    classIds: ["screen2-flash"],
    parseAnswer: (rawValue) => {
      const options: Record<string, string> = {
        yes: "Ja",
        no: "Nein",
      };
      return options[rawValue] ?? rawValue ?? null;
    },
  },
  {
    storageKey: "screen3-sleep",
    order: 3,
    questionText: "Wie schlaefst du aktuell?",
    attributeIds: ["sleep-quality"],
    classIds: ["screen3-sleep"],
    parseAnswer: (rawValue) => {
      const options: Record<string, string> = {
        "1": "Ich schlafe sehr gut",
        "2": "Mein Schlaf ist meistens gut",
        "3": "Ich schlafe unruhig",
        "4": "Ich habe Probleme durchzuschlafen",
      };
      return options[rawValue] ?? rawValue ?? null;
    },
  },
  {
    storageKey: "screen4-intim",
    order: 4,
    questionText: "Wie hat sich dein Intimleben veraendert?",
    attributeIds: ["intimleben", "libido"],
    classIds: ["screen4-intim"],
    parseAnswer: (rawValue) => {
      const options: Record<string, string> = {
        "1": "Mein Interesse ist gleich geblieben",
        "2": "Ich habe weniger Interesse als zuvor",
        "3": "Ich habe mehr Interesse als zuvor",
      };
      return options[rawValue] ?? rawValue ?? null;
    },
  },
  {
    storageKey: "screen5-exhausted",
    order: 5,
    questionText: "Fuehlst du dich haeufig erschoepft?",
    attributeIds: ["energy", "exhausted"],
    classIds: ["screen5-exhausted"],
    parseAnswer: (rawValue) => {
      const options: Record<string, string> = {
        "1": "Ja",
        "2": "Nein",
      };
      return options[rawValue] ?? rawValue ?? null;
    },
  },
  {
    storageKey: "screen6-anxious",
    order: 6,
    questionText: "Fuehlst du dich gestresst oder aengstlich?",
    attributeIds: ["stress", "anxious"],
    classIds: ["screen6-anxious"],
    parseAnswer: (rawValue) => {
      const options: Record<string, string> = {
        "1": "Ja",
        "2": "Nein",
        "3": "Moechte ich nicht beantworten",
      };
      return options[rawValue] ?? rawValue ?? null;
    },
  },
  {
    storageKey: "screen7-symptoms",
    order: 7,
    questionText: "Welche weiteren Symptome treffen auf dich zu?",
    attributeIds: ["additional-symptoms"],
    classIds: ["screen7-symptoms"],
    parseAnswer: (rawValue) => parseJsonArray(rawValue),
  },
  {
    storageKey: "screen8-weight",
    order: 8,
    questionText: "Hast du eine Gewichtszunahme bemerkt?",
    attributeIds: ["weight-gain"],
    classIds: ["screen8-weight"],
    parseAnswer: (rawValue) => {
      const options: Record<string, string> = {
        "1": "Ja",
        "2": "Nein",
        "3": "Nicht sicher",
      };
      return options[rawValue] ?? rawValue ?? null;
    },
  },
  {
    storageKey: "screen10-symptoms",
    order: 9,
    questionText: "Was hast du bisher schon ausprobiert?",
    attributeIds: ["previous-methods"],
    classIds: ["screen10-symptoms"],
    parseAnswer: (rawValue) => parseJsonArray(rawValue),
  },
  {
    storageKey: "screen12-height",
    order: 10,
    questionText: "Wie gross bist du?",
    attributeIds: ["height"],
    classIds: ["screen12-height"],
    parseAnswer: (rawValue) => {
      const parsed = Number(rawValue);
      return Number.isFinite(parsed) ? parsed : null;
    },
  },
  {
    storageKey: "screen13-current-weight",
    order: 11,
    questionText: "Wie viel wiegst du aktuell?",
    attributeIds: ["current-weight"],
    classIds: ["screen13-current-weight"],
    parseAnswer: (rawValue) => {
      const parsed = Number(rawValue);
      return Number.isFinite(parsed) ? parsed : null;
    },
  },
  {
    storageKey: "screen13-target-weight",
    order: 12,
    questionText: "Was ist dein Zielgewicht?",
    attributeIds: ["goal-weight", "target-weight"],
    classIds: ["screen13-target-weight"],
    parseAnswer: (rawValue) => {
      const parsed = Number(rawValue);
      return Number.isFinite(parsed) ? parsed : null;
    },
  },
  {
    storageKey: "screen14-body-type",
    order: 13,
    questionText: "Welcher Koerpertyp beschreibt dich am besten?",
    attributeIds: ["body-type"],
    classIds: ["screen14-body-type"],
    parseAnswer: (rawValue) => rawValue || null,
  },
];

const LOCAL_API_BASE_URL = "/api";

export const getApiBaseUrl = () => LOCAL_API_BASE_URL;

export const getLocalQuestions = (): ApiQuestion[] =>
  definitionList.map((definition) => ({
    _id: definition.storageKey,
    order: definition.order,
    questionText: definition.questionText,
    attributeId: definition.attributeIds?.[0],
    classid: definition.classIds?.[0],
  }));

export const fetchQuestions = async (gender = "female"): Promise<ApiQuestion[]> => {
  const params = new URLSearchParams({ gender });

  try {
    const response = await fetch(`${LOCAL_API_BASE_URL}/questions?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Fragen konnten nicht geladen werden.");
    }

    const data = (await response.json()) as { questions?: ApiQuestion[] };
    return Array.isArray(data.questions) && data.questions.length > 0
      ? data.questions
      : getLocalQuestions();
  } catch {
    return getLocalQuestions();
  }
};

const findMatchingQuestion = (
  questions: ApiQuestion[],
  definition: QuizDefinition,
  usedQuestionIds: Set<string>,
) =>
  questions.find(
    (question) =>
      !usedQuestionIds.has(question._id) &&
      ((definition.attributeIds?.includes(question.attributeId ?? "") ?? false) ||
        (definition.classIds?.includes(question.classid ?? "") ?? false) ||
        question.order === definition.order),
  );

export const buildQuizResponses = (
  questions: ApiQuestion[],
  storage: Storage,
): QuizResponsePayload[] => {
  const usedQuestionIds = new Set<string>();

  return definitionList.flatMap((definition) => {
    const rawValue = storage.getItem(definition.storageKey);
    if (!rawValue) {
      return [];
    }

    const answer = definition.parseAnswer(rawValue);
    if (
      answer == null ||
      (Array.isArray(answer) && answer.length === 0) ||
      (typeof answer === "string" && answer.trim() === "")
    ) {
      return [];
    }

    const question = findMatchingQuestion(questions, definition, usedQuestionIds);
    if (!question?._id) {
      return [];
    }

    usedQuestionIds.add(question._id);
    return [{ questionId: question._id, answer }];
  });
};

export const submitQuizAssessment = async (payload: {
  userId?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  message?: string;
  gender?: string;
  responses: QuizResponsePayload[];
}) => {
  const submitToApi = async (baseUrl: string) => {
    const response = await fetch(`${baseUrl}/questions/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        typeof data?.message === "string"
          ? data.message
          : "Das Assessment konnte nicht gespeichert werden.",
      );
    }

    return data as {
      token?: string;
      user?: {
        id?: string;
        name?: string;
        email?: string;
        firstName?: string;
        fullName?: string;
        lastName?: string;
        gender?: string;
        role?: string;
      };
      updatedUser?: {
        id?: string;
        name?: string;
        email?: string;
        assessments?: Array<{
          submissionId?: string;
          gender?: string;
          responses?: QuizResponsePayload[];
          createdAt?: string;
        }>;
      };
    };
  };

  try {
    const backendApiBaseUrl = getBackendApiBaseUrl();

    if (!backendApiBaseUrl) {
      throw new Error("Backend API base URL is not configured.");
    }

    return await submitToApi(backendApiBaseUrl);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Assessment API tak pohanch nahi ho saki.");
    }

    throw error;
  }
};
