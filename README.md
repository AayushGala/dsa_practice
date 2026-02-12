# DSA Tracker Web App 🚀

A clean, modern, and responsive **DSA Tracker Web App** built with **React** and **Tailwind CSS**. This application replicates the functionality of [Striver's A2Z DSA Sheet](https://takeuforward.org/dsa/strivers-a2z-sheet-learn-dsa-a-to-z) with an elegant dark mode interface.

![DSA Tracker](https://img.shields.io/badge/React-18.x-blue) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8) ![Vite](https://img.shields.io/badge/Vite-8.x-646CFF)

## ✨ Features

- **📚 Organized Categories**: Problems organized into collapsible categories (Strings, Arrays, etc.)
- **🎯 Problem Details**: Each problem includes:
  - Problem name and difficulty level
  - YouTube tutorial link
  - LeetCode problem link
  - Syntax-highlighted Python solution
- **🌙 Dark Mode**: Beautiful dark theme with smooth transitions
- **📱 Responsive Design**: Works perfectly on all devices
- **⚡ Fast Performance**: Built with Vite for lightning-fast load times
- **🎨 Clean UI**: Modern interface with hover effects and intuitive navigation

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite 8** - Build tool and dev server
- **Tailwind CSS 3** - Utility-first CSS framework
- **Prism.js** - Syntax highlighting for code blocks

## 📦 Installation

1. **Clone the repository** (if using Git):
   ```bash
   git clone <your-repo-url>
   cd dsa_prep
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:5173
   ```

## 🏗️ Project Structure

```
dsa_prep/
├── src/
│   ├── data/
│   │   └── problems.js          # DSA problems data structure
│   ├── Dashboard.jsx            # Main component with accordion UI
│   ├── App.jsx                  # Root component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Tailwind CSS and custom styles
├── public/                      # Static assets
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
├── vite.config.js               # Vite configuration
└── package.json                 # Dependencies and scripts
```

## 📝 Data Structure

Problems are organized in `src/data/problems.js`:

```javascript
export const dsaProblems = [
  {
    category: "Strings [Basic and Medium]",
    problems: [
      {
        name: "Remove Outermost Parentheses",
        difficulty: "Easy",
        youtubeLink: "https://www.youtube.com/watch?v=...",
        leetcodeLink: "https://leetcode.com/problems/...",
        pythonSolution: `class Solution:
    def removeOuterParentheses(self, s: str) -> str:
        # Solution code here
        ...`
      },
      // More problems...
    ]
  },
  // More categories...
];
```

## 🎨 Customization

### Adding New Problems

Edit `src/data/problems.js` and add new problems to existing categories or create new categories:

```javascript
{
  name: "Your Problem Name",
  difficulty: "Easy", // Easy, Medium, or Hard
  youtubeLink: "https://youtube.com/...",
  leetcodeLink: "https://leetcode.com/...",
  pythonSolution: `# Your Python solution here`
}
```

### Customizing Colors

Edit `tailwind.config.js` to change the dark theme colors:

```javascript
theme: {
  extend: {
    colors: {
      dark: {
        bg: '#0a0a0a',      // Background
        card: '#1a1a1a',    // Card background
        border: '#2a2a2a',  // Borders
        hover: '#252525',   // Hover state
      },
    },
  },
}
```

## 🚀 Deployment

### Deploy to Vercel

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite configuration
   - Click "Deploy"

### Deploy to Netlify

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy on Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder
   - Or connect your GitHub repository for continuous deployment

### Manual Deployment

```bash
# Build for production
npm run build

# The dist/ folder will contain your production-ready files
# Upload the contents of dist/ to any static hosting service
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🎯 Current Categories

1. **Strings [Basic and Medium]** - 8 problems
   - Remove Outermost Parentheses
   - Reverse Words in a String
   - Largest Odd Number in String
   - Longest Common Prefix
   - Isomorphic Strings
   - Rotate String
   - Valid Anagram
   - Sort Characters By Frequency

2. **Arrays** - 16 problems
   - Largest Element in Array
   - Second Largest Element
   - Check if Array is Sorted
   - Remove Duplicates from Sorted Array
   - Rotate Array
   - Move Zeroes
   - Linear Search
   - Union of Two Sorted Arrays
   - Find Missing Number
   - Maximum Consecutive Ones
   - Single Number
   - Longest Subarray with Sum K
   - Two Sum
   - Sort Colors (Dutch National Flag)
   - Majority Element (N/2)
   - Maximum Subarray (Kadane's Algorithm)

## 🤝 Contributing

Feel free to add more problems, categories, or improve the UI! To contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Commit: `git commit -m 'Add some feature'`
5. Push: `git push origin feature/your-feature`
6. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by [Striver's A2Z DSA Sheet](https://takeuforward.org/dsa/strivers-a2z-sheet-learn-dsa-a-to-z)
- Built with ❤️ using React and Tailwind CSS

## 📧 Contact

If you have any questions or suggestions, feel free to reach out!

---

**Happy Coding! 🎉**
