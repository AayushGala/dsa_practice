# 📚 How to Add More DSA Problems

This guide will help you add new problems to your DSA Tracker.

## Quick Start

All problems are stored in **`src/data/problems.js`**. This file exports a single array called `dsaProblems`.

## Structure Overview

```javascript
export const dsaProblems = [
  {
    category: "Category Name",
    problems: [ /* array of problems */ ]
  },
  // More categories...
];
```

## Adding a New Problem to Existing Category

1. Open `src/data/problems.js`
2. Find the category you want to add to (e.g., "Strings" or "Arrays")
3. Add your problem to the `problems` array:

```javascript
{
  name: "Your Problem Name",
  difficulty: "Easy",  // Easy, Medium, or Hard
  youtubeLink: "https://www.youtube.com/watch?v=VIDEO_ID",
  leetcodeLink: "https://leetcode.com/problems/your-problem/",
  pythonSolution: `class Solution:
    def yourFunction(self, param):
        # Your solution here
        return result`
}
```

### Example: Adding "Valid Palindrome" to Strings

```javascript
{
  category: "Strings [Basic and Medium]",
  problems: [
    // ... existing problems ...
    {
      name: "Valid Palindrome",
      difficulty: "Easy",
      youtubeLink: "https://www.youtube.com/watch?v=jJXJ16kPFWg",
      leetcodeLink: "https://leetcode.com/problems/valid-palindrome/",
      pythonSolution: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        # Convert to lowercase and keep only alphanumeric
        cleaned = ''.join(c.lower() for c in s if c.isalnum())
        
        # Check if it reads the same forwards and backwards
        return cleaned == cleaned[::-1]`
    }
  ]
}
```

## Adding a New Category

To add a completely new category (e.g., "Linked Lists", "Trees", etc.):

```javascript
export const dsaProblems = [
  // ... existing categories ...
  {
    category: "Linked Lists",
    problems: [
      {
        name: "Reverse Linked List",
        difficulty: "Easy",
        youtubeLink: "https://www.youtube.com/watch?v=...",
        leetcodeLink: "https://leetcode.com/problems/reverse-linked-list/",
        pythonSolution: `class Solution:
    def reverseList(self, head):
        prev = None
        current = head
        
        while current:
            next_node = current.next
            current.next = prev
            prev = current
            current = next_node
        
        return prev`
      },
      // Add more problems here...
    ]
  }
];
```

## Python Solution Guidelines

### Multi-line Solutions

Use backticks (`) for multi-line Python code:

```javascript
pythonSolution: `class Solution:
    def twoSum(self, nums, target):
        seen = {}
        
        for i, num in enumerate(nums):
            complement = target - num
            
            if complement in seen:
                return [seen[complement], i]
            
            seen[num] = i
        
        return []`
```

### Important Tips

1. **Indentation**: Use spaces (4 spaces) for Python indentation
2. **Keep it clean**: Remove unnecessary blank lines
3. **Add comments**: Explain complex logic
4. **Test first**: Make sure your solution works on LeetCode before adding it

## Difficulty Levels

The app supports three difficulty levels with automatic color coding:

- **Easy**: Green badge
- **Medium**: Yellow badge  
- **Hard**: Red badge

## Finding Problem Links

### YouTube Links
1. Go to [takeuforward.org](https://takeuforward.org/dsa/strivers-a2z-sheet-learn-dsa-a-to-z)
2. Find the problem in Striver's sheet
3. Copy the YouTube link

Or search: "Problem Name Striver" on YouTube

### LeetCode Links
1. Go to [leetcode.com](https://leetcode.com)
2. Search for the problem
3. Copy the URL from the address bar

## Common Categories to Add

Here are popular DSA categories you might want to add:

1. **Binary Search**
2. **Linked Lists**
3. **Stacks and Queues**
4. **Trees (Binary Trees, BST)**
5. **Graphs (BFS, DFS)**
6. **Dynamic Programming**
7. **Greedy Algorithms**
8. **Backtracking**
9. **Heap / Priority Queue**
10. **Bit Manipulation**

## Example: Complete Category Addition

```javascript
{
  category: "Binary Search",
  problems: [
    {
      name: "Binary Search",
      difficulty: "Easy",
      youtubeLink: "https://www.youtube.com/watch?v=MHf6awe89xw",
      leetcodeLink: "https://leetcode.com/problems/binary-search/",
      pythonSolution: `class Solution:
    def search(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        
        while left <= right:
            mid = (left + right) // 2
            
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        
        return -1`
    },
    {
      name: "Search Insert Position",
      difficulty: "Easy",
      youtubeLink: "https://www.youtube.com/watch?v=K-RYzDZkzCI",
      leetcodeLink: "https://leetcode.com/problems/search-insert-position/",
      pythonSolution: `class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        
        while left <= right:
            mid = (left + right) // 2
            
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        
        return left`
    }
  ]
}
```

## After Adding Problems

1. **Save the file**: `src/data/problems.js`
2. **Check the browser**: Changes should appear automatically (Hot Module Replacement)
3. **Verify**: Click on the category and problem to ensure everything displays correctly
4. **Test links**: Click YouTube and LeetCode buttons to verify they work

## Syntax Highlighting

The app uses Prism.js for Python syntax highlighting. Your code will automatically be:
- Color-coded
- Properly formatted
- Displayed in a dark theme code block

## Need Help?

If you're having issues:
1. Check the browser console for errors (F12)
2. Verify your JavaScript syntax (missing commas, brackets, etc.)
3. Make sure all strings use backticks for multi-line content
4. Ensure proper JSON-like structure

## Pro Tips

### Organizing Problems
- Put easier problems first in each category
- Group related problems together
- Use descriptive category names

### Solution Quality
- Add time and space complexity as comments:
```python
# Time: O(n), Space: O(1)
def solution(self, arr):
    ...
```

### Keeping it Updated
- Regularly add problems as you solve them
- Update solutions if you find better approaches
- Consider adding alternative solutions as comments

---

**Happy problem solving! 🚀**
