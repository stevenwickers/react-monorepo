import { Button } from '@/components/ui'

export interface WelcomeProps {
  title: string
  handleLogin: () => void
}

export const Welcome = ({ title, handleLogin }: WelcomeProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="max-w-md w-full space-y-6 sm:space-y-8 p-4 sm:p-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Welcome to {title}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8">
            Please sign in to access your account and continue
          </p>

          <div className="space-y-4">
            <Button onClick={handleLogin} variant="primary">
              Sign in with Microsoft
            </Button>

            <div>
              <div className="text-xs sm:text-sm text-gray-500">
                <p>Secure authentication powered by Microsoft Azure Entra</p>
              </div>
              <div className="text-xs text-gray-400">
                <p>© 2025 UniFirst Corporation. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
