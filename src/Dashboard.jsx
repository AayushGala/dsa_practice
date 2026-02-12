import React, { useState, useEffect } from 'react';
import { dsaProblems } from './data/problems';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-python';

const Dashboard = () => {
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [expandedProblems, setExpandedProblems] = useState(new Set());
  const [isAllExpanded, setIsAllExpanded] = useState(false);

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
      const allCategories = new Set(dsaProblems.map((_, index) => index));
      setExpandedCategories(allCategories);
      
      // Expand all problems
      const allProblems = new Set();
      dsaProblems.forEach((category, catIndex) => {
        category.problems.forEach((_, probIndex) => {
          allProblems.add(`${catIndex}-${probIndex}`);
        });
      });
      setExpandedProblems(allProblems);
      setIsAllExpanded(true);
    }
  };

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-white">DSA Tracker</h1>
          <p className="text-gray-400 mt-2">Master Data Structures & Algorithms - A to Z</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Expand/Collapse Toggle */}
        <div className="flex justify-end mb-6">
          <button
            onClick={toggleExpandAll}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            {isAllExpanded ? '▶ Collapse All' : '▼ Expand All'}
          </button>
        </div>

        <div className="space-y-4">
          {dsaProblems.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              style={{ backgroundColor: 'var(--color-dark-card)', borderColor: 'var(--color-dark-border)' }}
              className="border rounded-lg overflow-hidden"
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(categoryIndex)}
                className="w-full px-6 py-4 flex items-center justify-between transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-dark-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {expandedCategories.has(categoryIndex) ? '▼' : '▶'}
                  </span>
                  <h2 className="text-xl font-semibold text-white">
                    {category.category}
                  </h2>
                  <span className="text-sm text-gray-400">
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
                          className="w-full px-6 py-4 flex items-center justify-between transition-colors"
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-dark-hover)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">
                              {isExpanded ? '▼' : '▶'}
                            </span>
                            <span className="text-gray-400 font-mono text-sm">
                              #{problemIndex + 1}
                            </span>
                            <span className="text-white font-medium">
                              {problem.name}
                            </span>
                            <span
                              className={`px-2 py-1 text-xs rounded border ${getDifficultyColor(
                                problem.difficulty
                              )}`}
                            >
                              {problem.difficulty}
                            </span>
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
                            <div className="flex flex-wrap gap-3">
                              <a
                                href={problem.youtubeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                                YouTube Tutorial
                              </a>
                              <a
                                href={problem.leetcodeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
                                </svg>
                                LeetCode Problem
                              </a>
                            </div>

                            {/* Solution */}
                            <div className="space-y-2">
                              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                                <svg
                                  className="w-5 h-5 text-blue-400"
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
                              <div className="code-block rounded-lg overflow-hidden">
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
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer 
        style={{ backgroundColor: 'var(--color-dark-card)', borderTopColor: 'var(--color-dark-border)' }} 
        className="border-t mt-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-400">
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
