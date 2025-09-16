# Dynamic React Template

A modern, fully customizable React template with dynamic theming, authentication, and a clean architecture.

## 🚀 Quick Start

### Option 1: Use the Setup Script (Recommended)

```bash
./setup-template.sh
```

The setup script will guide you through:
- Project name and description
- API configuration
- Color theme selection
- Automatic dependency installation

### Option 2: Manual Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` file with your project details:**
   ```env
   VITE_PROJECT_NAME=Your Project Name
   VITE_PROJECT_DESCRIPTION=Your project description
   # ... other configurations
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## 🎨 Dynamic Theming

This template supports complete theme customization through environment variables:

### Color Themes
- **Primary Colors**: Main brand colors (blues by default)
- **Secondary Colors**: Supporting colors (greens by default)  
- **Accent Colors**: Highlight colors (oranges by default)

### Pre-built Themes
1. **Blue & Green** (Default)
2. **Purple & Pink**
3. **Orange & Red**
4. **Custom** (define your own colors)

### Changing Colors
Edit your `.env` file:
```env
VITE_PRIMARY_500=#your-primary-color
VITE_SECONDARY_500=#your-secondary-color
VITE_ACCENT_500=#your-accent-color
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Layout components (Navbar, Footer)
│   └── UI/             # Basic UI components (Button, Input, etc.)
├── config/             # Configuration files
│   └── theme.ts        # Theme configuration
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API services
├── stores/             # State management (Zustand)
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🔧 Features

### ✅ Included
- **Dynamic Theming**: Change colors via environment variables
- **Authentication**: Login/Register with JWT
- **Google OAuth**: Login/Register with Google
- **Payment Integration**: Stripe and Razorpay checkout buttons
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Framer Motion animations
- **Type Safety**: Full TypeScript support
- **State Management**: Zustand for global state
- **Routing**: React Router v6
- **Toast Notifications**: Built-in notification system
- **Form Handling**: Controlled components with validation

### 🎯 Architecture
- **Clean Code**: Modular, maintainable structure
- **Separation of Concerns**: Clear separation between UI, logic, and data
- **Reusable Components**: DRY principle throughout
- **Environment-based Configuration**: Easy deployment across environments

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🛠️ Customization

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Update navigation if needed

### Modifying Theme
1. Edit `src/config/theme.ts` for default values
2. Use `.env` variables for runtime customization
3. Restart dev server after changes

### API Integration
1. Update `VITE_API_BASE_URL` in `.env`
2. Modify services in `src/services/`
3. Update types in `src/types/`

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_PROJECT_NAME` | Project display name | "Dynamic App" |
| `VITE_PROJECT_DESCRIPTION` | Project description | "A dynamic application template" |
| `VITE_API_BASE_URL` | Backend API URL | "http://localhost:8080" |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Required for Stripe payments |
| `VITE_RAZORPAY_KEY_ID` | Razorpay key ID | Required for Razorpay payments |
| `VITE_PRIMARY_500` | Primary brand color | "#0ea5e9" |
| `VITE_SECONDARY_500` | Secondary color | "#22c55e" |
| `VITE_ACCENT_500` | Accent color | "#f59e0b" |

## 💳 Payment Integration

This template includes ready-to-use payment buttons for both Stripe and Razorpay:

### Stripe Checkout Button
```tsx
import { StripeCheckoutButton } from './components/Payment';

<StripeCheckoutButton
  amount={2999} // Amount in cents
  currency="USD"
  receipt="receipt_123"
  notes={{ productId: 'prod_123' }}
  onSuccess={(result) => console.log('Success:', result)}
  onFailure={(error) => console.error('Error:', error)}
/>
```

### Razorpay Checkout Button
```tsx
import { RazorpayCheckoutButton } from './components/Payment';

<RazorpayCheckoutButton
  amount={2499} // Amount in rupees
  currency="INR"
  receipt="receipt_123"
  notes={{ productId: 'prod_123' }}
  onSuccess={(response) => console.log('Success:', response)}
  onFailure={(error) => console.error('Error:', error)}
/>
```

### Payment Flow
1. **Component** → **Store** → **Service** → **Backend**
2. Both buttons are fully customizable via CSS classes and props
3. No forms required - just click and pay
4. Automatic payment verification
5. Success/failure callbacks for custom handling

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏢 Built by Yensi Solutions

This template is created and maintained by **Yensi Solutions**.

---

**Happy coding! 🎉**