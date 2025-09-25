# AI-Generated Wellness Recommendation Board

## Architecture & Code Structure

This React-based wellness application follows a clean, modular architecture with clear separation of concerns and proper state management.

### 🏗️ Core Architecture Components

#### 1. **Navigation Management - `App.tsx`**
- **Role**: Central navigation controller (equivalent to mobile NavigationHost)
- **Responsibilities**:
  - Manages app-wide navigation flow
  - Renders appropriate screens based on application state
  - Wraps the entire app with the AppProvider for global state access

```tsx
// Navigation Logic
const AppContent: React.FC = () => {
  const { profile, currentTip } = useApp();

  if (currentTip) {
    return <TipDetailScreen />; // Screen 3: Detailed tip view
  }

  if (profile) {
    return <TipsScreen />;      // Screen 2: Tips dashboard
  }

  return <ProfileScreen />;     // Screen 1: Profile setup
};
```

#### 2. **Separate Components/Screens for Each Step**

**📝 Screen 1: Profile Capture - `ProfileScreen.tsx`**
- Captures user demographics (age, gender)
- Multi-select goal selection interface
- Form validation and submission
- Transitions to tips generation

**🎯 Screen 2: Tips Dashboard - `TipsScreen.tsx`**
- Displays AI-generated wellness tips as scrollable cards
- Loading states during AI generation
- "Regenerate" functionality for fresh tips
- Error handling with user-friendly messages
- Navigation to detailed tip views

**📖 Screen 3: Tip Details - `TipDetailScreen.tsx`**
- Expanded tip information with step-by-step guidance
- Save/unsave functionality for favorite tips
- Back navigation to tips dashboard
- Enhanced detailed explanations via additional AI calls

**💾 Screen 4: Persistence Layer**
- Integrated within components and context
- LocalStorage for saved tips persistence
- Automatic state restoration on app reload

#### 3. **AI Service Layer - `aiService.ts`**
- **Role**: Handles all AI interactions (equivalent to AIClient.swift/AIRepository.kt)
- **Features**:
  - Pure Gemini API integration (no fallbacks)
  - Structured prompt engineering for consistent responses
  - JSON response parsing and validation
  - Error handling and user feedback
  - Two main AI operations:
    - `generateWellnessTips()`: Creates 5 personalized tips
    - `generateDetailedTip()`: Expands tips with detailed guidance

```typescript
class AIService {
  // Gemini 2.0 Flash API integration
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  
  // Structured prompts for consistent AI responses
  async generateWellnessTips(profile: UserProfile): Promise<WellnessTip[]>
  async generateDetailedTip(tip: WellnessTip): Promise<WellnessTip>
}
```

#### 4. **State Management - React Context (`AppContext.tsx`)**
- **Role**: Global state management (equivalent to SwiftUI ObservableObject/Jetpack ViewModel)
- **State Variables**:
  - `profile`: User demographic and goal data
  - `tips`: Current set of AI-generated wellness tips
  - `savedTips`: User's favorited tips (persisted locally)
  - `currentTip`: Currently selected tip for detailed view
- **Features**:
  - Automatic localStorage persistence for saved tips
  - Type-safe context with TypeScript interfaces
  - Custom hook (`useApp`) for easy component access

### 🗂️ File Structure

```
src/
├── App.tsx                 # Main navigation controller
├── AppContext.tsx          # Global state management (React Context)
├── aiService.ts           # Gemini API integration layer
├── types.ts               # TypeScript type definitions
├── index.tsx              # App entry point
├── index.css              # Global styling
└── components/
    ├── ProfileScreen.tsx   # Screen 1: User profile setup
    ├── TipsScreen.tsx      # Screen 2: AI-generated tips dashboard
    └── TipDetailScreen.tsx # Screen 3: Detailed tip view
```

### 📱 Screen Flow & Navigation

```
ProfileScreen (Screen 1)
    ↓ (User completes profile)
TipsScreen (Screen 2)
    ↓ (User taps tip card)
TipDetailScreen (Screen 3)
    ↓ (User can save/unsave)
LocalStorage Persistence (Screen 4)
```

### 🔄 State Flow

1. **Profile Creation**: `ProfileScreen` → `setProfile()` → Navigation to `TipsScreen`
2. **Tip Generation**: `TipsScreen` → `aiService.generateWellnessTips()` → `setTips()`
3. **Tip Selection**: `TipsScreen` → `setCurrentTip()` → Navigation to `TipDetailScreen`
4. **Tip Details**: `TipDetailScreen` → `aiService.generateDetailedTip()` → Enhanced content
5. **Persistence**: `TipDetailScreen` → `setSavedTips()` → localStorage

### 🛠️ Key Design Patterns

- **Component-Based Architecture**: Each screen is a reusable, self-contained component
- **Centralized State Management**: Single source of truth via React Context
- **Service Layer Pattern**: AI operations abstracted into dedicated service
- **Type Safety**: Full TypeScript implementation with defined interfaces
- **Separation of Concerns**: Clear boundaries between UI, state, and data layers
- **Error Boundary Handling**: Graceful error handling with user feedback

### 🔧 Configuration

**Environment Variables:**
```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

**Key Dependencies:**
- React 18.2.0 (UI framework)
- TypeScript 4.7.4 (Type safety)
- Lucide React (Icons)
- React Scripts 5.0.1 (Build system)

This architecture ensures maintainable, scalable code that follows React best practices while meeting all the specified requirements for the wellness recommendation board application.
