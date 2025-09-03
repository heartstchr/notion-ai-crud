// Utility functions for consistent component styling without PassThrough

export const inputClasses = {
  base: 'bg-gray-100 text-black border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
  invalid:
    'bg-gray-100 text-black border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500',
  fullWidth:
    'w-full bg-gray-100 text-black border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
  fullWidthInvalid:
    'w-full bg-gray-100 text-black border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500',
}

export const buttonClasses = {
  primary:
    'bg-blue-600 hover:bg-blue-700 text-white border-0 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  secondary:
    'bg-gray-200 hover:bg-gray-300 text-gray-700 border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
  danger:
    'bg-red-600 hover:bg-red-700 text-white border-0 focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
  success:
    'bg-green-600 hover:bg-green-700 text-white border-0 focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
  warning:
    'bg-amber-600 hover:bg-amber-700 text-white border-0 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2',
  info: 'bg-cyan-600 hover:bg-cyan-700 text-white border-0 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2',
}

export const panelClasses = {
  dropdown: 'bg-gray-100 border-gray-300',
  calendar: 'bg-gray-100 border-gray-300',
  multiselect: 'bg-gray-100 border-gray-300',
}

export const itemClasses = {
  dropdown: 'bg-white text-black hover:bg-gray-200',
  multiselect: 'px-3 py-2 bg-white text-black hover:bg-gray-200',
}

export const tokenClasses = {
  green: 'bg-green-100 text-green-800 border-green-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
  brown: 'bg-amber-100 text-amber-800 border-amber-200',
  orange: 'bg-orange-100 text-orange-800 border-orange-200',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  default: 'bg-gray-100 text-gray-800 border-gray-200',
  gray: 'bg-gray-100 text-gray-800 border-gray-200',
  pink: 'bg-pink-100 text-pink-800 border-pink-200',
  red: 'bg-red-100 text-red-800 border-red-200',
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
}

// Helper function to get input classes with validation
export function getInputClasses(isInvalid = false, fullWidth = false) {
  if (fullWidth) {
    return isInvalid ? inputClasses.fullWidthInvalid : inputClasses.fullWidth
  }
  return isInvalid ? inputClasses.invalid : inputClasses.base
}

// Helper function to get button classes
export function getButtonClasses(severity = 'primary') {
  return buttonClasses[severity] || buttonClasses.primary
}

// Helper function to get token classes
export function getTokenClasses(color) {
  return tokenClasses[color] || tokenClasses.default
}
