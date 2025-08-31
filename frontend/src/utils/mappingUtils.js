// ===== MAPPING UTILITIES =====
// Centralized mapping logic that can be imported by both services and components

// ===== ICON MAPPINGS =====

// Field name pattern to icon mappings
export const fieldNameIconMap = {
  // Personal/Identity fields
  name: 'pi pi-user',
  title: 'pi pi-user',
  fullName: 'pi pi-user',
  firstName: 'pi pi-user',
  lastName: 'pi pi-user',

  // Contact fields
  email: 'pi pi-envelope',
  phone: 'pi pi-phone',
  tel: 'pi pi-phone',
  mobile: 'pi pi-phone',
  contact: 'pi pi-phone',

  // Web/Link fields
  url: 'pi pi-link',
  link: 'pi pi-link',
  website: 'pi pi-link',
  portfolio: 'pi pi-link',
  linkedin: 'pi pi-link',
  github: 'pi pi-link',

  // Skills/Expertise fields
  skill: 'pi pi-star',
  skills: 'pi pi-star',
  expertise: 'pi pi-star',
  technology: 'pi pi-star',
  framework: 'pi pi-star',
  language: 'pi pi-star',

  // Time/Date fields
  date: 'pi pi-calendar',
  time: 'pi pi-calendar',
  duration: 'pi pi-calendar',
  period: 'pi pi-calendar',
  startDate: 'pi pi-calendar',
  endDate: 'pi pi-calendar',
  created: 'pi pi-calendar',
  updated: 'pi pi-calendar',

  // Organization fields
  company: 'pi pi-building',
  org: 'pi pi-building',
  organization: 'pi pi-building',
  employer: 'pi pi-building',
  client: 'pi pi-building',

  // Location fields
  location: 'pi pi-map-marker',
  city: 'pi pi-map-marker',
  country: 'pi pi-map-marker',
  address: 'pi pi-map-marker',
  region: 'pi pi-map-marker',

  // Financial fields
  salary: 'pi pi-dollar',
  pay: 'pi pi-dollar',
  amount: 'pi pi-dollar',
  cost: 'pi pi-dollar',
  price: 'pi pi-dollar',
  budget: 'pi pi-dollar',
  rate: 'pi pi-dollar',
  hourly: 'pi pi-dollar',

  // Status/Info fields
  status: 'pi pi-info-circle',
  state: 'pi pi-info-circle',
  condition: 'pi pi-info-circle',

  // Content fields
  note: 'pi pi-file-text',
  description: 'pi pi-file-text',
  summary: 'pi pi-file-text',
  bio: 'pi pi-file-text',
  about: 'pi pi-file-text',
  comment: 'pi pi-file-text',

  // Rating/Level fields
  rating: 'pi pi-star',
  score: 'pi pi-star',
  grade: 'pi pi-star',
  level: 'pi pi-star',
  experience: 'pi pi-star',
  seniority: 'pi pi-star',

  // Quantity/Count fields
  count: 'pi pi-hashtag',
  number: 'pi pi-hashtag',
  total: 'pi pi-hashtag',
  sum: 'pi pi-hashtag',
  quantity: 'pi pi-hashtag',

  // Person/People fields
  person: 'pi pi-user',
  people: 'pi pi-user',
  user: 'pi pi-user',
  team: 'pi pi-user',
  member: 'pi pi-user',
  employee: 'pi pi-user',
}

// Field type to icon mappings
export const fieldTypeIconMap = {
  email: 'pi pi-envelope',
  phone_number: 'pi pi-phone',
  url: 'pi pi-link',
  date: 'pi pi-calendar',
  number: 'pi pi-hashtag',
  checkbox: 'pi pi-check-square',
  select: 'pi pi-list',
  multi_select: 'pi pi-list',
  rich_text: 'pi pi-file-text',
  title: 'pi pi-user',
  status: 'pi pi-info-circle',
}

// ===== TYPE MAPPINGS =====

