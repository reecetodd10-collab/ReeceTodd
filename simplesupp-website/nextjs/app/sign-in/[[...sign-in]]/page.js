import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to access your Aviera dashboard</p>
        </div>
        <SignIn 
          appearance={{
            baseTheme: 'light',
            elements: {
              rootBox: "mx-auto",
              card: "bg-white border border-gray-200 shadow-lg rounded-lg",
              headerTitle: "text-gray-900",
              headerSubtitle: "text-gray-600",
              socialButtonsBlockButton: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
              formButtonPrimary: "bg-[var(--acc)] hover:bg-blue-600 text-white",
              formFieldInput: "bg-white border-gray-300 text-gray-900 focus:border-[var(--acc)] focus:ring-[var(--acc)]",
              formFieldLabel: "text-gray-700",
              footerActionLink: "text-[var(--acc)] hover:text-blue-600",
              formFieldInputShowPasswordButton: "text-gray-500 hover:text-gray-700",
              identityPreviewText: "text-gray-900",
              identityPreviewEditButton: "text-[var(--acc)] hover:text-blue-600",
              formResendCodeLink: "text-[var(--acc)] hover:text-blue-600",
            },
            variables: {
              colorPrimary: '#3b82f6',
              colorBackground: '#ffffff',
              colorInputBackground: '#ffffff',
              colorInputText: '#111827',
              colorText: '#111827',
              colorTextSecondary: '#4b5563',
            },
          }}
        />
      </div>
    </div>
  );
}

