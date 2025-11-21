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
- **Interactive Supervisor Dashboard**: Dynamic filtering system with agent and time filters that update all metrics, charts, and data visualizations in real-time
- **Document Preview System**: Interactive coaching documents with preview popup dialogs and download functionality

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
- **Dynamic Data Generation**: Filter-responsive data functions that generate different datasets based on time period (daily, weekly, monthly) and agent status filters
- **Structured Data Models**: Well-defined interfaces for contact reviews, challenge patterns, sentiment analysis, and coaching materials
- **Real-time Updates**: Designed to support live data updates through React state management
- **Computed Metrics**: Team performance metrics automatically recalculate based on active filters
- **Comprehensive Filtering System (All Tabs)**: 
  - `getFilteredAgents()`: Filters agents by dashboard-level agentFilter (all/at-risk/top) with pattern-specific override support
  - `getFilteredTeamMetrics()`: Calculates team metrics (agents coached, team improvement %, at-risk count, top performers, avg score, session completion rate) from filtered agent dataset
  - `getPerformanceTimelineData()`: Generates time-series data with appropriate granularity (daily/weekly/monthly) based on timeFilter state
  - `getFilteredDailySummary()`: Filters daily summary data and recalculates team performance metrics based on selected agents
  - `getFilteredPatterns()`: Filters challenging patterns by agent, intent, and channel selections
  - `getFilteredContactReviews()`: Filters contact reviews by selected agents
  - **Dashboard Tab**: All 4 summary cards and performance timeline chart respond to filters
  - **Daily Summary Tab**: Team performance metrics and individual agent insights filtered by agent selection
  - **Challenge Patterns Tab**: Pattern list filtered by agent, intent, and channel; shows affected agents
  - **Coaching Progress Tab**: Agent list filtered by status (all/at-risk/top/excellent)
  - **Weekly Reports Tab**: Team metrics and individual agent reports respond to filters
  - All summary cards, agent tables, and performance charts react to filter changes in real-time across all tabs

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