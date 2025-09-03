# React Login Component

A reusable React login component with Google OAuth support, built with TypeScript, Tailwind CSS, and Zustand for internal state management.

## Features

- 🔐 Google OAuth authentication
- 🎨 Customizable theming
- 📱 Responsive design
- 🔧 TypeScript support
- 🏪 Internal Zustand state management (isolated from host app)
- 🎯 Flexible layout customization

## Installation

```bash
npm install @your-org/react-login-component
```

## Basic Usage

### Option 1: Using Environment Variables (Recommended)

Set up your environment variables in `.env`:
```env
VITE_API_BASE_URL=https://your-api.com/api
VITE_FRONTEND_URL=https://your-frontend.com
```

Then use the component without specifying `backendUrl`:
```tsx
import React from 'react';
import { Login } from '@your-org/react-login-component';
import '@your-org/react-login-component/styles';

function App() {
  const handleLoginSuccess = (user) => {
    console.log('User logged in:', user);
    // Handle successful login (e.g., redirect, update app state)
  };

  return (
    <div>
      <Login onSuccess={handleLoginSuccess} />
    </div>
  );
}
```

### Option 2: Passing Backend URL as Prop

```tsx
import React from 'react';
import { Login } from '@your-org/react-login-component';
import '@your-org/react-login-component/styles';

function App() {
  const handleLoginSuccess = (user) => {
    console.log('User logged in:', user);
    // Handle successful login (e.g., redirect, update app state)
  };

  return (
    <div>
      <Login
        backendUrl="https://your-api.com/api"
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `backendUrl` | `string` | ❌ | Your backend API base URL (defaults to `VITE_API_BASE_URL` env var) |
| `onSuccess` | `(user: User) => void` | ❌ | Callback fired when login succeeds |
| `theme` | `LoginTheme` | ❌ | Custom theme configuration |
| `customLayout` | `ReactNode` | ❌ | Override the default login form layout |
| `className` | `string` | ❌ | Additional CSS classes |

## Environment Variables

The component supports these environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Your backend API base URL | ✅ (if not passed as prop) |
| `VITE_FRONTEND_URL` | Your frontend URL (for redirects) | ❌ |

## Theme Customization

```tsx
import { Login } from '@your-org/react-login-component';

const customTheme = {
  primaryColor: '#10B981',      // Green primary color
  backgroundColor: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
  fontFamily: 'Inter, sans-serif'
};

<Login
  backendUrl="https://your-api.com/api"
  theme={customTheme}
  onSuccess={handleLoginSuccess}
/>
```

## Custom Layout

You can completely override the login form layout:

```tsx
import { Login } from '@your-org/react-login-component';

const customLayout = (
  <div className="text-center">
    <h2>My Custom Login</h2>
    <p>Please sign in to continue</p>
    {/* The Google login button will be handled internally */}
  </div>
);

<Login
  backendUrl="https://your-api.com/api"
  customLayout={customLayout}
  onSuccess={handleLoginSuccess}
/>
```

## TypeScript Types

```tsx
interface User {
  id: string;
  email: string;
  createdDate: string;
  keycloakId: string;
  isEmailVerified: boolean;
  username: string;
  profilePicture: string | null;
  provider: string;
}

interface LoginTheme {
  primaryColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
}

interface LoginProps {
  backendUrl: string;
  onSuccess?: (user: User) => void;
  theme?: LoginTheme;
  customLayout?: ReactNode;
  className?: string;
}
```

## Backend Requirements

Your backend should provide these endpoints:

- `GET /auth/provider?provider=google` - Initiates OAuth flow
- `POST /verifyToken` - Verifies authentication token
- `POST /logout` - Handles logout

Expected response format for `/verifyToken`:
```json
{
  "code": 1040,
  "result": {
    "id": "user-id",
    "email": "user@example.com",
    "username": "username",
    "profilePicture": "https://...",
    "provider": "google",
    "keycloakId": "keycloak-id",
    "isEmailVerified": true,
    "createdDate": "2024-01-01T00:00:00Z"
  }
}
```

## State Management

This component uses Zustand internally for state management. The store is completely isolated and will not interfere with your host application's state management, even if you're also using Zustand.

## Styling

The component uses Tailwind CSS classes internally. Make sure your host application has Tailwind CSS configured, or the styles may not render correctly.

You can also override styles by:
1. Using the `className` prop to add custom classes
2. Using the `theme` prop for color and font customization
3. Providing a `customLayout` for complete layout control

## Development

To work on this package locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build the package
npm run build
```

## Publishing

```bash
# Build the package
npm run build

# Publish to Nexus
npm publish --registry=https://your-nexus-registry.com
```

## License

MIT