// Notion type to form input type mappings
export const notionTypeToFormTypeMap = {
  title: 'text',
  rich_text: 'textarea',
  email: 'email',
  phone_number: 'tel',
  url: 'url',
  number: 'number',
  select: 'select',
  multi_select: 'multiselect',
  checkbox: 'checkbox',
  date: 'date',
  status: 'select',
}

// ===== PLACEHOLDER MAPPINGS =====

// Field type to placeholder mappings
export const fieldTypePlaceholderMap = {
  email: 'Enter email address',
  phone_number: 'Enter phone number',
  url: 'Enter URL',
  number: 'Enter number',
  date: 'Select date',
  title: 'Enter title',
  rich_text: 'Enter description',
}

// ===== FIELD GROUPING PATTERNS =====

// Patterns for identifying field types for grouping
export const fieldGroupingPatterns = {
  contact: {
    patterns: ['email', 'phone', 'tel', 'mobile', 'contact'],
    icon: 'pi pi-address-book',
    color: 'text-blue-500',
  },
  numbers: {
    patterns: [
      'salary',
      'amount',
      'cost',
      'price',
      'budget',
      'rate',
      'hourly',
      'experience',
      'age',
      'rating',
      'score',
      'level',
      'count',
      'total',
      'sum',
      'quantity',
    ],
    icon: 'pi pi-calculator',
    color: 'text-orange-500',
  },
  time: {
    patterns: ['date', 'time', 'duration', 'period', 'start', 'end', 'created', 'updated'],
    icon: 'pi pi-calendar',
    color: 'text-indigo-500',
  },
  skills: {
    patterns: ['skill', 'expertise', 'technology', 'framework', 'language'],
    icon: 'pi pi-star',
    color: 'text-yellow-500',
  },
}

// ===== COLOR MAPPINGS =====

// Notion color to Tailwind CSS background color mappings for small indicators
export const notionColorToIndicatorMap = {
  default: 'bg-gray-400',
  gray: 'bg-gray-500',
  brown: 'bg-amber-500',
  orange: 'bg-orange-500',
  yellow: 'bg-yellow-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
  red: 'bg-red-500',
}

// Notion color to Tailwind CSS class mappings for option chips
export const notionColorToChipMap = {
  default: 'bg-gray-50 text-gray-700 border-gray-200',
  gray: 'bg-gray-100 text-gray-800 border-gray-300',
  brown: 'bg-amber-50 text-amber-800 border-amber-200',
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
  yellow: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  green: 'bg-green-50 text-green-700 border-green-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  pink: 'bg-pink-50 text-pink-700 border-pink-200',
  red: 'bg-red-50 text-red-700 border-red-200',
}

// ===== COMMON SKILLS DATA =====

// Common skills with predefined colors for dynamic options
export const commonSkillsWithColors = [
  { value: 'JavaScript', label: 'JavaScript', color: 'yellow' },
  { value: 'Python', label: 'Python', color: 'blue' },
  { value: 'React', label: 'React', color: 'blue' },
  { value: 'Node.js', label: 'Node.js', color: 'green' },
  { value: 'Java', label: 'Java', color: 'orange' },
  { value: 'SQL', label: 'SQL', color: 'purple' },
  { value: 'Git', label: 'Git', color: 'red' },
  { value: 'AWS', label: 'AWS', color: 'orange' },
  { value: 'Spring Boot', label: 'Spring Boot', color: 'green' },
  { value: 'Kubernetes', label: 'Kubernetes', color: 'blue' },
  { value: 'Docker', label: 'Docker', color: 'blue' },
  { value: 'TypeScript', label: 'TypeScript', color: 'blue' },
  { value: 'Vue.js', label: 'Vue.js', color: 'green' },
  { value: 'Angular', label: 'Angular', color: 'red' },
  { value: 'Express', label: 'Express', color: 'green' },
  { value: 'MongoDB', label: 'MongoDB', color: 'green' },
  { value: 'PostgreSQL', label: 'PostgreSQL', color: 'blue' },
  { value: 'Redis', label: 'Redis', color: 'red' },
  { value: 'GraphQL', label: 'GraphQL', color: 'pink' },
  { value: 'REST API', label: 'REST API', color: 'purple' },
  { value: 'Microservices', label: 'Microservices', color: 'blue' },
  { value: 'CI/CD', label: 'CI/CD', color: 'orange' },
  { value: 'DevOps', label: 'DevOps', color: 'green' },
  { value: 'Cloud Computing', label: 'Cloud Computing', color: 'blue' },
]

