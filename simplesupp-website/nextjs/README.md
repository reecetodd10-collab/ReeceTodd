# Aviera - Next.js Application

## Important: Running the Development Server

**Always run the dev server from the `nextjs` directory:**

```bash
cd nextjs
npm run dev
```

The application will be available at `http://localhost:3001`

## Project Structure

This Next.js application is located in the `nextjs` subdirectory. The parent directory contains a separate Vite project, which is why it's important to run commands from this directory.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Configuration

- `next.config.mjs` - Next.js configuration
- `.npmrc` - NPM configuration to prevent parent directory conflicts
- `jsconfig.json` - JavaScript/TypeScript path configuration

## Troubleshooting

If you see workspace root warnings:
- Make sure you're running commands from the `nextjs` directory
- The `.npmrc` file helps prevent detection of parent package files
- The `next.config.mjs` is configured to treat this directory as the project root
