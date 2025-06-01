# MVP Routes Configuration

## Included MVP Features (Keep Active)
- ✅ `/dashboard` - Main dashboard
- ✅ `/dashboard/posts` - Social Media Management
- ✅ `/dashboard/social-accounts` - Social account connections
- ✅ `/dashboard/ai-tools` - AI Content Generator
- ✅ `/dashboard/calendar` - Scheduler (using existing calendar)
- ✅ `/dashboard/me/rewards` - Points & Rewards system
- ✅ `/dashboard/me` - Notifications (main profile page)
- ✅ `/dashboard/me/affiliate` - Referrals (for active affiliates only)

## Routes to Hide/Remove (Non-MVP)
- ❌ `/dashboard/company` - Agency/Company management
- ❌ `/dashboard/users` - User management
- ❌ `/dashboard/clients` - Client management  
- ❌ `/dashboard/projects` - Project management
- ❌ `/dashboard/tasks` - Task management
- ❌ `/dashboard/leads` - Lead management
- ❌ `/dashboard/campaigns` - Marketing campaigns
- ❌ `/dashboard/kanban` - Kanban boards
- ❌ `/dashboard/ai-providers` - AI provider management
- ❌ `/dashboard/agent-management` - Agent management
- ❌ `/dashboard/agent-settings` - Agent settings
- ❌ `/dashboard/assistant` - Assistant features
- ❌ `/dashboard/memory` - Memory features

## Implementation Status

### ✅ Completed
1. **Sidebar Navigation**: Updated to show only MVP features
2. **Mobile Bottom Navigation**: Updated to match MVP routes
3. **Route Paths**: Corrected to match actual file structure
4. **Conditional Features**: Referrals only shown for active affiliates

### 🔄 Pending
1. **Route Protection**: Add middleware to redirect non-MVP routes
2. **Page Cleanup**: Remove or update non-MVP page components
3. **Translation Keys**: Update i18n keys to match MVP structure
4. **Testing**: Verify all MVP navigation works correctly

## Navigation Structure

### Desktop Sidebar (8 items max)
1. Dashboard
2. Posts
3. Social Accounts  
4. AI Content Generator
5. Scheduler
6. Points & Rewards
7. Notifications
8. Referrals (conditional)

### Mobile Bottom Navigation (5 items)
1. Dashboard
2. Posts
3. AI Tools
4. Points
5. Menu (opens sidebar)

## Technical Notes
- Uses existing `/dashboard/calendar` for scheduler functionality
- Points & Rewards route: `/dashboard/me/rewards`
- Notifications route: `/dashboard/me` (main profile page)
- Referrals route: `/dashboard/me/affiliate` (conditional)
- RTL/LTR support maintained
- Mobile responsiveness preserved
- Smooth animations and modern UI intact
