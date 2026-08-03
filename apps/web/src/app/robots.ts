import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/organizer/dashboard/',
          '/(authenticated)/',
          '/my-tournaments',
          '/my-profile',
          '/chat',
          '/sign-in',
          '/sign-up',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://deathroit.ravindertech.me/sitemap.xml',
    host: 'https://deathroit.ravindertech.me',
  };
}
