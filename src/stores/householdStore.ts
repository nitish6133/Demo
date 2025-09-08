import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { HouseholdFormState, Person, Relationship, RelationKind } from '../types/household';
import { householdService } from '../services/householdService';
import { useAuthStore } from './useAuthStore';

interface HouseholdStore extends HouseholdFormState {
  // Actions
  setCurrentStep: (step: HouseholdFormState['currentStep']) => void;
  updateBasics: (basics: Partial<Pick<HouseholdFormState, 'gotram' | 'gotramPhonetic' | 'gotramAudioUrl' | 'familyDisplayName'>>) => void;
  
  // Person actions
  addPerson: (person: Omit<Person, 'id'>) => string;
  updatePerson: (id: string, person: Partial<Person>) => void;
  removePerson: (id: string) => void;
  setAsHead: (id: string) => void;
  
  // Relationship actions
  addRelationship: (relationship: Omit<Relationship, 'fromPersonId'> & { fromPersonId?: string }) => void;
  removeRelationship: (fromPersonId: string, toPersonId: string, kind: RelationKind) => void;
  
  // Utility actions
  getHead: () => Person | undefined;
  getRelationships: (personId: string) => Relationship[];
  getRecitationOrder: () => Person[];
  validateHousehold: () => Record<string, string>;
  
  // Persistence
  saveHousehold: () => Promise<string>;
  loadHousehold: (id: string) => Promise<void>;
  loadUserHousehold: () => Promise<void>;
  resetForm: () => void;
  
  // Integration with booking
  exportToBookingFormat: () => { families: any[]; gotram: string };
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialState: HouseholdFormState = {
  currentStep: 'basics',
  isEditing: false,
  validationErrors: {},
  gotram: '',
  gotramPhonetic: '',
  gotramAudioUrl: '',
  familyDisplayName: '',
  people: [],
  relationships: []
};

export const useHouseholdStore = create<HouseholdStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setCurrentStep: (step) => set({ currentStep: step }),

      updateBasics: (basics) => set((state) => ({ ...state, ...basics })),

      addPerson: (person) => {
        const id = generateId();
        const newPerson: Person = { ...person, id };
        
        set((state) => ({
          people: [...state.people, newPerson]
        }));

        // If this is the first person, make them head
        if (get().people.length === 1) {
          get().setAsHead(id);
        }

        return id;
      },

      updatePerson: (id, updates) => set((state) => ({
        people: state.people.map(person => 
          person.id === id ? { ...person, ...updates } : person
        )
      })),

      removePerson: (id) => set((state) => ({
        people: state.people.filter(person => person.id !== id),
        relationships: state.relationships.filter(rel => 
          rel.fromPersonId !== id && rel.toPersonId !== id
        )
      })),

      setAsHead: (id) => set((state) => {
        const updatedPeople = state.people.map(person => ({
          ...person,
          isHead: person.id === id
        }));

        const updatedRelationships = state.relationships.filter(rel => 
          !(rel.fromPersonId === id && rel.toPersonId === id && rel.kind === 'self')
        );

        // Add self relationship for new head
        updatedRelationships.push({
          fromPersonId: id,
          toPersonId: id,
          kind: 'self'
        });

        return {
          people: updatedPeople,
          relationships: updatedRelationships
        };
      }),

      addRelationship: (relationship) => {
        const { fromPersonId = '', ...rel } = relationship;
        const head = get().getHead();
        
        if (!head) return;

        const newRelationship: Relationship = {
          fromPersonId: fromPersonId || rel.toPersonId,
          toPersonId: head.id,
          kind: rel.kind
        };

        set((state) => ({
          relationships: [...state.relationships, newRelationship]
        }));
      },

      removeRelationship: (fromPersonId, toPersonId, kind) => set((state) => ({
        relationships: state.relationships.filter(rel => 
          !(rel.fromPersonId === fromPersonId && rel.toPersonId === toPersonId && rel.kind === kind)
        )
      })),

      getHead: () => {
        return get().people.find(person => person.isHead);
      },

      getRelationships: (personId) => {
        return get().relationships.filter(rel => 
          rel.fromPersonId === personId || rel.toPersonId === personId
        );
      },