// ===== ICON SELECTION FUNCTIONS =====

// Get icon for field based on name pattern
export const getFieldIconByName = (fieldName) => {
  if (!fieldName) return 'pi pi-tag'

  const lowerFieldName = fieldName.toLowerCase()

  // Check exact matches first
  if (fieldNameIconMap[lowerFieldName]) {
    return fieldNameIconMap[lowerFieldName]
  }

  // Check pattern matches
  for (const [pattern, icon] of Object.entries(fieldNameIconMap)) {
    if (lowerFieldName.includes(pattern)) {
      return icon
    }
  }

  return 'pi pi-tag' // Default fallback
}

// Get icon for field based on type
export const getFieldIconByType = (type) => {
  return fieldTypeIconMap[type] || 'pi pi-tag'
}

// Get icon for field with fallback logic
export const getFieldIcon = (fieldName, type) => {
  // First try to get icon by name pattern
  const nameIcon = getFieldIconByName(fieldName)
  if (nameIcon !== 'pi pi-tag') {
    return nameIcon
  }

  // Fallback to type-based icon
  return getFieldIconByType(type)
}

// Get icon for number fields with contextual logic
export const getNumberFieldIcon = (fieldName, schemaProperty = null) => {
  if (!fieldName) return 'pi pi-calculator text-orange-500'

  // Check if we have schema information for currency format
  if (
    schemaProperty &&
    schemaProperty.type === 'number' &&
    schemaProperty.number &&
    schemaProperty.number.format
  ) {
    const format = schemaProperty.number.format

    // Return currency-specific icons
    switch (format) {
      case 'dollar':
        return 'pi pi-dollar text-green-500'
      case 'euro':
        return 'pi pi-euro text-blue-500'
      case 'pound':
        return 'pi pi-pound text-purple-500'
      case 'yen':
        return 'pi pi-yen text-red-500'
      case 'rupee':
        return 'pi pi-rupee text-orange-500'
      case 'yuan':
        return 'pi pi-yuan text-green-600'
      case 'percent':
        return 'pi pi-percentage text-indigo-500'
      default:
        break
    }
  }

  const lowerFieldName = fieldName.toLowerCase()

  // Financial fields
  if (
    lowerFieldName.includes('salary') ||
    lowerFieldName.includes('amount') ||
    lowerFieldName.includes('cost') ||
    lowerFieldName.includes('price') ||
    lowerFieldName.includes('budget') ||
    lowerFieldName.includes('rate') ||
    lowerFieldName.includes('hourly')
  ) {
    return 'pi pi-dollar text-green-500'
  }

  // Time/Experience fields
  if (
    lowerFieldName.includes('time') ||
    lowerFieldName.includes('duration') ||
    lowerFieldName.includes('period') ||
    lowerFieldName.includes('experience') ||
    lowerFieldName.includes('year')
  ) {
    return 'pi pi-calendar text-indigo-500'
  }

  // Person/People fields
  if (
    lowerFieldName.includes('person') ||
    lowerFieldName.includes('people') ||
    lowerFieldName.includes('user') ||
    lowerFieldName.includes('age')
  ) {
    return 'pi pi-user text-purple-500'
  }

  // Rating/Level fields
  if (
    lowerFieldName.includes('rate') ||
    lowerFieldName.includes('grade') ||
    lowerFieldName.includes('level') ||
    lowerFieldName.includes('rating') ||
    lowerFieldName.includes('score')
  ) {
    return 'pi pi-star text-yellow-500'
  }

  // Quantity/Count fields
  if (
    lowerFieldName.includes('total') ||
    lowerFieldName.includes('sum') ||
    lowerFieldName.includes('quantity') ||
    lowerFieldName.includes('count') ||
    lowerFieldName.includes('number')
  ) {
    return 'pi pi-hashtag text-blue-500'
  }

  // Default calculator icon
  return 'text-orange-500'
}

