# React Login Component

A reusable React login component with Google OAuth support, built with TypeScript and Tailwind CSS.

## Features

- 🔐 Google OAuth integration
- 🎨 Customizable theming
- 📱 Responsive design
- 🔧 TypeScript support
- 🎯 Lightweight and dependency-minimal
- 🔄 Flexible layout customization

## Installation

### From Nexus Repository

```bash
npm install @your-org/react-login-component
```

### From NPM (if published there)

```bash
npm install @your-org/react-login-component
```

## Usage

### Basic Usage

```tsx
import React from 'react';
import { Login } from '@your-org/react-login-component';

function App() {
  const handleLoginSuccess = (user) => {
    console.log('User logged in:', user);
    // Handle successful login (e.g., redirect, update state)
  };

  return (
    <Login
      backendUrl="https://your-api.com"
      onSuccess={handleLoginSuccess}
    />
  );
}
```

### With Custom Theme

```tsx
import { Login } from '@your-org/react-login-component';

function App() {
  return (
    <Login
      backendUrl="https://your-api.com"
      onSuccess={(user) => console.log(user)}
      theme={{
        primaryColor: "#10B981",
        backgroundColor: "#F0FDF4",
        fontFamily: "Inter, sans-serif"
      }}
    />
  );
}
```

### With Custom Layout

```tsx
import { Login } from '@your-org/react-login-component';

function App() {
  const customLayout = (
    <div className="custom-login-container">
      <h1>My Custom Login</h1>
      {/* Your custom form elements */}
    </div>
  );

  return (
    <Login
      backendUrl="https://your-api.com"
      onSuccess={(user) => console.log(user)}
      customLayout={customLayout}
    />
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `backendUrl` | `string` | ✅ | The base URL of your authentication backend |
| `onSuccess` | `(user: User) => void` | ❌ | Callback function called after successful login |
| `theme` | `LoginTheme` | ❌ | Theme customization object |
| `customLayout` | `ReactNode` | ❌ | Custom layout to override the default form |
| `className` | `string` | ❌ | Additional CSS classes for the root container |

### LoginTheme Interface

```tsx
interface LoginTheme {
  primaryColor?: string;     // Primary button and accent color
  backgroundColor?: string;  // Background color
  fontFamily?: string;       // Font family for text
}
```

### User Interface

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
```

## Backend Requirements

Your backend should provide the following endpoints:

### 1. Provider Login Endpoint
- **URL**: `GET /auth/provider?provider=google`
- **Description**: Redirects to Google OAuth
- **Response**: Redirects to Google OAuth flow

### 2. Token Verification Endpoint
- **URL**: `POST /verifyToken`
- **Description**: Verifies the current session token
- **Response**: 
  ```json
  {
    "code": 1040,
    "result": {
      "id": "user-id",
      "email": "user@example.com",
      "username": "User Name",
      "profilePicture": "https://...",
      "provider": "google",
      // ... other user fields
    }
  }
  ```

### 3. Logout Endpoint
- **URL**: `POST /logout`
- **Description**: Logs out the current user
- **Response**: 
  ```json
  {
    "code": 1000
  }
  ```

## Development

To develop this package locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build the package
npm run build

# Lint code
npm run lint
```

## Publishing

### To Nexus Repository

1. Configure your `.npmrc` file:
```
registry=https://your-nexus-repo.com/repository/npm-group/
//your-nexus-repo.com/repository/npm-private/:_authToken=your-token
```

2. Build and publish:
```bash
npm run build
npm publish
```

### To NPM

```bash
npm run build
npm publish --access public
```

## Examples

### Integration with React Router

```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '@your-org/react-login-component';

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={
            user ? 
            <Navigate to="/dashboard" /> : 
            <Login 
              backendUrl="https://api.example.com"
              onSuccess={setUser}
            />
          } 
        />
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard /> : <Navigate to="/login" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}
```

### Integration with State Management

```tsx
import { useAuthStore } from './store/authStore';
import { Login } from '@your-org/react-login-component';

function LoginPage() {
  const { setUser } = useAuthStore();

  return (
    <Login
      backendUrl={process.env.REACT_APP_API_URL}
      onSuccess={(user) => {
        setUser(user);
        // Additional logic like redirecting
      }}
      theme={{
        primaryColor: "#6366F1",
        backgroundColor: "#F1F5F9"
      }}
    />
  );
}
```

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request