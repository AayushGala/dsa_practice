// localStorage utility for managing problem status

const STORAGE_KEY = 'dsa_tracker_problems';
const VIEW_MODE_KEY = 'dsa_tracker_view_mode';

export const problemStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  TO_REVIEW: 'to-review',
};

// Get unique key for a problem
export const getProblemKey = (categoryName, problemName) => {
  return `${categoryName}::${problemName}`;
};

// Get status of a problem
export const getProblemStatus = (categoryName, problemName) => {
  const key = getProblemKey(categoryName, problemName);
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  return data[key] || problemStatus.TODO;
};

// Set status of a problem
export const setProblemStatus = (categoryName, problemName, status) => {
  const key = getProblemKey(categoryName, problemName);
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  data[key] = status;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Get all problems with a specific status
export const getProblemsWithStatus = (dsaProblems, status) => {
  const result = [];
  dsaProblems.forEach((category, catIndex) => {
    category.problems.forEach((problem, probIndex) => {
      if (getProblemStatus(category.category, problem.name) === status) {
        result.push({
          ...problem,
          categoryName: category.category,
          categoryIndex: catIndex,
          problemIndex: probIndex,
        });
      }
    });
  });
  return result;
};

// Get all statuses

// Get saved view mode preference
export const getViewMode = () => {
  return localStorage.getItem(VIEW_MODE_KEY) || 'list';
};

// Set view mode preference
export const setViewMode = (mode) => {
  localStorage.setItem(VIEW_MODE_KEY, mode);
};

// Card view position storage
const CARD_POSITION_KEY = 'dsa_tracker_card_position';

// Get saved card position
export const getCardPosition = () => {
  const saved = localStorage.getItem(CARD_POSITION_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return { currentIndex: 0, selectedCategory: null };
    }
  }
  return { currentIndex: 0, selectedCategory: null };
};

// Set card position
export const setCardPosition = (currentIndex, selectedCategory) => {
  localStorage.setItem(CARD_POSITION_KEY, JSON.stringify({ currentIndex, selectedCategory }));
};

// List view state storage
const LIST_STATE_KEY = 'dsa_tracker_list_state';

// Get saved list view state
export const getListState = () => {
  const saved = localStorage.getItem(LIST_STATE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        expandedCategories: new Set(parsed.expandedCategories || []),
        expandedProblems: new Set(parsed.expandedProblems || [])
      };
    } catch (e) {
      return { expandedCategories: new Set(), expandedProblems: new Set() };
    }
  }
  return { expandedCategories: new Set(), expandedProblems: new Set() };
};

// Set list view state
export const setListState = (expandedCategories, expandedProblems) => {
  localStorage.setItem(LIST_STATE_KEY, JSON.stringify({
    expandedCategories: Array.from(expandedCategories),
    expandedProblems: Array.from(expandedProblems)
  }));
};

// Current problem tracking (for syncing between views)
const CURRENT_PROBLEM_KEY = 'dsa_tracker_current_problem';

// Get current problem
export const getCurrentProblem = () => {
  const saved = localStorage.getItem(CURRENT_PROBLEM_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return null;
    }
  }
  return null;
};

// Set current problem
export const setCurrentProblem = (categoryName, problemName, categoryIndex, problemIndex) => {
  localStorage.setItem(CURRENT_PROBLEM_KEY, JSON.stringify({ 
    categoryName, 
    problemName,
    categoryIndex,
    problemIndex
  }));
};
export const getAllProblemStatuses = (dsaProblems) => {
  const statuses = {};
  dsaProblems.forEach((category) => {
    category.problems.forEach((problem) => {
      const key = getProblemKey(category.category, problem.name);
      statuses[key] = getProblemStatus(category.category, problem.name);
    });
  });
  return statuses;
};

// Get stats
export const getStats = (dsaProblems) => {
  const stats = {
    total: 0,
    completed: 0,
    inProgress: 0,
    toReview: 0,
    todo: 0,
  };

  dsaProblems.forEach((category) => {
    category.problems.forEach((problem) => {
      stats.total++;
      const status = getProblemStatus(category.category, problem.name);
      if (status === problemStatus.COMPLETED) stats.completed++;
      else if (status === problemStatus.IN_PROGRESS) stats.inProgress++;
      else if (status === problemStatus.TO_REVIEW) stats.toReview++;
      else stats.todo++;
    });
  });

  return stats;
};
