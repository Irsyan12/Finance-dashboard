/**
 * Helper function to get category name by ID from real Supabase data
 * @param {string|number} categoryId - The category ID to look up
 * @param {Array} categories - Array of categories from Supabase
 * @returns {string} - Category name or 'Unknown Category'
 */
export const getCategoryByIdFromRealData = (categoryId, categories) => {
  if (!categoryId || !categories || !Array.isArray(categories)) {
    return "Unknown Category";
  }

  const category = categories.find((cat) => cat.id === categoryId);
  return category ? category.name : "Unknown Category";
};


/**
 * Helper function to format date relative to today
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted relative date
 */
export const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
    } else {
        // Calculate the difference in days
        const diffTime = today.setHours(0,0,0,0) - date.setHours(0,0,0,0);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 1) {
            // Show date in format: MMM dd, yyyy
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
            });
        } else {
            return `${diffDays} days ago`;
        }
    }
};

/**
 * Helper function to validate UUID format
 * @param {string} uuid - UUID string to validate
 * @returns {boolean} - Whether the UUID is valid
 */
export const isValidUUID = (uuid) => {
  if (typeof uuid !== "string") return false;
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Helper function to safely parse numeric values
 * @param {string|number} value - Value to parse
 * @returns {number} - Parsed numeric value or 0
 */
export const parseNumericAmount = (value) => {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value !== "") {
    const parsed = parseFloat(value.replace(/[^\d.-]/g, ""));
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};
