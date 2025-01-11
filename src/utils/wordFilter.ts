// Common bad words list (this is a basic example, you might want a more comprehensive list)
const badWords = [
  'admin',
  'moderator',
  'fuck',
  'shit',
  'ass',
  // Add more bad words as needed
]

// Words that shouldn't be used as usernames
const reservedUsernames = [
  'admin',
  'administrator',
  'mod',
  'moderator',
  'support',
  'help',
  'system',
  'official',
  'staff',
  'team',
  // Add more reserved words
]

export function containsBadWord(username: string): { isValid: boolean; reason?: string } {
  // Convert to lowercase for case-insensitive checking
  const lowercaseUsername = username.toLowerCase()

  // Check for reserved usernames
  if (reservedUsernames.some(word => lowercaseUsername === word)) {
    return {
      isValid: false,
      reason: 'This username is reserved'
    }
  }

  // Check for bad words
  const foundBadWord = badWords.find(word => 
    lowercaseUsername.includes(word.toLowerCase())
  )

  if (foundBadWord) {
    return {
      isValid: false,
      reason: 'Username contains inappropriate language'
    }
  }

  // Check for impersonation attempts (e.g., "admin_official")
  if (reservedUsernames.some(word => 
    lowercaseUsername.includes(word.toLowerCase()) &&
    (lowercaseUsername.includes('official') || 
     lowercaseUsername.includes('real') || 
     lowercaseUsername.includes('true'))
  )) {
    return {
      isValid: false,
      reason: 'Username appears to be impersonating staff'
    }
  }

  return { isValid: true }
} 