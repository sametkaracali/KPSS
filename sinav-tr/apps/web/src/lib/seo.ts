import { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  noindex?: boolean;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const defaultSEO = {
  title: 'Sınav TR - YKS ve KPSS Hazırlık Platformu',
  description: 'Türkiye\'nin en kapsamlı YKS (TYT-AYT) ve KPSS sınav hazırlık platformu. Binlerce soru, video çözüm, kişiselleştirilmiş öğrenme ve AI destekli analiz ile başarıya ulaşın.',
  keywords: [
    'YKS', 'TYT', 'AYT', 'KPSS', 'sınav', 'hazırlık', 'online eğitim',
    'üniversite sınavı', 'test çöz', 'deneme sınavı', 'konu anlatımı',
    'video ders', 'matematik', 'fizik', 'kimya', 'biyoloji', 'türkçe',
    'tarih', 'coğrafya', 'geometri', 'edebiyat', 'felsefe',
  ],
  ogImage: '/og-image.jpg',
  ogType: 'website',
  siteUrl: 'https://sinav-tr.com',
};

export function generateMetadata(props: SEOProps = {}): Metadata {
  const {
    title = defaultSEO.title,
    description = defaultSEO.description,
    keywords = defaultSEO.keywords,
    ogImage = defaultSEO.ogImage,
    ogType = defaultSEO.ogType,
    canonical,
    noindex = false,
    author,
    publishedTime,
    modifiedTime,
  } = props;

  const fullTitle = title === defaultSEO.title ? title : `${title} | Sınav TR`;
  const imageUrl = ogImage.startsWith('http') ? ogImage : `${defaultSEO.siteUrl}${ogImage}`;
  const canonicalUrl = canonical || defaultSEO.siteUrl;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: author ? [{ name: author }] : [{ name: 'Sınav TR' }],
    creator: 'Sınav TR',
    publisher: 'Sınav TR',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(defaultSEO.siteUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: 'Sınav TR',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'tr_TR',
      type: ogType as any,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: '@sinavtr',
      site: '@sinavtr',
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    },
    category: 'education',
  };
}

