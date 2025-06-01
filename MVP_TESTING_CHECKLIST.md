# MVP Testing Checklist

## 🧪 Navigation Testing

### Desktop Sidebar Testing
- [ ] **Dashboard** → `/dashboard` - Should show main dashboard
- [ ] **Posts** → `/dashboard/posts` - Social media management
- [ ] **Social Accounts** → `/dashboard/social-accounts` - Account connections
- [ ] **AI Content Generator** → `/dashboard/ai-tools` - AI tools page  
- [ ] **Scheduler** → `/dashboard/calendar` - Calendar/scheduling
- [ ] **Points & Rewards** → `/dashboard/me/rewards` - Rewards system
- [ ] **Notifications** → `/dashboard/me` - Profile/notifications page
- [ ] **Referrals** → `/dashboard/me/affiliate` - Only visible for active affiliates

### Mobile Bottom Navigation Testing  
- [ ] **Dashboard** → `/dashboard` - Main dashboard
- [ ] **Posts** → `/dashboard/posts` - Social media posts
- [ ] **AI Tools** → `/dashboard/ai-tools` - AI content generator
- [ ] **Points** → `/dashboard/me/rewards` - Rewards page
- [ ] **Menu** → Opens sidebar overlay

### Route Protection Testing
#### Should Redirect to Dashboard:
- [ ] `/dashboard/company` → `/dashboard`
- [ ] `/dashboard/users` → `/dashboard`
- [ ] `/dashboard/clients` → `/dashboard`
- [ ] `/dashboard/projects` → `/dashboard`
- [ ] `/dashboard/tasks` → `/dashboard`
- [ ] `/dashboard/leads` → `/dashboard`
- [ ] `/dashboard/campaigns` → `/dashboard`
- [ ] `/dashboard/kanban` → `/dashboard`
- [ ] `/dashboard/ai-providers` → `/dashboard`
- [ ] `/dashboard/agent-management` → `/dashboard`
- [ ] `/dashboard/agent-settings` → `/dashboard`
- [ ] `/dashboard/assistant` → `/dashboard`
- [ ] `/dashboard/memory` → `/dashboard`

## 🎨 UI/UX Testing

### Responsive Design
- [ ] **Desktop** (1920x1080): Sidebar expands/collapses properly
- [ ] **Tablet** (768x1024): Sidebar auto-collapses, responsive layout
- [ ] **Mobile** (375x667): Sidebar becomes overlay, bottom nav visible
- [ ] **Mobile Landscape**: Proper spacing and navigation

### RTL/LTR Support
- [ ] **English (LTR)**: Sidebar left, proper icon alignment
- [ ] **Arabic (RTL)**: Sidebar right, mirrored layout, proper text direction

### Interactions
- [ ] **Sidebar Toggle**: Smooth expand/collapse animation
- [ ] **Mobile Overlay**: Backdrop click closes sidebar
- [ ] **Active States**: Proper highlighting of current page
- [ ] **Hover Effects**: Smooth transitions and visual feedback
- [ ] **Touch Targets**: Mobile buttons are properly sized (48px min)

### Accessibility
- [ ] **Keyboard Navigation**: Tab through all navigation items
- [ ] **Screen Reader**: Proper ARIA labels and descriptions
- [ ] **Focus Indicators**: Visible focus states
- [ ] **Contrast**: Text meets accessibility standards

## 🔧 Functional Testing

### Authentication Flow
- [ ] **Logged Out**: `/dashboard/*` redirects to `/auth/login`
- [ ] **Logged In**: `/auth/login` or `/auth/register` redirects to `/dashboard`
- [ ] **Session Persistence**: Navigation state maintained across page reloads

### Affiliate Features
- [ ] **Non-Affiliate User**: Referrals item hidden in navigation
- [ ] **Pending Affiliate**: Referrals item hidden
- [ ] **Active Affiliate**: Referrals item visible and functional

### Performance
- [ ] **Initial Load**: Sidebar renders without hydration errors
- [ ] **Navigation**: Smooth transitions between pages
- [ ] **Mobile**: No layout shifts on orientation change
- [ ] **Bundle Size**: No unnecessary imports or dead code

## 🚀 Testing Commands

```bash
# Start development server
npm run dev

# Run type checking
npm run type-check

# Build for production
npm run build

# Start production server
npm start
```

## 🐛 Common Issues to Watch For

1. **Hydration Errors**: Ensure server/client state matches
2. **Route Mismatches**: Verify all links point to existing pages
3. **Mobile Navigation**: Check overlay z-index and backdrop behavior
4. **RTL Layout**: Test sidebar positioning and text direction
5. **Active States**: Ensure proper route matching logic
6. **Performance**: Watch for unnecessary re-renders

## ✅ Success Criteria

- [ ] All MVP features accessible via navigation
- [ ] Non-MVP routes properly blocked/redirected
- [ ] Smooth, responsive navigation experience
- [ ] No console errors or warnings
- [ ] Accessibility standards met
- [ ] RTL/LTR support working correctly
- [ ] Mobile experience optimized
