// Registry of level-specific question loaders
// This ensures Vite can statically analyze and bundle all JSON files correctly
export const SUBJECT_LEVEL_MAP = {
  'Matematika': {
    1: () => import('./questions/matematika/level1.json'),
    2: () => import('./questions/matematika/level2.json'),
    3: () => import('./questions/matematika/level3.json'),
    4: () => import('./questions/matematika/level4.json'),
    5: () => import('./questions/matematika/level5.json')
  },
  'Tarix': {
    1: () => import('./questions/tarix/level1.json'),
    2: () => import('./questions/tarix/level2.json'),
    3: () => import('./questions/tarix/level3.json'),
    4: () => import('./questions/tarix/level4.json'),
    5: () => import('./questions/tarix/level5.json')
  },
  'Fizika': {
    1: () => import('./questions/fizika/level1.json'),
    2: () => import('./questions/fizika/level2.json'),
    3: () => import('./questions/fizika/level3.json'),
    4: () => import('./questions/fizika/level4.json'),
    5: () => import('./questions/fizika/level5.json')
  },
  'Rus tili': {
    1: () => import('./questions/rustili/level1.json'),
    2: () => import('./questions/rustili/level2.json'),
    3: () => import('./questions/rustili/level3.json'),
    4: () => import('./questions/rustili/level4.json'),
    5: () => import('./questions/rustili/level5.json')
  },
  'Kimyo': {
    1: () => import('./questions/kimyo/level1.json'),
    2: () => import('./questions/kimyo/level2.json'),
    3: () => import('./questions/kimyo/level3.json'),
    4: () => import('./questions/kimyo/level4.json'),
    5: () => import('./questions/kimyo/level5.json')
  },
  'Biologiya': {
    1: () => import('./questions/biologiya/level1.json'),
    2: () => import('./questions/biologiya/level2.json'),
    3: () => import('./questions/biologiya/level3.json'),
    4: () => import('./questions/biologiya/level4.json'),
    5: () => import('./questions/biologiya/level5.json')
  },
  'Informatika': {
    1: () => import('./questions/informatika/level1.json'),
    2: () => import('./questions/informatika/level2.json'),
    3: () => import('./questions/informatika/level3.json'),
    4: () => import('./questions/informatika/level4.json'),
    5: () => import('./questions/informatika/level5.json')
  }
};

export const getAvailableSubjects = () => Object.keys(SUBJECT_LEVEL_MAP);
