/**
 * Conditionally join class names together
 * @param {...string} classes - Class names to join
 * @returns {string} - Joined class names
 */
function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

export { cn }

