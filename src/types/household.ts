// Enumerations
export type Gender = "male" | "female" | "other" | "unspecified";

// Relation types (relative to a specific target person)
export type RelationKind =
  | "self"
  | "spouse"
  | "son"
  | "daughter"
  | "father"
  | "mother"
  | "brother"
  | "sister"
  | "grandfather"
  | "grandmother"
  | "grandson"
  | "granddaughter"
  | "uncle"
  | "aunt"
  | "cousin"
  | "in_law"
  | "other";

// Person
export interface Person {
  id: string;                 // uuid
  name: string;               // Latin script
  gender: Gender;
  audioUrl?: string;          // short pronunciation clip
  isHead?: boolean;           // one per family
  notes?: string;
}

// Relationship edge (A -> relationKind -> B)
export interface Relationship {
  fromPersonId: string;
  toPersonId: string;         // usually Head's id for simple setup
  kind: RelationKind;         // e.g., "son" relative to Head
}

// Household payload
export interface HouseholdPayload {
  familyDisplayName?: string;
  gotram: string;
  gotramPhonetic?: string;
  gotramAudioUrl?: string;
  people: Person[];
  relationships: Relationship[];
}

// UI State
export interface HouseholdFormState extends HouseholdPayload {
  currentStep: 'basics' | 'head' | 'members' | 'review' | 'pronunciation' | 'final';
  isEditing: boolean;
  validationErrors: Record<string, string>;
}

// Relation suggestions based on gender
export const RELATION_SUGGESTIONS: Record<Gender, RelationKind[]> = {
  male: ['son', 'father', 'brother', 'grandfather', 'grandson', 'uncle', 'cousin', 'spouse', 'in_law', 'other'],
  female: ['daughter', 'mother', 'sister', 'grandmother', 'granddaughter', 'aunt', 'cousin', 'spouse', 'in_law', 'other'],
  other: ['spouse', 'cousin', 'other'],
  unspecified: ['spouse', 'cousin', 'other']
};

// Relation display names
export const RELATION_LABELS: Record<RelationKind, string> = {
  self: 'Self (Head)',
  spouse: 'Spouse',
  son: 'Son',
  daughter: 'Daughter',
  father: 'Father',
  mother: 'Mother',
  brother: 'Brother',
  sister: 'Sister',
  grandfather: 'Grandfather',
  grandmother: 'Grandmother',
  grandson: 'Grandson',
  granddaughter: 'Granddaughter',
  uncle: 'Uncle',
  aunt: 'Aunt',
  cousin: 'Cousin',
  in_law: 'In-law',
  other: 'Other'
};