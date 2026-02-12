import React, { useState, useEffect, useRef } from 'react';
import { dsaProblems } from './data/problems';
import CardView from './CardView';
import { getProblemStatus, setProblemStatus, problemStatus, getViewMode, setViewMode, getListState, setListState, getCurrentProblem, setCurrentProblem } from './utils/storageUtils';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-python';

const Dashboard = () => {
  const savedListState = getListState();
  const [expandedCategories, setExpandedCategories] = useState(savedListState.expandedCategories);
  const [expandedProblems, setExpandedProblems] = useState(savedListState.expandedProblems);
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [copiedId, setCopiedId] = useState(null);
  const [viewMode, setViewModeState] = useState(() => getViewMode()); // 'list' or 'card'
  const [pendingCardNavigation, setPendingCardNavigation] = useState(null);
  const cardViewRef = useRef(null);

  // Save view mode to localStorage whenever it changes
  const handleViewModeChange = (mode) => {
    const previousMode = viewMode;
    
    // Sync between views
    if (mode === 'list' && previousMode === 'card') {
      // Switching from card to list - expand the current card's problem
      const currentProblem = getCurrentProblem();
      if (currentProblem) {
        const newExpandedCategories = new Set(expandedCategories);
        const newExpandedProblems = new Set(expandedProblems);
        newExpandedCategories.add(currentProblem.categoryIndex);
        newExpandedProblems.add(`${currentProblem.categoryIndex}-${currentProblem.problemIndex}`);
        setExpandedCategories(newExpandedCategories);
        setExpandedProblems(newExpandedProblems);
        
        // Scroll to the problem after a brief delay
        setTimeout(() => {
          const element = document.getElementById(`problem-${currentProblem.categoryIndex}-${currentProblem.problemIndex}`);
          if (element) {
            const headerHeight = document.querySelector('header')?.offsetHeight || 0;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerHeight;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      }
    } else if (mode === 'card' && previousMode === 'list') {
      // Scroll to top instantly before switching to card view
      window.scrollTo({ top: 0 });
      
      // Set pending navigation - will be handled after CardView mounts
      const currentProblem = getCurrentProblem();
      if (currentProblem) {
        setPendingCardNavigation(currentProblem);
      }
    }
    
    setViewModeState(mode);
    setViewMode(mode);
  };

  useEffect(() => {
    Prism.highlightAll();
  }, [expandedProblems]);

  // Save list view state whenever it changes
  useEffect(() => {
    setListState(expandedCategories, expandedProblems);
  }, [expandedCategories, expandedProblems]);

  // Handle pending card navigation after view switch
  useEffect(() => {
    if (viewMode === 'card' && pendingCardNavigation && cardViewRef.current) {
      cardViewRef.current.navigateToProblem(
        pendingCardNavigation.categoryName,
        pendingCardNavigation.problemName
      );
      setPendingCardNavigation(null);
    }
  }, [viewMode, pendingCardNavigation]);

  const toggleCategory = (categoryIndex) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryIndex)) {
      newExpanded.delete(categoryIndex);
    } else {
      newExpanded.add(categoryIndex);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleProblem = (problemId, categoryIndex, problemIndex, categoryName, problemName) => {
    const newExpanded = new Set(expandedProblems);
    if (newExpanded.has(problemId)) {
      newExpanded.delete(problemId);
    } else {
      newExpanded.add(problemId);
      // Track this as the current problem when expanding
      setCurrentProblem(categoryName, problemName, categoryIndex, problemIndex);
    }
    setExpandedProblems(newExpanded);
  };

  const toggleExpandAll = () => {
    if (isAllExpanded) {
      // Collapse all
      setExpandedCategories(new Set());
      setExpandedProblems(new Set());
      setIsAllExpanded(false);
    } else {
      // Expand all categories
      const allCategories = new Set(filteredProblems.map((_, index) => index));
      setExpandedCategories(allCategories);
      
      // Expand all problems
      const allProblems = new Set();
      filteredProblems.forEach((category, catIndex) => {
        category.problems.forEach((_, probIndex) => {
          allProblems.add(`${catIndex}-${probIndex}`);
        });
      });
      setExpandedProblems(allProblems);
      setIsAllExpanded(true);
    }
  };

  const copyCode = (code, problemId) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedId(problemId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Filter problems based on search, difficulty, and status
  const filteredProblems = dsaProblems.map(category => ({
    ...category,
    problems: category.problems.filter(problem => {
      const matchesSearch = problem.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'All' || problem.difficulty === difficultyFilter;
      let matchesStatus = true;
      if (statusFilter !== 'All') {
        const currentStatus = getProblemStatus(category.category, problem.name);
        matchesStatus = currentStatus === statusFilter;
      }
      return matchesSearch && matchesDifficulty && matchesStatus;
    })
  })).filter(category => category.problems.length > 0);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-gray-600/20 text-gray-300 border-gray-600/50';
      case 'Medium':
        return 'bg-gray-500/20 text-gray-200 border-gray-500/50';
      case 'Hard':
        return 'bg-gray-400/20 text-gray-100 border-gray-400/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case problemStatus.COMPLETED:
        return 'bg-green-500/20 text-green-400';
      case problemStatus.IN_PROGRESS:
        return 'bg-yellow-500/20 text-yellow-400';
      case problemStatus.TO_REVIEW:
        return 'bg-orange-500/20 text-orange-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case problemStatus.COMPLETED:
        return '✓ Done';
      case problemStatus.IN_PROGRESS:
        return '→ In Progress';
      case problemStatus.TO_REVIEW:
        return '🔄 Review';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-dark-bg)' }}>
      {/* Header */}
      <header 
        style={{ 
          backgroundColor: 'rgba(10, 10, 10, 0.95)',
          borderBottomColor: 'rgba(58, 58, 58, 0.3)',
          backdropFilter: 'blur(10px)'
        }} 
        className="border-b sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gray-700 text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">DSA Tracker</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Master A to Z Data Structures</p>
              </div>
            </div>
            <button
              onClick={() => handleViewModeChange(viewMode === 'list' ? 'card' : 'list')}
              className="btn-secondary"
              title={viewMode === 'list' ? 'Switch to Card View' : 'Switch to List View'}
            >
              {viewMode === 'list' ? '🃏 Cards' : '📋 List'}
            </button>
          </div>
        </div>
      </header>

      {/* Card View */}
      {viewMode === 'card' && (
        <CardView ref={cardViewRef} filteredProblems={filteredProblems} />
      )}

      {/* List View */}
      {viewMode === 'list' && (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Search and Filter Bar */}
        <div className="mb-8 space-y-4">
          <div>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 text-base bg-gray-800/50 text-white border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all placeholder-gray-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full px-4 py-3 text-base bg-gray-800/50 text-white border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
              >
                <option value="All">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={toggleExpandAll}
                className="btn-primary w-full"
              >
                {isAllExpanded ? '▶ Collapse All' : '▼ Expand All'}
              </button>
            </div>
          </div>
          {/* Status Filter */}
          <div>
            <div className="flex gap-2 flex-wrap">
              {['All', problemStatus.TODO, problemStatus.IN_PROGRESS, problemStatus.COMPLETED, problemStatus.TO_REVIEW].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    statusFilter === status
                      ? 'bg-gray-600 text-white shadow-lg'
                      : 'bg-gray-800/50 text-gray-300 border border-gray-700 hover:bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  {status === 'All' ? '📋 All' : `${status.charAt(0).toUpperCase()}${status.slice(1).toLowerCase()}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredProblems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No problems found matching your criteria.</p>
            </div>
          ) : (
            filteredProblems.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="card-modern overflow-hidden"
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(categoryIndex)}
                className="w-full px-4 sm:px-6 py-5 flex items-center justify-between transition-all duration-200 ease-out min-h-[60px] group"
              >
                <div className="flex items-center gap-3 flex-wrap flex-1">
                  <span className="text-lg sm:text-xl flex-shrink-0 transition-transform group-hover:scale-110">
                    {expandedCategories.has(categoryIndex) ? '▼' : '▶'}
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {category.category}
                  </h2>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-600/30 text-gray-300 border border-gray-600/40">
                    {category.problems.length}
                  </span>
                </div>
              </button>

              {/* Category Content */}
              {expandedCategories.has(categoryIndex) && (
                <div className="border-t border-gray-700/50">
                  {category.problems.map((problem, problemIndex) => {
                    const problemId = `${categoryIndex}-${problemIndex}`;
                    const isExpanded = expandedProblems.has(problemId);

                    return (
                      <div
                        key={problemIndex}
                        id={`problem-${categoryIndex}-${problemIndex}`}
                        className="border-b border-gray-700/30 last:border-b-0 transition-all hover:bg-gray-800/20"
                      >
                        {/* Problem Header */}
                        <button
                          onClick={() => toggleProblem(problemId, categoryIndex, problemIndex, category.category, problem.name)}
                          className="w-full px-4 sm:px-6 py-4 text-left transition-all duration-200 ease-out min-h-[56px] flex items-center group"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="text-lg flex-shrink-0 transition-transform group-hover:scale-110">
                              {isExpanded ? '▼' : '▶'}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <span className="text-gray-500 font-mono text-xs font-semibold flex-shrink-0 bg-gray-800 px-2 py-1 rounded">
                                  #{problemIndex + 1}
                                </span>
                                <span className="text-white font-semibold text-sm sm:text-base group-hover:text-gray-300 transition-colors">
                                  {problem.name}
                                </span>
                              </div>
                              <div className="flex gap-2 flex-wrap">
                                <span
                                  className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getDifficultyColor(
                                    problem.difficulty
                                  )}`}
                                >
                                  {problem.difficulty}
                                </span>
                                {getProblemStatus(category.category, problem.name) !== problemStatus.TODO && (
                                  <span
                                    className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(
                                      getProblemStatus(category.category, problem.name)
                                    )}`}
                                  >
                                    {getStatusLabel(getProblemStatus(category.category, problem.name))}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>

                        {/* Problem Content */}
                        {isExpanded && (
                          <div className="px-6 pb-6 space-y-5 bg-gradient-to-b from-gray-900/50 to-transparent">
                            {/* Problem Name */}
                            <div>
                              <h3 className="text-2xl font-bold text-white mb-2">
                                {problem.name}
                              </h3>
                            </div>

                            {/* Status Controls */}
                            <div className="pb-5 border-b border-gray-700/50">
                              <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Status:</p>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { status: problemStatus.TODO, label: 'To Do', color: 'bg-gray-700 hover:bg-gray-600' },
                                  { status: problemStatus.IN_PROGRESS, label: 'In Progress', color: 'bg-yellow-600 hover:bg-yellow-700' },
                                  { status: problemStatus.COMPLETED, label: '✓ Completed', color: 'bg-green-600 hover:bg-green-700' },
                                  { status: problemStatus.TO_REVIEW, label: '🔄 Review', color: 'bg-orange-600 hover:bg-orange-700' }
                                ].map(({ status, label, color }) => (
                                  <button
                                    key={status}
                                    onClick={() => {
                                      setProblemStatus(category.category, problem.name, status);
                                      setSearchQuery(searchQuery);
                                    }}
                                    className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                                      getProblemStatus(category.category, problem.name) === status
                                        ? `${color} text-white shadow-lg`
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    }`}
                                  >
                                    {label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Links */}
                            <div className="flex flex-col sm:flex-row gap-3">
                              <a
                                href={problem.youtubeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white rounded-lg transition-all hover:shadow-lg active:scale-95 font-semibold text-sm"
                              >
                                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                                <span>YouTube</span>
                              </a>
                              <a
                                href={problem.leetcodeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white rounded-lg transition-all hover:shadow-lg active:scale-95 font-semibold text-sm"
                              >
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                                <span>Practice</span>
                              </a>
                            </div>

                            {/* Solution */}
                            <div className="space-y-3">
                              <div>
                                <h4 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                  </svg>
                                  Python Solution
                                </h4>
                                <button
                                  onClick={() => copyCode(problem.pythonSolution, problemId)}
                                  className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                >
                                  {copiedId === problemId ? (
                                    <>
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                      Copied!
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                      </svg>
                                      Copy Code
                                    </>
                                  )}
                                </button>
                              </div>
                              <div className="code-block rounded-xl overflow-x-auto border border-gray-700/50" style={{ boxShadow: '0 4px 20px rgba(255, 255, 255, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.08)' }}>
                                <pre className="language-python">
                                  <code className="language-python">
                                    {problem.pythonSolution}
                                  </code>
                                </pre>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))
          )}
        </div>
      </main>
      )}

      {/* Footer */}
      <footer 
        style={{ backgroundColor: 'var(--color-dark-card)', borderTopColor: 'var(--color-dark-border)' }} 
        className="border-t mt-8 sm:mt-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <p className="text-center text-gray-400 text-xs sm:text-sm">
            Built with React & Tailwind CSS • Inspired by{' '}
            <a
              href="https://takeuforward.org/dsa/strivers-a2z-sheet-learn-dsa-a-to-z"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              Striver's A2Z DSA Sheet
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
