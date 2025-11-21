# OmniHive AI Coaching Platform

## Overview

OmniHive AI Coaching is a comprehensive customer service training and coaching platform designed to help agents improve their performance through AI-driven insights and interactive training modules. The platform provides real-time feedback on customer interactions, identifies patterns in agent behavior, tracks sentiment trends, and offers personalized coaching experiences.

The application features a modern dashboard interface with multiple specialized views including contact reviews, challenge pattern analysis, sentiment tracking, and interactive coaching sessions with role-playing scenarios and assessments.

### Key Features
- **Agent Desktop**: Customer service workspace with embedded TrAIna AI Coach widget providing real-time performance feedback
- **TrAIna Widget**: Floating coaching assistant with authentication, showing yesterday's wins, areas to improve, example contacts, and daily focus areas
- **Multi-Window Dashboard**: "See Details" button opens full coaching dashboard in new browser tab for parallel workflow
- **Demo Routes**: `/demo-agent-desktop` for showcase, `/agent-dashboard` for standalone dashboard access
- **localStorage Persistence**: "Remember Me" functionality for TrAIna login state
- **Supervisor Dashboard Time Filtering**: Dynamic data views for Daily, Weekly, and Monthly performance tracking with automatic metric updates

## Recent Changes

- **Supervisor Dashboard Time Filtering** (November 21, 2025): Implemented dynamic data filtering for Daily, Weekly, and Monthly views with separate datasets, automatic label updates, and responsive chart displays
- **Interactive Coaching Documents** (November 19, 2025): Fixed Dialog component to properly display document previews with download functionality for all 12 training materials
- **TrAIna Widget Enhancement**: Updated "See Details" button to open agent dashboard in new browser tab for multi-window workflow
- **Sentiment Visualization**: Updated "Sentiment by Interaction Category" graph to use line charts matching "Sentiment Trends Over Time" style
- **Demo Route**: Created /demo-agent-desktop route for high-quality screenshots of Agent Desktop with TrAIna widget feedback

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 14 with App Router architecture using React Server Components
- **UI Framework**: Radix UI primitives with shadcn/ui component library for consistent design system
- **Styling**: Tailwind CSS with custom CSS variables for theming, supporting both light and dark modes
- **Typography**: Geist Sans and Geist Mono fonts for modern, readable interface
- **State Management**: React hooks (useState) for local component state management
- **Charts & Visualization**: Recharts library for data visualization including line charts, pie charts, and bar charts

### Component Structure
- **Modular Design**: Component-based architecture with separation of concerns
- **Reusable UI Components**: Centralized UI component library in `/components/ui/`
- **Feature Components**: Specialized dashboard components for different coaching modules
- **Theme Support**: Built-in dark/light theme switching capability

### Data Architecture
- **Mock Data**: Currently uses hardcoded sample data for demonstration purposes
- **Structured Data Models**: Well-defined interfaces for contact reviews, challenge patterns, sentiment analysis, and coaching materials
- **Real-time Updates**: Designed to support live data updates through React state management

### Navigation & UX
- **Tab-based Navigation**: Multi-view dashboard with seamless navigation between different coaching modules
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Interactive Elements**: Collapsible sections, progress indicators, and interactive coaching scenarios
- **Multi-Window Support**: TrAIna widget "See Details" button opens agent dashboard in new window for enhanced workflow flexibility

### Performance Optimizations
- **Bundle Optimization**: Class variance authority for efficient CSS-in-JS styling
- **Code Splitting**: Next.js automatic code splitting for optimal loading performance
- **Image Optimization**: Next.js built-in image optimization support

## External Dependencies

### Core Framework Dependencies
- **Next.js 14**: React framework with App Router for server-side rendering and routing
- **React**: Component library and state management
- **TypeScript**: Type safety and enhanced developer experience

### UI Component Libraries
- **Radix UI**: Headless UI components for accessibility and consistent behavior
- **shadcn/ui**: Pre-built component library based on Radix UI primitives
- **Lucide React**: Icon library for consistent iconography

### Styling & Design
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Modern Calm Tech Blue Theme**: Professional SaaS color palette with Primary Blue (#3B82F6), Secondary Blue (#60A5FA), Light Background (#e8f2fb), and Accent (#1E40AF)
- **OKLCH Color Space**: Advanced color system for consistent, perceptually uniform colors across light and dark modes
- **class-variance-authority**: Type-safe variant management for component styling
- **clsx**: Utility for constructing className strings conditionally

### Data Visualization
- **Recharts**: React charting library for sentiment trends and performance analytics

### Utility Libraries
- **date-fns**: Date manipulation and formatting utilities
- **cmdk**: Command palette component for enhanced user interactions

### Development Tools
- **ESLint**: Code quality and consistency enforcement
- **Autoprefixer**: CSS vendor prefix automation

### Deployment & Analytics
- **Vercel**: Hosting platform with automatic deployments
- **Vercel Analytics**: Performance and usage tracking

### Third-party Integrations
- **v0.app**: AI-powered development platform for automatic code synchronization
- **Geist Fonts**: Modern font family for enhanced typography