import React, { useState, useRef, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-python';
import { getProblemStatus, setProblemStatus, problemStatus } from './utils/storageUtils';

const CardView = ({ filteredProblems }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [copiedId, setCopiedId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategories, setShowCategories] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    Prism.highlightAll();
  }, [currentIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const goToNext = () => {
    if (currentIndex < totalProblems - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleTouchStart = (e) => {
    // Don't track swipes on interactive elements
    const target = e.target;
    if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('button') || target.closest('a')) {
      return;
    }
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(e.targetTouches[0].clientX); // Set initial end position same as start
  };

  const handleTouchMove = (e) => {
    if (touchStart === 0) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStart === 0) return;
    const finalX = e.changedTouches[0].clientX;
    const distance = touchStart - finalX;
    const minSwipeDistance = 75;
    
    // Only navigate if it's a deliberate swipe
    if (Math.abs(distance) >= minSwipeDistance) {
      if (distance > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
    
    // Reset state
    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newIndex = Math.floor(percentage * totalProblems);
    setCurrentIndex(Math.min(newIndex, totalProblems - 1));
  };

  // Flatten all problems into a single array with category info
  const allProblems = [];
  filteredProblems.forEach((category, catIndex) => {
    category.problems.forEach((problem, probIndex) => {
      allProblems.push({
        ...problem,
        categoryName: category.category,
        categoryIndex: catIndex,
        problemIndex: probIndex,
        categoryKey: category.category,
      });
    });
  });

  // Filter by selected category if one is chosen
  let displayProblems = allProblems;
  if (selectedCategory === 'to-review') {
    // Show only problems marked for review
    displayProblems = allProblems.filter(
      p => getProblemStatus(p.categoryName, p.name) === problemStatus.TO_REVIEW
    );
  } else if (selectedCategory !== null) {
    // Show problems from selected category
    displayProblems = allProblems.filter(p => p.categoryIndex === selectedCategory);
  }

  const totalProblems = displayProblems.length;
  const currentProblem = totalProblems > 0 ? displayProblems[Math.min(currentIndex, displayProblems.length - 1)] : null;

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedId('solution');
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleStatusClick = (newStatus) => {
    setProblemStatus(currentProblem.categoryName, currentProblem.name, newStatus);
    // Force a re-render by updating state (could also use a callback)
    setCurrentIndex(currentIndex);
  };

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

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ backgroundColor: 'var(--color-dark-bg)' }}
    >
      <div className="w-full max-w-2xl">
        {/* Progress Indicator */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-gray-400 text-sm">
            Problem {totalProblems === 0 ? 0 : currentIndex + 1} of {totalProblems}
          </span>
          <div 
            onClick={handleProgressClick}
            className="flex-1 mx-3 h-2 bg-gray-700 rounded-full overflow-hidden cursor-pointer hover:h-2.5 transition-all"
          >
            <div
              className="h-full bg-gray-400 transition-all duration-300"
              style={{ width: `${totalProblems === 0 ? 0 : ((currentIndex + 1) / totalProblems) * 100}%` }}
            />
          </div>
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors flex-shrink-0"
            title={showCategories ? 'Hide categories' : 'Show categories'}
          >
            {showCategories ? '✕' : '⋮'}
          </button>
        </div>

        {/* Category Selector */}
        {showCategories && (
        <div className="mb-4 flex gap-2 flex-wrap pb-4 border-b border-gray-700">
          <button
            onClick={() => {
              setSelectedCategory(null);
              setCurrentIndex(0);
            }}
            className={`px-3 py-1 text-xs sm:text-sm rounded-full font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-white text-black'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => {
              setSelectedCategory('to-review');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1 text-xs sm:text-sm rounded-full font-medium transition-colors ${
              selectedCategory === 'to-review'
                ? 'bg-white text-black'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            🔄 To Review
          </button>
          {filteredProblems.map((category, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedCategory(idx);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1 text-xs sm:text-sm rounded-full font-medium transition-colors whitespace-nowrap ${
                selectedCategory === idx
                  ? 'bg-white text-black'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              {category.category}
            </button>
          ))}
        </div>
        )}

        {/* Card */}
        <div
          style={{ backgroundColor: 'var(--color-dark-card)', borderColor: 'var(--color-dark-border)' }}
          className="border rounded-lg p-6 sm:p-8 min-h-[80vh] flex flex-col"
        >
          {totalProblems === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400 text-lg">No problems found matching your criteria.</p>
            </div>
          ) : (
            <>
          {/* Category and Index */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-gray-400">
              {currentProblem.categoryName}
            </span>
            <span className="text-xs text-gray-500 font-mono">
              #{currentProblem.problemIndex + 1}
            </span>
          </div>

          {/* Problem Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            {currentProblem.name}
          </h1>

          {/* Difficulty Badge */}
          <div className="mb-6">
            <span
              className={`px-3 py-1 text-sm rounded border ${getDifficultyColor(
                currentProblem.difficulty
              )}`}
            >
              {currentProblem.difficulty}
            </span>
          </div>

          {/* Status Controls */}
          <div className="mb-6 pb-4 border-b border-gray-700">
            <p className="text-xs text-gray-400 mb-2">Status:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleStatusClick(problemStatus.TODO)}
                className={`px-3 py-1.5 text-xs rounded transition-colors ${
                  getProblemStatus(currentProblem.categoryName, currentProblem.name) === problemStatus.TODO
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                To Do
              </button>
              <button
                onClick={() => handleStatusClick(problemStatus.IN_PROGRESS)}
                className={`px-3 py-1.5 text-xs rounded transition-colors ${
                  getProblemStatus(currentProblem.categoryName, currentProblem.name) === problemStatus.IN_PROGRESS
                    ? 'bg-gray-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => handleStatusClick(problemStatus.COMPLETED)}
                className={`px-3 py-1.5 text-xs rounded transition-colors ${
                  getProblemStatus(currentProblem.categoryName, currentProblem.name) === problemStatus.COMPLETED
                    ? 'bg-gray-400 text-black'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                ✓ Completed
              </button>
              <button
                onClick={() => handleStatusClick(problemStatus.TO_REVIEW)}
                className={`px-3 py-1.5 text-xs rounded transition-colors ${
                  getProblemStatus(currentProblem.categoryName, currentProblem.name) === problemStatus.TO_REVIEW
                    ? 'bg-gray-300 text-black'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🔄 To Review
              </button>
            </div>
          </div>

          {/* Resources */}
          <div className="flex gap-2 sm:gap-3 mb-6">
            <a
              href={currentProblem.youtubeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center p-2 sm:px-4 sm:py-3 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white rounded-lg transition-all font-medium shadow-lg"
              title="YouTube Tutorial"
            >
              <svg
                className="w-5 sm:w-5 h-5 sm:h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span className="hidden sm:inline ml-2">YouTube</span>
            </a>
            <a
              href={currentProblem.leetcodeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center p-2 sm:px-4 sm:py-3 bg-gray-600 hover:bg-gray-500 active:bg-gray-400 text-white rounded-lg transition-all font-medium shadow-lg"
              title="LeetCode Problem"
            >
              <svg
                className="w-5 sm:w-5 h-5 sm:h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
              </svg>
              <span className="hidden sm:inline ml-2">LeetCode</span>
            </a>
          </div>

          {/* Solution */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <h4 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-400 flex-shrink-0"
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
            </div>
            <button
              onClick={() => copyCode(currentProblem.pythonSolution)}
              className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white rounded text-sm sm:text-base font-medium transition-colors flex items-center justify-center gap-2"
            >
              {copiedId === 'solution' ? (
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
            <div className="code-block rounded-lg overflow-x-auto">
              <pre className="language-python">
                <code className="language-python">
                  {currentProblem.pythonSolution}
                </code>
              </pre>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-700">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 active:bg-gray-500 text-white rounded-lg transition-colors text-sm sm:text-base font-medium"
            >
              ← Previous
            </button>
            <button
              onClick={goToNext}
              disabled={currentIndex === totalProblems - 1}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 active:bg-gray-500 text-white rounded-lg transition-colors text-sm sm:text-base font-medium"
            >
              Next →
            </button>
          </div>

          {/* Swipe Hint */}
          <div className="text-center mt-4 text-xs text-gray-500 md:hidden">
            Swipe left/right or use arrow keys to navigate
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardView;
