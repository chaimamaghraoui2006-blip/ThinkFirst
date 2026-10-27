export type Language = 'en' | 'fr' | 'ar';

export type ProgrammingLanguage = 'python' | 'cpp' | 'c' | 'java' | 'javascript' | 'csharp';

export interface KeyTerm {
  term: string;
  originalTerm?: string;
  definition: string;
}

export interface StructuredSpecs {
  inputFormat: string;
  expectedOutput: string;
  constraints: string[];
  importantConditions: string[];
}

export interface TeachingExample {
  title: string;
  situation: string;
  observableResult: string;
  conceptualWhy: string;
}

export interface ProblemExplanation {
  simpleExplanation: {
    whatIsGiven: string;
    whatIsAsked: string;
    outputRepresentation: string;
    conditionsAndConstraintsSummary: string;
  };
  keyTerms: KeyTerm[];
  structuredSpecs: StructuredSpecs;
  teachingExample: TeachingExample;
  language: Language;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  notes: string;
}

export interface ReviewIssue {
  lineStart: number;
  lineEnd: number;
  category:
    | 'Syntax issue'
    | 'Type or declaration issue'
    | 'Potential boundary issue'
    | 'Possible constraint violation'
    | 'Potential mismatch with the stated requirements'
    | 'Unable to determine';
  confidence: 'high' | 'medium' | 'low';
  originalText: string;
}

export interface ReviewResult {
  id: string;
  timestamp: number;
  attemptNumber: number;
  attemptType: 'code' | 'algorithm' | 'explanation';
  submittedContent: string;
  language?: ProgrammingLanguage;
  status: 'no_obvious_issue' | 'potential_issues_detected' | 'unable_to_evaluate';
  issues: ReviewIssue[];
  disclaimer: string;
  closingMessage: string;
  submittedLineCount: number;
}

export interface StudentDraft {
  problemId: string;
  problemTitle: string;
  originalStatement: string;
  explanation?: ProblemExplanation;
  myUnderstanding: string;
  myApproach: string;
  code: string;
  programmingLanguage: ProgrammingLanguage;
  testCases: TestCase[];
  lastSaved: number;
  reviews: ReviewResult[];
}
