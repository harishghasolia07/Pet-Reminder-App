# 🐾 Daily Reminders Pet Care App

A modern, responsive Progressive Web App (PWA) for managing pet care reminders with beautiful animations and intuitive user experience.

## 🌟 Features

### Core Functionality
- ✅ **CRUD Operations** - Create, read, update, and delete pet care reminders
- ✅ **Multiple Pets** - Manage reminders for multiple pets (Browny 🐕, Whiskers 🐱, Buddy 🐶)
- ✅ **Smart Categorization** - Organize reminders by General, Lifestyle, and Health categories
- ✅ **Time Slot Organization** - Automatic grouping by Morning, Afternoon, Evening, and Night
- ✅ **Frequency Options** - Support for Once, Daily, Weekly, and Monthly reminders
- ✅ **Completion Tracking** - Mark reminders as complete with visual feedback

### Advanced Features
- ✅ **Streak Tracking** - Monitor consecutive completion streaks with fire emoji badges
- ✅ **Calendar Integration** - Visual calendar strip with streak connections
- ✅ **Smart Filtering** - Filter by pet, category, and time slot
- ✅ **12-Hour Time Format** - User-friendly time input with AM/PM selection
- ✅ **Responsive Design** - Optimized for mobile, tablet, and desktop
- ✅ **Progressive Web App** - Installable, offline-capable, and app-like experience

### User Experience
- ✅ **Smooth Animations** - Framer Motion powered transitions and micro-interactions
- ✅ **Modern UI** - Clean, intuitive interface following modern design principles
- ✅ **Form Validation** - Real-time validation with helpful error messages
- ✅ **Expandable Cards** - Mobile-optimized card layout with expand functionality
- ✅ **Dark Theme Elements** - Consistent dark/light theme throughout the app

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for smooth transitions

### State Management & Forms
- **Zustand** - Lightweight state management with persistence
- **React Hook Form** - Performant form handling
- **Zod** - Schema validation

### PWA & Utilities
- **next-pwa** - Progressive Web App configuration
- **date-fns** - Date manipulation utilities
- **Heroicons** - Beautiful SVG icons
- **uuid** - Unique identifier generation

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+ or 20+
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd daily-reminders-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📱 PWA Features

### Installation
- **Desktop**: Click the install button in your browser's address bar
- **Mobile**: Use "Add to Home Screen" option in your browser menu

### Offline Support
- App works offline with cached data
- Service worker handles caching strategies
- Automatic updates when online

### App-like Experience
- Full-screen mode without browser UI
- Native app feel and performance
- Push notification ready (can be extended)

## 🎨 Design Features

### Responsive Layout
- **Mobile First** - Optimized for mobile devices
- **Tablet Friendly** - Adapted layout for medium screens
- **Desktop Enhanced** - Full feature set on large screens

### Animation System
- **Page Transitions** - Smooth navigation between states
- **Micro Interactions** - Hover, tap, and focus animations
- **Loading States** - Visual feedback during operations
- **Completion Animations** - Satisfying completion effects

### Color Scheme
- **Primary**: Emerald green (#10b981)
- **Secondary**: Gray scale for text and backgrounds
- **Accent**: Category-specific colors (red for health, blue for lifestyle)

## 📊 Data Structure

### Reminder Object
```typescript
interface Reminder {
  id: string;
  title: string;
  petId: string;
  petName: string;
  category: 'General' | 'Lifestyle' | 'Health';
  notes?: string;
  startDate: string;
  time: string; // 24-hour format (HH:mm)
  frequency: 'Once' | 'Daily' | 'Weekly' | 'Monthly';
  isCompleted: boolean;
  completedAt?: string;
  streak?: number;
  completedDates?: string[];
  createdAt: string;
  updatedAt: string;
}
```

### Pet Object
```typescript
interface Pet {
  id: string;
  name: string;
  avatar?: string; // Emoji representation
}
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for any environment-specific configurations:

```env
# Add any environment variables here
NEXT_PUBLIC_APP_NAME="Daily Reminders"
```

### PWA Configuration
The app is configured as a PWA in `next.config.js`:
- Offline support
- App manifest
- Service worker
- Caching strategies

## 📱 Mobile Features

### Touch Interactions
- **Swipe Gestures** - Natural mobile navigation
- **Tap Animations** - Visual feedback on touch
- **Long Press** - Context actions (future enhancement)

### Mobile-Specific UI
- **Collapsible Cards** - Expandable reminder details
- **Bottom Navigation** - Easy thumb navigation
- **Floating Action Button** - Quick access to add reminders

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Or deploy via GitHub**
   - Push code to GitHub
   - Connect repository to Vercel
   - Automatic deployments on push

### Other Platforms

#### Netlify
```bash
npm run build
# Upload 'out' folder to Netlify
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Add new reminder with all fields
- [ ] Edit existing reminder
- [ ] Delete reminder with confirmation
- [ ] Mark reminders as complete/incomplete
- [ ] Filter by pet and category
- [ ] Test on mobile, tablet, and desktop
- [ ] Test PWA installation
- [ ] Test offline functionality

### Browser Support
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🔮 Future Enhancements

### Planned Features
- [ ] Push notifications for reminders
- [ ] Photo attachments for reminders
- [ ] Reminder history and analytics
- [ ] Multiple user accounts
- [ ] Veterinarian contact integration
- [ ] Medication tracking with dosage
- [ ] Weather-based reminder adjustments

### Technical Improvements
- [ ] Unit and integration tests
- [ ] E2E testing with Playwright
- [ ] Performance monitoring
- [ ] Error tracking and reporting
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication

## 📄 License

This project is created for the ZOOCO Frontend Assignment.

## 🤝 Contributing

This is an assignment project. For any questions or suggestions, please contact the developer.

## 📞 Support

For technical issues or questions about the implementation, please refer to the code documentation or create an issue in the repository.

---

**Built with ❤️ for pet lovers everywhere** 🐾
