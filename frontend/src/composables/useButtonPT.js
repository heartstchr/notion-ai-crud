import { computed } from 'vue'

export function useButtonPT(severity = 'primary', size = 'small', isIconOnly = false) {
  const buttonPT = computed(() => ({
    root: {
      class: [
        getSizeClasses(size),
        getSeverityClasses(severity),
        'rounded-lg flex items-center justify-center',
        'transition-all duration-300 hover:scale-105 hover:-translate-y-0.5',
        'shadow-lg hover:shadow-xl',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        '!border-0', // Override any default borders
      ],
    },
    icon: {
      class: isIconOnly ? 'm-0' : 'mr-2',
    },
    label: {
      class: 'font-medium',
    },
  }))

  return { buttonPT }
}

function getSizeClasses(size) {
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    large: 'px-6 py-3 text-lg',
    default: 'px-4 py-2',
  }
  return sizes[size] || sizes.default
}

function getSeverityClasses(severity) {
  const classes = {
    primary:
      '!bg-blue-600 !hover:bg-blue-700 !text-white focus:ring-blue-500 hover:shadow-[0_20px_40px_rgba(37,99,235,0.3),0_0_20px_rgba(37,99,235,0.2)]',
    secondary:
      '!bg-gray-200 !hover:bg-gray-300 !text-gray-700 hover:text-gray-800 border border-gray-300 focus:ring-gray-500 hover:shadow-[0_20px_40px_rgba(107,114,128,0.3),0_0_20px_rgba(107,114,128,0.2)]',
    danger:
      '!bg-red-600 !hover:bg-red-700 !text-white focus:ring-red-500 hover:shadow-[0_20px_40px_rgba(239,68,68,0.3),0_0_20px_rgba(239,68,68,0.2)]',
    success:
      '!bg-green-600 !hover:bg-green-700 !text-white focus:ring-green-500 hover:shadow-[0_20px_40px_#22c55e4d,0_0_20px_#22c55e33]',
    warning:
      '!bg-amber-600 !hover:bg-amber-700 !text-white focus:ring-amber-500 hover:shadow-[0_20px_40px_rgba(217,119,6,0.3),0_0_20px_rgba(217,119,6,0.2)]',
    info: '!bg-cyan-600 !hover:bg-cyan-700 !text-white focus:ring-cyan-500 hover:shadow-[0_20px_40px_rgba(6,182,212,0.3),0_0_20px_rgba(6,182,212,0.2)]',
  }
  return classes[severity] || classes.primary
}
