import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface SocialButtonsProps {
  onGoogleClick?: () => Promise<void> | void
  isLoading?: boolean // Let the parent component control the loading state
}

export function SocialButtons({ onGoogleClick, isLoading: parentLoading }: SocialButtonsProps) {
  const [internalLoading, setInternalLoading] = useState(false)
  const isButtonDisabled = parentLoading || internalLoading

  const handleGoogleLogin = async () => {
    if (onGoogleClick) {
      try {
        setInternalLoading(true)
        await onGoogleClick()
      } finally {
        setInternalLoading(false)
      }
      return
    }

    // Fallback Mock
    window.location.href = '/'
  }

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-3 font-medium transition-all text-neutral-900 bg-white hover:bg-neutral-50 border-neutral-200 dark:bg-neutral-900 dark:text-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800"
        type="button"
        onClick={handleGoogleLogin}
        disabled={isButtonDisabled}
      >
        {isButtonDisabled ? (
          // Spinner during active sign-in sessions
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          // Official Google G Brand SVG Icon
          <svg className="h-4 w-4" viewBox="0 0 24 24" width="100%" height="100%">
            <path
              fill="#EA4335"
              d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.33 0 3.357 2.673 1.386 6.577l3.88 3.188z"
            />
            <path
              fill="#34A853"
              d="M16.04 15.345c-1.077.736-2.423 1.164-4.04 1.164-2.955 0-5.464-1.99-6.355-4.664L1.722 15.02A11.934 11.934 0 0 0 12 24c3.105 0 5.968-1.036 8.164-2.836l-4.123-5.819z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.275c0-.627-.068-1.405-.205-2.018H12v4.514h6.49c-.146.99-.814 2.305-1.895 3.036l4.123 5.819c2.409-2.223 3.772-5.495 3.772-9.35z"
            />
            <path
              fill="#FBBC05"
              d="M5.645 12.318a6.882 6.882 0 0 1 0-2.553L1.764 6.577A11.932 11.932 0 0 0 0 12c0 1.923.455 3.736 1.255 5.355l4.39-3.037z"
            />
          </svg>
        )}
        <span>{isButtonDisabled ? 'Connecting...' : 'Continue with Google'}</span>
      </Button>
    </div>
  )
}