      getRecitationOrder: () => {
        const state = get();
        const head = state.people.find(p => p.isHead);
        if (!head) return state.people;

        const getRelatedPeople = (kind: RelationKind) => {
          return state.relationships
            .filter(rel => rel.toPersonId === head.id && rel.kind === kind)
            .map(rel => state.people.find(p => p.id === rel.fromPersonId))
            .filter(Boolean) as Person[];
        };

        const sortByAge = (people: Person[]) => {
          return people.sort((a, b) => {
           
            return 0; // Keep original order if no birth dates
          });
        };

        const spouses = getRelatedPeople('spouse');
        const sons = sortByAge(getRelatedPeople('son'));
        const daughters = sortByAge(getRelatedPeople('daughter'));
        const fathers = getRelatedPeople('father');
        const mothers = getRelatedPeople('mother');
        
        const others = state.people.filter(person => 
          person.id !== head.id && 
          ![...spouses, ...sons, ...daughters, ...fathers, ...mothers].includes(person)
        );

        return [
          head,
          ...spouses,
          ...sons,
          ...daughters,
          ...fathers,
          ...mothers,
          ...others
        ];
      },

      validateHousehold: () => {
        const state = get();
        const errors: Record<string, string> = {};

        if (!state.gotram.trim()) {
          errors.gotram = 'Gotram is required';
        }

        const heads = state.people.filter(p => p.isHead);
        if (heads.length === 0) {
          errors.head = 'Head of family is required';
        } else if (heads.length > 1) {
          errors.head = 'Only one head of family is allowed';
        }

        // Validate relationships
        const nonHeadPeople = state.people.filter(p => !p.isHead);
        for (const person of nonHeadPeople) {
          const hasRelationship = state.relationships.some(rel => rel.fromPersonId === person.id);
          if (!hasRelationship) {
            errors[`person_${person.id}`] = `${person.name} must have at least one relationship`;
          }
        }

        set({ validationErrors: errors });
        return errors;
      },

      saveHousehold: async () => {
        const state = get();
        const errors = get().validateHousehold();
        
        if (Object.keys(errors).length > 0) {
          throw new Error('Validation failed');
        }

        const user = useAuthStore.getState().user;
        if (!user) {
          throw new Error('User must be authenticated to save household');
        }

        const payload = {
          userId: user.id,
          userEmail: user.email,
          familyDisplayName: state.familyDisplayName,
          gotram: state.gotram,
          gotramPhonetic: state.gotramPhonetic,
          gotramAudioUrl: state.gotramAudioUrl,
          people: state.people,
          relationships: state.relationships
        };

        return await householdService.saveHousehold(payload);
      },

      loadHousehold: async (id) => {
        const household = await householdService.getHousehold(id);
        set({ ...initialState, ...household, currentStep: 'final' });
      },

      loadUserHousehold: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        try {
          const household = await householdService.getUserHousehold(user.id);
          if (household) {
            set({ 
              ...initialState, 
              ...household, 
              currentStep: 'final',
              isEditing: true 
            });
          }
        } catch (error) {
          console.log('No existing household found for user');
        }
      },
      resetForm: () => set(initialState)
      
      exportToBookingFormat: () => {
        const state = get();
        const recitationOrder = get().getRecitationOrder();
        
        // Convert household data to booking family format
        const families = [{
          id: 'household-family',
          gotra: state.gotram,
          gotraPronunciationId: state.gotramAudioUrl ? extractFilenameFromUrl(state.gotramAudioUrl) : undefined,
          gotraPronunciationUrl: state.gotramAudioUrl,
          members: recitationOrder.map(person => ({
            id: person.id,
            name: person.name,
            pronunciationId: person.audioUrl ? extractFilenameFromUrl(person.audioUrl) : undefined,
            pronunciationUrl: person.audioUrl
          }))
        }];
        
        return { families, gotram: state.gotram };
      }
    }),
    { name: 'household-store' }
  )
);

// Helper function to extract filename from URL
const extractFilenameFromUrl = (url: string): string | undefined => {
  if (!url) return undefined;
  try {
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
      const parts = url.split('/');
      return parts[parts.length - 1] || undefined;
    }
    return url;
  } catch {
    return url;
  }
};