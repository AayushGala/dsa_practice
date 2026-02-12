export const dsaProblems = [
  {
    category: "Strings [Basic and Medium]",
    problems: [
      {
        name: "Remove Outermost Parentheses",
        difficulty: "Easy",
        youtubeLink: "https://www.youtube.com/watch?v=du2hj4MCsqU",
        leetcodeLink: "https://leetcode.com/problems/remove-outermost-parentheses/",
        pythonSolution: `class Solution:
    def removeOuterParentheses(self, s: str) -> str:
        result = []
        depth = 0
        
        for char in s:
            if char == '(':
                if depth > 0:
                    result.append(char)
                depth += 1
            else:  # char == ')'
                depth -= 1
                if depth > 0:
                    result.append(char)
        
        return ''.join(result)`
      },
      {
        name: "Reverse Words in a String",
        difficulty: "Medium",
        youtubeLink: "https://www.youtube.com/watch?v=vhnRAaJybpA",
        leetcodeLink: "https://leetcode.com/problems/reverse-words-in-a-string/",
        pythonSolution: `class Solution:
    def reverseWords(self, s: str) -> str:
        # Split the string by spaces and filter out empty strings
        words = s.split()
        
        # Reverse the list of words
        words.reverse()
        
        # Join the words with a single space
        return ' '.join(words)`
      },
      {
        name: "Largest Odd Number in String",
        difficulty: "Easy",
        youtubeLink: "https://www.youtube.com/watch?v=FTnDG4x2lLU",
        leetcodeLink: "https://leetcode.com/problems/largest-odd-number-in-string/",
        pythonSolution: `class Solution:
    def largestOddNumber(self, num: str) -> str:
        # Traverse from right to left
        for i in range(len(num) - 1, -1, -1):
            # If current digit is odd, return substring from 0 to i+1
            if int(num[i]) % 2 == 1:
                return num[:i+1]
        
        # If no odd digit found, return empty string
        return ""`
      },
      {
        name: "Longest Common Prefix",
        difficulty: "Easy",
        youtubeLink: "https://www.youtube.com/watch?v=wtOQaovlvhY",
        leetcodeLink: "https://leetcode.com/problems/longest-common-prefix/",
        pythonSolution: `class Solution:
    def longestCommonPrefix(self, strs: List[str]) -> str:
        if not strs:
            return ""
        
        # Start with the first string as prefix
        prefix = strs[0]
        
        for string in strs[1:]:
            # Keep reducing prefix until it matches
            while not string.startswith(prefix):
                prefix = prefix[:-1]
                if not prefix:
                    return ""
        
        return prefix`
      },
      {
        name: "Isomorphic Strings",
        difficulty: "Easy",
        youtubeLink: "https://www.youtube.com/watch?v=7yF-U1hLEqQ",
        leetcodeLink: "https://leetcode.com/problems/isomorphic-strings/",
        pythonSolution: `class Solution:
    def isIsomorphic(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False
        
        map_s_to_t = {}
        map_t_to_s = {}
        
        for char_s, char_t in zip(s, t):
            if char_s in map_s_to_t:
                if map_s_to_t[char_s] != char_t:
                    return False
            else:
                map_s_to_t[char_s] = char_t
            
            if char_t in map_t_to_s:
                if map_t_to_s[char_t] != char_s:
                    return False
            else:
                map_t_to_s[char_t] = char_s
        
        return True`
      },
      {
        name: "Rotate String",
        difficulty: "Easy",
        youtubeLink: "https://www.youtube.com/watch?v=6Ld9eDbC-y4",
        leetcodeLink: "https://leetcode.com/problems/rotate-string/",
        pythonSolution: `class Solution:
    def rotateString(self, s: str, goal: str) -> bool:
        # If lengths are different, rotation is impossible
        if len(s) != len(goal):
            return False
        
        # Check if goal is a substring of s + s
        return goal in (s + s)`
      },
      {
        name: "Valid Anagram",
        difficulty: "Easy",
        youtubeLink: "https://www.youtube.com/watch?v=9UtInBqnCgA",
        leetcodeLink: "https://leetcode.com/problems/valid-anagram/",
        pythonSolution: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        # If lengths differ, cannot be anagram
        if len(s) != len(t):
            return False
        
        # Count frequency of each character
        from collections import Counter
        return Counter(s) == Counter(t)`
      },
      {
        name: "Sort Characters By Frequency",
        difficulty: "Medium",
        youtubeLink: "https://www.youtube.com/watch?v=rRFQgmFTDkI",
        leetcodeLink: "https://leetcode.com/problems/sort-characters-by-frequency/",
        pythonSolution: `class Solution:
    def frequencySort(self, s: str) -> str:
        from collections import Counter
        
        # Count frequency of each character
        freq = Counter(s)
        
        # Sort by frequency (descending) and build result
        result = []
        for char, count in freq.most_common():
            result.append(char * count)
        
        return ''.join(result)`
      }
    ]
  },
  {
    category: "Arrays",
    problems: [
      {
        name: "Largest Element in Array",
        difficulty: "Easy",
        youtubeLink: "https://www.youtube.com/watch?v=37E9ckMDdTk",
        leetcodeLink: "https://leetcode.com/problems/largest-number-at-least-twice-of-others/",
        pythonSolution: `class Solution:
    def findLargest(self, arr):
        if not arr:
            return None
        
        max_element = arr[0]
        
        for num in arr[1:]:
            if num > max_element:
                max_element = num
        
        return max_element`
      },
      {
        name: "Second Largest Element",
        difficulty: "Easy",
        youtubeLink: "https://www.youtube.com/watch?v=37E9ckMDdTk",
        leetcodeLink: "https://practice.geeksforgeeks.org/problems/second-largest",
        pythonSolution: `class Solution:
    def secondLargest(self, arr):
        if len(arr) < 2:
            return -1
        
        first = second = float('-inf')
        
        for num in arr:
            if num > first:
                second = first
                first = num
            elif num > second and num != first:
                second = num
        
        return second if second != float('-inf') else -1`
      },
      {
        name: "Check if Array is Sorted",
        difficulty: "Easy",
        youtubeLink: "https://www.youtube.com/watch?v=37E9ckMDdTk",
        leetcodeLink: "https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/",
        pythonSolution: `class Solution:
    def isSorted(self, arr):
        n = len(arr)
        
        for i in range(n - 1):
            if arr[i] > arr[i + 1]:
                return False
        
        return True`
      },
      {
        name: "Remove Duplicates from Sorted Array",
        difficulty: "Easy",
        youtubeLink: "https://www.youtube.com/watch?v=Fm_p9lJ4Z_8",
        leetcodeLink: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
        pythonSolution: `class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        if not nums:
            return 0
        
        # Two pointer approach
        i = 0
        
        for j in range(1, len(nums)):
            if nums[j] != nums[i]:
                i += 1
                nums[i] = nums[j]
        
        return i + 1`
      },
      {
        name: "Rotate Array",
        difficulty: "Medium",
        youtubeLink: "https://www.youtube.com/watch?v=BHr381Guz3Y",
        leetcodeLink: "https://leetcode.com/problems/rotate-array/",
        pythonSolution: `class Solution:
    def rotate(self, nums: List[int], k: int) -> None:
        n = len(nums)
        k = k % n  # Handle k > n
        
        # Reverse entire array
        nums.reverse()
        
        # Reverse first k elements
        nums[:k] = reversed(nums[:k])
        
        # Reverse remaining elements
        nums[k:] = reversed(nums[k:])`
      },
      {
        name: "Move Zeroes",
        difficulty: "Easy",
        youtubeLink: "https://www.youtube.com/watch?v=wvcQg43_V8U",
        leetcodeLink: "https://leetcode.com/problems/move-zeroes/",
        pythonSolution: `class Solution:
    def moveZeroes(self, nums: List[int]) -> None:
        # Two pointer approach
        left = 0
        
        # Move all non-zero elements to the front
        for right in range(len(nums)):
            if nums[right] != 0:
                nums[left], nums[right] = nums[right], nums[left]
                left += 1`
      },
      {
        name: "Linear Search",
        difficulty: "Easy",
        youtubeLink: "https://www.youtube.com/watch?v=246V51AWwl4",
        leetcodeLink: "https://practice.geeksforgeeks.org/problems/who-will-win",
        pythonSolution: `class Solution:
    def linearSearch(self, arr, target):
        for i in range(len(arr)):
            if arr[i] == target:
                return i
        
        return -1  # Element not found`
      },
      {
        name: "Union of Two Sorted Arrays",
        difficulty: "Easy",
        youtubeLink: "https://www.youtube.com/watch?v=wvcQg43_V8U",
        leetcodeLink: "https://practice.geeksforgeeks.org/problems/union-of-two-sorted-arrays",
        pythonSolution: `class Solution:
    def findUnion(self, arr1, arr2):
        i, j = 0, 0
        union = []
        
        while i < len(arr1) and j < len(arr2):
            if arr1[i] <= arr2[j]:
                if not union or union[-1] != arr1[i]:
                    union.append(arr1[i])
                i += 1
            else:
                if not union or union[-1] != arr2[j]:
                    union.append(arr2[j])
                j += 1
        
        while i < len(arr1):
            if not union or union[-1] != arr1[i]:
                union.append(arr1[i])
            i += 1
        
        while j < len(arr2):
            if not union or union[-1] != arr2[j]:
                union.append(arr2[j])
            j += 1
        
        return union`
      },
      {
        name: "Find Missing Number",
        difficulty: "Easy",
        youtubeLink: "https://www.youtube.com/watch?v=bYWLJb3vCWY",
        leetcodeLink: "https://leetcode.com/problems/missing-number/",
        pythonSolution: `class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        n = len(nums)
        
        # Sum of first n natural numbers
        expected_sum = n * (n + 1) // 2
        
        # Actual sum of array
        actual_sum = sum(nums)
        
        return expected_sum - actual_sum`
      },
      {
        name: "Maximum Consecutive Ones",
        difficulty: "Easy",
        youtubeLink: "https://www.youtube.com/watch?v=Mo33MjjMlyA",
        leetcodeLink: "https://leetcode.com/problems/max-consecutive-ones/",
        pythonSolution: `class Solution:
    def findMaxConsecutiveOnes(self, nums: List[int]) -> int:
        max_count = 0
        current_count = 0
        
        for num in nums:
            if num == 1:
                current_count += 1
                max_count = max(max_count, current_count)
            else:
                current_count = 0
        
        return max_count`
      },
      {
        name: "Single Number",
        difficulty: "Easy",
        youtubeLink: "https://www.youtube.com/watch?v=bYWLJb3vCWY",
        leetcodeLink: "https://leetcode.com/problems/single-number/",
        pythonSolution: `class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        # XOR of all elements
        # a ^ a = 0, a ^ 0 = a
        result = 0
        
        for num in nums:
            result ^= num
        
        return result`
      },
      {
        name: "Longest Subarray with Sum K",
        difficulty: "Medium",
        youtubeLink: "https://www.youtube.com/watch?v=frf7qxiN2qU",
        leetcodeLink: "https://practice.geeksforgeeks.org/problems/longest-sub-array-with-sum-k",
        pythonSolution: `class Solution:
    def longestSubarrayWithSumK(self, arr, k):
        prefix_sum_map = {}
        current_sum = 0
        max_length = 0
        
        for i in range(len(arr)):
            current_sum += arr[i]
            
            # If current_sum equals k
            if current_sum == k:
                max_length = i + 1
            
            # If current_sum - k exists in map
            if (current_sum - k) in prefix_sum_map:
                max_length = max(max_length, i - prefix_sum_map[current_sum - k])
            
            # Store first occurrence of this sum
            if current_sum not in prefix_sum_map:
                prefix_sum_map[current_sum] = i
        
        return max_length`
      },
      {
        name: "Two Sum",
        difficulty: "Easy",
        youtubeLink: "https://www.youtube.com/watch?v=UXDSeD9mN-k",
        leetcodeLink: "https://leetcode.com/problems/two-sum/",
        pythonSolution: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Hash map to store value and its index
        seen = {}
        
        for i, num in enumerate(nums):
            complement = target - num
            
            if complement in seen:
                return [seen[complement], i]
            
            seen[num] = i
        
        return []  # No solution found`
      },
      {
        name: "Sort Colors (Dutch National Flag)",
        difficulty: "Medium",
        youtubeLink: "https://www.youtube.com/watch?v=tp8JIuCXBaU",
        leetcodeLink: "https://leetcode.com/problems/sort-colors/",
        pythonSolution: `class Solution:
    def sortColors(self, nums: List[int]) -> None:
        # Three-way partitioning (Dutch National Flag Algorithm)
        low, mid, high = 0, 0, len(nums) - 1
        
        while mid <= high:
            if nums[mid] == 0:
                nums[low], nums[mid] = nums[mid], nums[low]
                low += 1
                mid += 1
            elif nums[mid] == 1:
                mid += 1
            else:  # nums[mid] == 2
                nums[mid], nums[high] = nums[high], nums[mid]
                high -= 1`
      },
      {
        name: "Majority Element (N/2)",
        difficulty: "Easy",
        youtubeLink: "https://www.youtube.com/watch?v=nP_ns3uSh80",
        leetcodeLink: "https://leetcode.com/problems/majority-element/",
        pythonSolution: `class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        # Boyer-Moore Voting Algorithm
        candidate = None
        count = 0
        
        for num in nums:
            if count == 0:
                candidate = num
            count += (1 if num == candidate else -1)
        
        return candidate`
      },
      {
        name: "Maximum Subarray (Kadane's Algorithm)",
        difficulty: "Medium",
        youtubeLink: "https://www.youtube.com/watch?v=w_KEoQvnC-Y",
        leetcodeLink: "https://leetcode.com/problems/maximum-subarray/",
        pythonSolution: `class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        # Kadane's Algorithm
        max_sum = nums[0]
        current_sum = nums[0]
        
        for i in range(1, len(nums)):
            current_sum = max(nums[i], current_sum + nums[i])
            max_sum = max(max_sum, current_sum)
        
        return max_sum`
      }
    ]
  }
];