// Structured data for different page types
export function generateStructuredData(type: string, data: any) {
  const baseOrganization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Sınav TR',
    url: defaultSEO.siteUrl,
    logo: `${defaultSEO.siteUrl}/logo.png`,
    sameAs: [
      'https://twitter.com/sinavtr',
      'https://facebook.com/sinavtr',
      'https://instagram.com/sinavtr',
      'https://youtube.com/sinavtr',
    ],
  };

  switch (type) {
    case 'home':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Sınav TR',
        url: defaultSEO.siteUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${defaultSEO.siteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
        publisher: baseOrganization,
      };

    case 'course':
      return {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: data.name,
        description: data.description,
        provider: baseOrganization,
        educationalLevel: data.level || 'Lise',
        teaches: data.subject,
        inLanguage: 'tr-TR',
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          duration: data.duration,
        },
        offers: {
          '@type': 'Offer',
          price: data.price || '0',
          priceCurrency: 'TRY',
          availability: 'https://schema.org/InStock',
        },
      };

    case 'question':
      return {
        '@context': 'https://schema.org',
        '@type': 'Quiz',
        name: data.title,
        description: data.description,
        educationalLevel: data.level,
        learningResourceType: 'Quiz',
        interactivityType: 'active',
        educationalUse: 'assignment',
        timeRequired: data.duration,
        hasPart: data.questions?.map((q: any) => ({
          '@type': 'Question',
          text: q.text,
          acceptedAnswer: {
            '@type': 'Answer',
            text: q.correctAnswer,
          },
        })),
      };

    case 'faq':
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: data.questions?.map((item: any) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      };

    case 'breadcrumb':
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: data.items?.map((item: any, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${defaultSEO.siteUrl}${item.url}`,
        })),
      };

    default:
      return baseOrganization;
  }
}

// Generate sitemap entries
export function generateSitemapEntry(url: string, options: {
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
} = {}) {
  return {
    url: `${defaultSEO.siteUrl}${url}`,
    lastmod: options.lastmod || new Date().toISOString(),
    changefreq: options.changefreq || 'weekly',
    priority: options.priority || 0.5,
  };
}

// Meta tags for specific exam types
export const examMetaTags = {
  'yks-tyt': {
    title: 'YKS TYT Hazırlık - Temel Yeterlilik Testi',
    description: 'YKS TYT sınavına hazırlık için binlerce soru, deneme sınavı ve konu anlatımı. Matematik, Türkçe, Sosyal Bilimler ve Fen Bilimleri testleri.',
    keywords: ['YKS TYT', 'TYT hazırlık', 'TYT matematik', 'TYT türkçe', 'TYT fen', 'TYT sosyal'],
  },
  'yks-ayt': {
    title: 'YKS AYT Hazırlık - Alan Yeterlilik Testi',
    description: 'YKS AYT sınavına hazırlık için sayısal, sözel ve eşit ağırlık alanlarında uzmanlaşmış içerikler. Detaylı konu anlatımları ve soru çözümleri.',
    keywords: ['YKS AYT', 'AYT hazırlık', 'AYT matematik', 'AYT fizik', 'AYT kimya', 'AYT biyoloji'],
  },
  'kpss': {
    title: 'KPSS Hazırlık - Kamu Personeli Seçme Sınavı',
    description: 'KPSS sınavına hazırlık için güncel müfredata uygun sorular, deneme sınavları ve video çözümler. Genel yetenek, genel kültür ve alan bilgisi testleri.',
    keywords: ['KPSS', 'KPSS hazırlık', 'KPSS genel yetenek', 'KPSS genel kültür', 'KPSS matematik', 'KPSS tarih'],
  },
};

// Subject-specific meta tags
export const subjectMetaTags = {
  matematik: {
    title: 'Matematik Konu Anlatımı ve Soru Çözümleri',
    description: 'Matematik dersi için detaylı konu anlatımları, binlerce çözümlü soru ve video dersler. YKS ve KPSS matematik hazırlık.',
    keywords: ['matematik', 'matematik konu anlatımı', 'matematik soru çözümü', 'YKS matematik', 'geometri'],
  },
  fizik: {
    title: 'Fizik Konu Anlatımı ve Soru Çözümleri',
    description: 'Fizik dersi için kapsamlı konu anlatımları, problem çözümleri ve deneyler. YKS AYT fizik hazırlık.',
    keywords: ['fizik', 'fizik konu anlatımı', 'fizik soru çözümü', 'YKS fizik', 'mekanik', 'elektrik'],
  },
  kimya: {
    title: 'Kimya Konu Anlatımı ve Soru Çözümleri',
    description: 'Kimya dersi için detaylı konu anlatımları, formüller ve soru çözümleri. YKS AYT kimya hazırlık.',
    keywords: ['kimya', 'kimya konu anlatımı', 'kimya soru çözümü', 'YKS kimya', 'organik kimya'],
  },
  biyoloji: {
    title: 'Biyoloji Konu Anlatımı ve Soru Çözümleri',
    description: 'Biyoloji dersi için görsel destekli konu anlatımları ve soru çözümleri. YKS AYT biyoloji hazırlık.',
    keywords: ['biyoloji', 'biyoloji konu anlatımı', 'biyoloji soru çözümü', 'YKS biyoloji', 'hücre', 'genetik'],
  },
  turkce: {
    title: 'Türkçe Konu Anlatımı ve Soru Çözümleri',
    description: 'Türkçe dersi için dil bilgisi, paragraf ve sözel mantık soruları. YKS TYT Türkçe hazırlık.',
    keywords: ['türkçe', 'türkçe konu anlatımı', 'paragraf soruları', 'YKS türkçe', 'dil bilgisi'],
  },
};
