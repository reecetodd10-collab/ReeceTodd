export const metadata = {
  title: 'Learn | Supplement Guides and Training Tips | Aviera',
  description:
    "Read Aviera's guides on creatine, electrolytes, pre-workout, sleep supplements, and personalized stacks for athletes.",
  alternates: {
    canonical: '/learn',
  },
  openGraph: {
    title: 'Learn | Supplement Guides and Training Tips | Aviera',
    description:
      "Read Aviera's guides on creatine, electrolytes, pre-workout, sleep supplements, and personalized stacks for athletes.",
    url: 'https://www.avierafit.com/learn',
    siteName: 'Aviera Fit',
    type: 'website',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'Aviera Fit supplement guides',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learn | Supplement Guides and Training Tips | Aviera',
    description:
      "Read Aviera's guides on creatine, electrolytes, pre-workout, sleep supplements, and personalized stacks for athletes.",
    images: ['/icon.png'],
  },
};

export default function LearnLayout({ children }) {
  return <>{children}</>;
}
