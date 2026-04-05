import type { Metadata } from 'next';
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from './site';

interface BuildMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
}

export function buildMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = '/',
}: BuildMetadataOptions = {}): Metadata {
  const resolvedTitle = title ? `${title} | ${SITE_NAME}` : SITE_TITLE;

  return {
    title: resolvedTitle,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: resolvedTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: '/images/arcium-atlas-share-card.svg',
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description,
      images: ['/images/arcium-atlas-share-card.svg'],
    },
  };
}