// ===== TYPE MAPPING FUNCTIONS =====

// Map Notion type to form input type
export const mapNotionTypeToFormType = (notionType) => {
  return notionTypeToFormTypeMap[notionType] || 'text'
}

// ===== PLACEHOLDER FUNCTIONS =====

// Generate placeholder text for field
export const generatePlaceholder = (fieldName, type) => {
  // Check if we have a specific placeholder for this type
  if (fieldTypePlaceholderMap[type]) {
    return fieldTypePlaceholderMap[type]
  }

  // Generate generic placeholder
  const label = formatFieldLabel(fieldName)
  return `Enter ${label.toLowerCase()}`
}

// ===== UTILITY FUNCTIONS =====

// Format field name to readable label
export const formatFieldLabel = (fieldName) => {
  if (!fieldName) return ''

  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

// ===== CURRENCY FORMATTING =====

// Currency format configurations
export const currencyFormats = {
  dollar: {
    locale: 'en-US',
    currency: 'USD',
    minDigits: 2,
    maxDigits: 2,
  },
  euro: {
    locale: 'de-DE',
    currency: 'EUR',
    minDigits: 2,
    maxDigits: 2,
  },
  pound: {
    locale: 'en-GB',
    currency: 'GBP',
    minDigits: 2,
    maxDigits: 2,
  },
  yen: {
    locale: 'ja-JP',
    currency: 'JPY',
    minDigits: 0,
    maxDigits: 0,
  },
  rupee: {
    locale: 'en-IN',
    currency: 'INR',
    minDigits: 2,
    maxDigits: 2,
  },
  yuan: {
    locale: 'zh-CN',
    currency: 'CNY',
    minDigits: 2,
    maxDigits: 2,
  },
  percent: {
    locale: 'en-US',
    style: 'percent',
    minDigits: 2,
    maxDigits: 2,
    transform: (value) => value / 100,
  },
}

// Format number based on Notion schema format
export const formatNumberBySchema = (number, schemaProperty) => {
  if (typeof number !== 'number' || !schemaProperty) {
    return number
  }

  // Check if it's a number field with format
  if (schemaProperty.type === 'number' && schemaProperty.number && schemaProperty.number.format) {
    const format = schemaProperty.number.format

    if (currencyFormats[format]) {
      const config = currencyFormats[format]

      if (format === 'percent') {
        return new Intl.NumberFormat(config.locale, {
          style: config.style,
          minimumFractionDigits: config.minDigits,
          maximumFractionDigits: config.maxDigits,
        }).format(config.transform(number))
      } else {
        return new Intl.NumberFormat(config.locale, {
          style: 'currency',
          currency: config.currency,
          minimumFractionDigits: config.minDigits,
          maximumFractionDigits: config.maxDigits,
        }).format(number)
      }
    }
  }

  // Default formatting
  return number.toLocaleString()
}

// Get currency symbol for a format
export const getCurrencySymbol = (format) => {
  if (!format || !currencyFormats[format]) return ''

  const config = currencyFormats[format]
  if (format === 'percent') return '%'

  // Create a sample number to extract the currency symbol
  const sample = new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(0)

  // Extract the currency symbol (everything before the 0)
  return sample.replace('0', '').trim()
}

// Check if field matches grouping pattern
export const matchesGroupingPattern = (fieldName, groupType) => {
  if (!fieldName || !fieldGroupingPatterns[groupType]) return false

  const lowerFieldName = fieldName.toLowerCase()
  const patterns = fieldGroupingPatterns[groupType].patterns

  return patterns.some((pattern) => lowerFieldName.includes(pattern))
}

// Get grouping info for field
export const getFieldGroupingInfo = (fieldName) => {
  for (const [groupType, config] of Object.entries(fieldGroupingPatterns)) {
    if (matchesGroupingPattern(fieldName, groupType)) {
      return {
        type: groupType,
        icon: config.icon,
        color: config.color,
      }
    }
  }
  return null
}

// ===== COLOR MAPPING FUNCTIONS =====

// Get color indicator class for small color dots
export const getColorIndicator = (color) => {
  return notionColorToIndicatorMap[color] || 'bg-blue-500'
}

// Get option chip classes based on color
export const getOptionClasses = (option, field, schema = null) => {
  // Safety check: ensure option is valid
  if (!option) {
    return 'bg-blue-50 text-blue-700 border-blue-200'
  }

  // First try to get options from the field
  let options = field.options || []

  // Check if field options are complete (have value and label properties)
  const hasCompleteOptions = options.length > 0 && options.every((opt) => opt.value && opt.label)

  // If no options in field OR options are incomplete, try to get from schema
  if (
    (!options.length || !hasCompleteOptions) &&
    schema &&
    schema.properties &&
    schema.properties[field.name]
  ) {
    const schemaProperty = schema.properties[field.name]
    if (schemaProperty.options && schemaProperty.options.length > 0) {
      options = schemaProperty.options
    }
  }

  if (!options.length) {
    return 'bg-blue-50 text-blue-700 border-blue-200'
  }

  // First check if the option itself has a color (from Notion data)
  if (option && option.color) {
    return notionColorToChipMap[option.color] || 'bg-blue-50 text-blue-700 border-blue-200'
  }

  // Find the matching option to get its color using enhanced logic
  const matchingOption = options.find((opt) => {
    // Extract the option value for comparison (handle both string and object cases)
    const optionValue =
      typeof option === 'string' ? option : option?.value || option?.label || option?.name || ''

    // Safety check: ensure optionValue is a string before calling toLowerCase
    if (typeof optionValue !== 'string') {
      return false
    }

    // Try exact matches first
    if (opt.value === optionValue || opt.label === optionValue) {
      return true
    }

    // Try case-insensitive matches
    if (
      opt.value?.toLowerCase() === optionValue?.toLowerCase() ||
      opt.label?.toLowerCase() === optionValue?.toLowerCase()
    ) {
      return true
    }

    // Try partial matches for skills
    if (field.name.toLowerCase().includes('skill')) {
      if (
        opt.value?.toLowerCase().includes(optionValue?.toLowerCase()) ||
        opt.label?.toLowerCase().includes(optionValue?.toLowerCase()) ||
        optionValue?.toLowerCase().includes(opt.value?.toLowerCase()) ||
        optionValue?.toLowerCase().includes(opt.label?.toLowerCase())
      ) {
        return true
      }
    }

    return false
  })

  if (matchingOption && matchingOption.color) {
    return notionColorToChipMap[matchingOption.color] || 'bg-blue-50 text-blue-700 border-blue-200'
  }

  // Default styling for options without specific colors
  return 'bg-blue-50 text-blue-700 border-blue-200'
}

// Get option color value for debugging or other purposes
export const getOptionColor = (option, field, schema = null) => {
  // Safety check: ensure option is valid
  if (!option) {
    return 'default'
  }

  // First try to get options from the field
  let options = field.options || []

  // Check if field options are complete (have value and label properties)
  const hasCompleteOptions = options.length > 0 && options.every((opt) => opt.value && opt.label)

  // If no options in field OR options are incomplete, try to get from schema
  if (
    (!options.length || !hasCompleteOptions) &&
    schema &&
    schema.properties &&
    schema.properties[field.name]
  ) {
    const schemaProperty = schema.properties[field.name]
    if (schemaProperty.options && schemaProperty.options.length > 0) {
      options = schemaProperty.options
    }
  }

  if (!options.length) {
    return 'default'
  }

  // Enhanced matching logic
  const matchingOption = options.find((opt) => {
    // Extract the option value for comparison (handle both string and object cases)
    const optionValue =
      typeof option === 'string' ? option : option?.value || option?.label || option?.name || ''

    // Safety check: ensure optionValue is a string before calling toLowerCase
    if (typeof optionValue !== 'string') {
      return false
    }

    // Try exact matches first
    if (opt.value === optionValue || opt.label === optionValue) {
      return true
    }

    // Try case-insensitive matches
    if (
      opt.value?.toLowerCase() === optionValue?.toLowerCase() ||
      opt.label?.toLowerCase() === optionValue?.toLowerCase()
    ) {
      return true
    }

    // Try partial matches for skills
    if (field.name.toLowerCase().includes('skill')) {
      if (
        opt.value?.toLowerCase().includes(optionValue?.toLowerCase()) ||
        opt.label?.toLowerCase().includes(optionValue?.toLowerCase()) ||
        optionValue?.toLowerCase().includes(opt.value?.toLowerCase()) ||
        optionValue?.toLowerCase().includes(opt.label?.toLowerCase())
      ) {
        return true
      }
    }

    return false
  })

  return matchingOption?.color || 'default'
}

// Get selected option chip classes for single-select fields
export const getSelectedOptionClasses = (selectedValue, field) => {
  if (!field.options || !field.options.length) {
    return 'bg-blue-50 text-blue-700 border-blue-200'
  }

  const selectedOption = field.options.find((opt) => opt.value === selectedValue)
  if (!selectedOption || !selectedOption.color) {
    return 'bg-blue-50 text-blue-700 border-blue-200'
  }

  return notionColorToChipMap[selectedOption.color] || 'bg-blue-50 text-blue-700 border-blue-200'
}

// Get selected option label
export const getSelectedOptionLabel = (selectedValue, field) => {
  if (!field.options || !field.options.length) {
    return selectedValue
  }

  const selectedOption = field.options.find((opt) => opt.value === selectedValue)
  return selectedOption ? selectedOption.label : selectedValue
}

// Get selected option color
export const getSelectedOptionColor = (selectedValue, field) => {
  if (!field.options || !field.options.length) {
    return 'default'
  }

  const selectedOption = field.options.find((opt) => opt.value === selectedValue)
  return selectedOption?.color || 'default'
}

// ===== OPTION PROCESSING FUNCTIONS =====

// Process select/multi-select values to extract options with colors
export const getSelectOptionsWithColors = (value) => {
  // Handle Notion select/multi_select objects
  if (value.type === 'select' && value.select) {
    return [
      {
        value: value.select.name,
        label: value.select.name,
        name: value.select.name,
        color: value.select.color,
      },
    ]
  } else if (value.type === 'multi_select' && value.multi_select) {
    return value.multi_select.map((item) => ({
      value: item.name,
      label: item.name,
      name: item.name,
      color: item.color,
    }))
  }

  // Handle array of strings (common for multi-select fields)
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
    return value.map((item) => ({ value: item, label: item, name: item }))
  }

  // Handle array of objects with name/value properties
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0].name) {
    return value.map((item) => ({
      value: item.value || item.name,
      label: item.label || item.name,
      name: item.name,
      color: item.color,
    }))
  }

  return []
}

