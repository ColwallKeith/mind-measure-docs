# Mind Measure Documentation

Official documentation for the Mind Measure platform - a comprehensive mental health monitoring and support system for educational institutions.

## Quick Start

Visit the live documentation: **[mindmeasuredocs.vercel.app](https://mindmeasuredocs.vercel.app)**

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Project Structure
```
mind-measure-docs/
├── pages/                 # Documentation pages (MDX)
├── public/               # Static assets
├── theme.config.tsx      # Nextra theme configuration
├── next.config.mjs       # Next.js configuration
└── package.json          # Dependencies and scripts
```

## Documentation Sections

- **[Overview](/)** - Platform introduction and quick start
- **[Architecture](/architecture)** - System design and technical overview
- **[Admin UI](/admin-ui)** - Administrative interface guide
- **[Deployment](/deployment)** - Production deployment guide
- **[Security](/medical-grade-security)** - Comprehensive security documentation

## Platform Links

- **Main Application**: [app.mindmeasure.co.uk](https://app.mindmeasure.co.uk)
- **Superuser Dashboard**: [app.mindmeasure.co.uk/superuser](https://app.mindmeasure.co.uk/superuser)
- **Documentation**: [mindmeasuredocs.vercel.app](https://mindmeasuredocs.vercel.app)

## Built With

- **[Next.js](https://nextjs.org/)** - React framework
- **[Nextra](https://nextra.site/)** - Documentation framework
- **[Vercel](https://vercel.com/)** - Deployment platform

## Contributing

To add or update documentation:

1. Edit or create MDX files in the `pages/` directory
2. Update `pages/_meta.json` for navigation
3. Test locally with `npm run dev`
4. Deploy automatically via Vercel

## License

© 2024 Mind Measure. All rights reserved.
