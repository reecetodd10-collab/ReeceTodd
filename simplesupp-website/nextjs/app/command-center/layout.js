export const metadata = {
  title: "Reece's Captain Seat",
  description: 'Your personal command center — email, calendar, tasks, and AI from anywhere.',
  robots: { index: false, follow: false },
  manifest: '/captain-manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: "Captain Seat",
  },
  icons: {
    icon: '/captain-wheel.svg',
    apple: '/captain-wheel.svg',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#09090b',
};

export default function CommandCenterLayout({ children }) {
  return children;
}