// Get multiselect options with fallback to common skills
export const getMultiselectOptions = (field, currentValue = []) => {
  // If field has predefined options, use them
  if (field.options && field.options.length > 0) {
    // Check if the options have valid value/label properties
    const validOptions = field.options.filter(
      (opt) => opt.value && opt.label && opt.value !== 'Unknown',
    )
    if (validOptions.length > 0) {
      return validOptions
    }
  }

  // If no predefined options or they're invalid, create dynamic options from existing data
  if (currentValue && Array.isArray(currentValue) && currentValue.length > 0) {
    // Create options from existing values
    const dynamicOptions = currentValue.map((value) => ({
      value: value,
      label: value,
    }))

    // Add common skills with colors for skill fields
    if (field.name.toLowerCase().includes('skill')) {
      commonSkillsWithColors.forEach((skill) => {
        if (!dynamicOptions.find((opt) => opt.value === skill.value)) {
          dynamicOptions.push(skill)
        }
      })
    }

    return dynamicOptions
  }

  // Fallback to empty array
  return []
}

// Get schema options for a field
export const getSchemaOptions = (fieldName, schema) => {
  if (!schema || !schema.properties || !schema.properties[fieldName]) {
    return []
  }

  const schemaProperty = schema.properties[fieldName]
  return schemaProperty.options || []
}
