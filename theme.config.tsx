import React from 'react';

export default {
  logo: <span style={{ fontWeight: 'bold' }}>Mind Measure Documentation</span>,
  project: { 
    link: 'https://github.com/mindmeasure/mind-measure-core' 
  },
  docsRepositoryBase: 'https://github.com/mindmeasure/mind-measure-docs/blob/main',
  footer: { 
    text: `© ${new Date().getFullYear()} Mind Measure. All rights reserved.`
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Mind Measure Docs'
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Mind Measure Documentation" />
      <meta property="og:description" content="Complete documentation for the Mind Measure platform" />
      <link rel="icon" href="/favicon.ico" />
      <style>{`
        /* Hide all folder icons */
        .nextra-sidebar-container nav svg {
          display: none !important;
        }
        /* Remove extra spacing left by hidden icons */
        .nextra-sidebar-container nav a,
        .nextra-sidebar-container nav button {
          padding-left: 0 !important;
        }
      `}</style>
    </>
  ),
  banner: {
    key: 'main-app-link',
    text: (
      <a href="https://app.mindmeasure.co.uk" target="_blank" rel="noopener noreferrer">
        Access the Mind Measure Platform →
      </a>
    )
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    titleComponent({ title, type }: { title: string; type: string }) {
      if (type === 'separator') {
        return <span className="cursor-default">{title}</span>
      }
      return <>{title}</>
    }
  }
};
