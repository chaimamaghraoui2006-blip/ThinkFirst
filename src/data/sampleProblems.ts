export interface SampleProblem {
  id: string;
  title: string;
  difficulty: 'Introductory' | 'Intermediate' | 'Advanced';
  category: string;
  statement: string;
  defaultLanguage: 'python' | 'cpp' | 'javascript' | 'java';
  sampleBuggyCode?: string;
  sampleCleanCode?: string;
}

export const SAMPLE_PROBLEMS: SampleProblem[] = [
  {
    id: 'two-sum',
    title: 'Pair Target Sum',
    difficulty: 'Introductory',
    category: 'Arrays & Hashing',
    statement: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

Input Format:
- First line contains integer n, the number of elements.
- Second line contains n space-separated integers nums[i].
- Third line contains integer target.

Output Format:
- Two space-separated indices [i, j] (0-indexed).

Constraints:
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Exactly one valid answer exists.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0, 1]
Explanation: nums[0] + nums[1] == 2 + 7 == 9, so we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1, 2]`,
    defaultLanguage: 'python',
    sampleBuggyCode: `def twoSum(nums, target):
    # Loop over indices to find pair
    for i in range(len(nums)):
        for j in range(i, len(nums)): # Potential boundary issue: allows using the same element twice when j == i
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`,
    sampleCleanCode: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
  },
  {
    id: 'valid-parentheses',
    title: 'Bracket Sequence Balance',
    difficulty: 'Introductory',
    category: 'Stack & Strings',
    statement: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

Input Format:
- A single string s.

Output Format:
- Output boolean true if the bracket sequence is valid, false otherwise.

Constraints:
- 1 <= s.length <= 10^4
- s consists of parentheses only '()[]{}'.

Example 1:
Input: s = "()"
Output: true

Example 2:
Input: s = "()[]{}"
Output: true

Example 3:
Input: s = "(]"
Output: false`,
    defaultLanguage: 'python',
    sampleBuggyCode: `def isValid(s: str) -> bool:
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            # Pop element without checking if stack is empty
            top_element = stack.pop()
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
    return True`,
  },
  {
    id: 'max-subarray',
    title: 'Maximum Contiguous Subarray Sum',
    difficulty: 'Intermediate',
    category: 'Dynamic Programming',
    statement: `Given an integer array nums, find the subarray with the largest sum, and return its sum.

A subarray is a contiguous non-empty sequence of elements within an array.

Input Format:
- An array of integers nums.

Output Format:
- A single integer representing the maximum possible sum of a contiguous subarray.

Constraints:
- 1 <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4

Example 1:
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.

Example 2:
Input: nums = [1]
Output: 1

Example 3:
Input: nums = [5,4,-1,7,8]
Output: 23`,
    defaultLanguage: 'python',
    sampleBuggyCode: `def maxSubArray(nums):
    max_sum = 0 # Potential boundary issue: if all elements are negative, 0 is wrong
    current_sum = 0
    for x in nums:
        current_sum = max(x, current_sum + x)
        max_sum = max(max_sum, current_sum)
    return max_sum`,
  },
  {
    id: 'palindrome-number',
    title: 'Symmetric Integer Check',
    difficulty: 'Introductory',
    category: 'Math & Logic',
    statement: `Given an integer x, return true if x is a palindrome, and false otherwise.

An integer is a palindrome when it reads the same forward and backward. For example, 121 is a palindrome while 123 is not. Negative numbers are not palindromes because of the leading minus sign.

Input Format:
- An integer x.

Output Format:
- true or false.

Constraints:
- -2^31 <= x <= 2^31 - 1`,
    defaultLanguage: 'python',
  },
];
