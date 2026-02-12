import React, { useState, useEffect } from 'react';
import { dsaProblems } from './data/problems';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-python';

const Dashboard = () => {
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [expandedProblems, setExpandedProblems] = useState(new Set());
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    Prism.highlightAll();
  }, [expandedProblems]);

  const toggleCategory = (categoryIndex) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryIndex)) {
      newExpanded.delete(categoryIndex);
    } else {
      newExpanded.add(categoryIndex);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleProblem = (problemId) => {
    const newExpanded = new Set(expandedProblems);
    if (newExpanded.has(problemId)) {
      newExpanded.delete(problemId);
    } else {
      newExpanded.add(problemId);
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

  // Filter problems based on search and difficulty
  const filteredProblems = dsaProblems.map(category => ({
    ...category,
    problems: category.problems.filter(problem => {
      const matchesSearch = problem.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'All' || problem.difficulty === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    })
  })).filter(category => category.problems.length > 0);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'Hard':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-dark-bg)' }}>
      {/* Header */}
      <header 
        style={{ backgroundColor: 'var(--color-dark-card)', borderBottomColor: 'var(--color-dark-border)' }} 
        className="border-b sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">DSA Tracker</h1>
          <p className="text-xs sm:text-base text-gray-400 mt-1 sm:mt-2">Master Data Structures & Algorithms - A to Z</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Search and Filter Bar */}
        <div className="mb-4 sm:mb-6 flex flex-col gap-3">
          <div className="w-full">
            <input
              type="text"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 text-base bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="flex-1 px-4 py-3 sm:py-2 text-base bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <button
              onClick={toggleExpandAll}
              className="flex-1 sm:flex-none px-4 py-3 sm:py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg transition-colors text-base font-medium whitespace-nowrap"
            >
              {isAllExpanded ? '▶ Collapse All' : '▼ Expand All'}
            </button>
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
              style={{ backgroundColor: 'var(--color-dark-card)', borderColor: 'var(--color-dark-border)' }}
              className="border rounded-lg overflow-hidden"
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(categoryIndex)}
                className="w-full px-4 sm:px-6 py-4 flex items-center justify-between transition-colors active:bg-opacity-80 min-h-[56px]"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-dark-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div className="flex items-center gap-3 sm:gap-3 flex-wrap">
                  <span className="text-xl sm:text-2xl flex-shrink-0">
                    {expandedCategories.has(categoryIndex) ? '▼' : '▶'}
                  </span>
                  <h2 className="text-base sm:text-xl font-semibold text-white">
                    {category.category}
                  </h2>
                  <span className="text-xs sm:text-sm text-gray-400">
                    ({category.problems.length} problems)
                  </span>
                </div>
              </button>

              {/* Category Content */}
              {expandedCategories.has(categoryIndex) && (
                <div style={{ borderTopColor: 'var(--color-dark-border)' }} className="border-t">
                  {category.problems.map((problem, problemIndex) => {
                    const problemId = `${categoryIndex}-${problemIndex}`;
                    const isExpanded = expandedProblems.has(problemId);

                    return (
                      <div
                        key={problemIndex}
                        style={{ borderBottomColor: 'var(--color-dark-border)' }}
                        className="border-b last:border-b-0"
                      >
                        {/* Problem Header */}
                        <button
                          onClick={() => toggleProblem(problemId)}
                          className="w-full px-4 sm:px-6 py-4 text-left transition-colors active:bg-opacity-80 min-h-[56px] flex items-center"
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-dark-hover)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="text-base sm:text-lg flex-shrink-0">
                              {isExpanded ? '▼' : '▶'}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                <span className="text-gray-400 font-mono text-xs flex-shrink-0">
                                  #{problemIndex + 1}
                                </span>
                                <span className="text-white font-medium text-sm sm:text-base">
                                  {problem.name}
                                </span>
                              </div>
                              <span
                                className={`px-2 py-0.5 text-xs rounded border ${getDifficultyColor(
                                  problem.difficulty
                                )} inline-block`}
                              >
                                {problem.difficulty}
                              </span>
                            </div>
                          </div>
                        </button>

                        {/* Problem Content */}
                        {isExpanded && (
                          <div className="px-6 pb-6 space-y-4">
                            {/* Problem Name */}
                            <div className="pt-4">
                              <h3 className="text-2xl font-bold text-white mb-4">
                                {problem.name}
                              </h3>
                            </div>

                            {/* Resources */}
                            <div className="flex flex-col sm:flex-row gap-3">
                              <a
                                href={problem.youtubeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg transition-colors text-sm sm:text-base font-medium"
                              >
                                <svg
                                  className="w-5 h-5 flex-shrink-0"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                                <span>YouTube</span>
                              </a>
                              <a
                                href={problem.leetcodeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white rounded-lg transition-colors text-sm sm:text-base font-medium"
                              >
                                <svg
                                  className="w-5 h-5 flex-shrink-0"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
                                </svg>
                                <span>LeetCode</span>
                              </a>
                            </div>

                            {/* Solution */}
                            <div className="space-y-3">
                              <div className="flex flex-col sm:items-center gap-3">
                                <h4 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                                <svg
                                  className="w-5 h-5 text-blue-400 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                  />
                                </svg>
                                Python Solution
                              </h4>
                              <button
                                onClick={() => copyCode(problem.pythonSolution, problemId)}
                                className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white rounded text-sm sm:text-base font-medium transition-colors flex items-center justify-center gap-2"
                              >
                                {copiedId === problemId ? (
                                  <>
                                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Copied!
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Copy Code
                                  </>
                                )}
                              </button>
                              </div>
                              <div className="code-block rounded-lg overflow-x-auto">
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
              className="text-blue-400 hover:text-blue-300 transition-colors"
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
