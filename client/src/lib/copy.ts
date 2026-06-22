export const commonCopy = {
  errors: {
    somethingWentWrong: "Something went wrong",
  },
  actions: {
    pleaseWait: "Please wait",
  },
} as const

export const authCopy = {
  signin: {
    title: "Sign in to your account",
    description: "Welcome back! Please sign in to continue.",
    button: "Sign in",
    footer: "Don't have an account?",
    footerAction: "Sign up",
  },
  signup: {
    title: "Create your account",
    description: "Please fill in the details to get started.",
    button: "Create account",
    footer: "Already have an account?",
    footerAction: "Sign in",
    verificationSent:
      "We have sent you a link to verify your email. Please check your inbox.",
  },
  validation: {
    emailRequired: "Email is required",
    emailInvalid: "Please enter a valid email address",
    passwordRequired: "Password is required",
    passwordMinLength: "Password must be at least 8 characters",
    passwordUppercase: "Password must contain at least 1 uppercase letter",
    nameRequired: "Name is required",
    passwordHint: "8 or more characters, including 1 uppercase letter",
  },
} as const

export const setupCopy = {
  intro: {
    title: "Set up your account",
    description: "Just a few quick steps to get you started.",
  },
  name: {
    label: "Name",
    placeholder: "Your display name",
  },
  avatar: {
    label: "Avatar",
    headline: "Upload a Profile Picture",
    description: "Choose a photo to upload as your profile picture.",
    cropTitle: "Crop avatar",
    cropDescription: "Drag the square to reposition it and use the handles to resize before saving.",
    save: "Save",
    cancel: "Cancel",
  },
  actions: {
    continue: "Continue",
    signIn: "Sign in",
    signOut: "Sign out",
  },
  messages: {
    cropFailed: "Could not crop image",
    completeSetupFailed: "Could not complete setup",
    verifyCompleteTitle: "Verify complete",
    verifyCompleteDescription:
      "Your email has been verified. Sign in to finish setting up your account.",
    verifyCompleteBody:
      "Email verification is done. The next step is to sign in and finish your profile.",
    verifyCompletePending: "This page is ready for the setup step after sign in.",
  },
} as const

export const homeCopy = {
  title: "Your Organizations",
  empty: {
    title: "No Organizations Yet",
    description: "Create your first organization to get started with managing your projects.",
    action: "Create Organization",
  },
  createDialog: {
    title: "Create Organization",
    description: "You can add members after creating the organization.",
    label: "Organization Name",
    placeholder: "Enter organization name",
    helper: "Your organization name should be unique and descriptive",
    cancel: "Cancel",
    submit: "Create",
  },
  createCard: {
    action: "Create Organization",
  },
  actions: {
    open: "Open",
  },
} as const

export const dashboardCopy = {
  page: {
    title: "Dashboard",
    description: "Overview of campaign metrics and performance.",
  },
  overview: {
    title: "Emails Sent",
    description: "Email delivery breakdown for the last quarter",
  },
  charts: {
    performance: {
      title: "Email Performance",
      description: "Performance and click rates for the last quarter",
      performanceLabel: "Performance",
      clickRateLabel: "Click Rate",
    },
    line: {
      trendLabel: "Up",
      trendSuffix: "from last quarter",
      periodLabel: "October - December 2024",
    },
  },
  metrics: {
    emailsSent: {
      subtitle: "Total emails delivered",
    },
    deliveryRate: {
      subtitle: "Successfully delivered",
    },
    subscribers: {
      subtitle: "Active email list size",
    },
    bounceRate: {
      subtitle: "Failed deliveries",
    },
  },
} as const
