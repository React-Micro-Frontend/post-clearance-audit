# Post Clearance Audit Micro-Frontend

This is a remote micro-frontend module that consumes shared components and Redux store from the host application (custom-main).

## Features

- 🔗 Module Federation integration
- 🎨 Shared Tailwind CSS components
- 🔄 Shared Redux state management
- ⚡ Fast development with Webpack Dev Server

## Development

```bash
npm install
npm start
```

Runs on http://localhost:5002

## Build

```bash
npm run build
```

## Integration

This module is consumed by the host application at `http://localhost:5000` and exposes:
- `./App` - Main application component

## Shared Dependencies

- React
- React-DOM
- Redux Toolkit (from host)
- React-Redux (from host)
- Tailwind CSS components (from host)
