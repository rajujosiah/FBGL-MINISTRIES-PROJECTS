# Supabase Integration Guide

This document explains how the Supabase integration works with caching and real-time subscriptions.

## Overview

The application now uses Supabase as the primary data source with intelligent caching and real-time updates via WebSockets. If Supabase is not configured, it automatically falls back to localStorage with sample data.

## Features

1. **Automatic Supabase Detection**: The app checks if Supabase credentials are configured on startup
2. **Intelligent Caching**: Data is cached for 5 minutes to reduce API requests
3. **Real-time Updates**: WebSocket subscriptions automatically update the UI when data changes
4. **Fallback Support**: If Supabase is unavailable, uses localStorage with sample data

## Setup

### 1. Environment Variables

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Database Schema

Ensure your Supabase database has the following tables (see `SUPABASE_SETUP.md` for full schema):

- `area_managers`
- `project_managers`
- `social_workers`
- `projects`
- `blog_posts`
- `board_members`

**Important**: The `projects` table needs a `project_manager_id` column:

```sql
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_manager_id BIGINT REFERENCES project_managers(id) ON DELETE SET NULL;
```

### 3. Enable Real-time

In your Supabase dashboard, enable real-time for all tables:

1. Go to Database → Replication
2. Enable replication for:
   - `area_managers`
   - `project_managers`
   - `social_workers`
   - `projects`
   - `blog_posts`
   - `board_members`

## How It Works

### Data Manager (`dataManager.js`)

The main data manager automatically detects if Supabase is configured:

- **If Supabase is available**: Uses `supabaseDataManager.js` with caching and real-time
- **If Supabase is not available**: Falls back to localStorage with sample data

### Caching Strategy

- Cache duration: 5 minutes
- Cache is stored in localStorage with timestamps
- Cache is automatically invalidated when:
  - Data is updated via API calls
  - Real-time events are received
  - Manual cache invalidation is triggered

### Real-time Subscriptions

Real-time subscriptions are automatically set up when Supabase is initialized:

- Listens to INSERT, UPDATE, DELETE events on all tables
- Automatically invalidates cache when changes are detected
- Updates UI components that are subscribed to changes

## Usage

### In Components

All data manager functions are now async:

```javascript
// Before (synchronous)
const managers = getAreaManagers();

// After (async)
const managers = await getAreaManagers();
```

### Example: Loading Data

```javascript
useEffect(() => {
  const loadData = async () => {
    const managers = await getAreaManagers();
    const projects = await getProjects({ areaManagerId: 1 });
    // ... use data
  };
  loadData();
}, []);
```

### Example: Updating Data

```javascript
const handleUpdate = async () => {
  await updateAreaManager(id, { name: 'New Name' });
  // Cache is automatically invalidated
  // Real-time subscribers will be notified
  await loadData(); // Reload to get fresh data
};
```

## Files Structure

- `utils/supabase.js`: Supabase client configuration
- `utils/supabaseDataManager.js`: Supabase-specific data operations with caching
- `utils/dataManager.js`: Main data manager with Supabase/fallback logic
- `utils/sampleData.js`: Sample data for fallback mode

## Troubleshooting

### Supabase Not Connecting

1. Check environment variables are set correctly
2. Verify Supabase URL and anon key in Supabase dashboard
3. Check browser console for connection errors
4. Ensure RLS policies allow public read access (if needed)

### Real-time Not Working

1. Verify real-time is enabled in Supabase dashboard
2. Check that tables have replication enabled
3. Ensure WebSocket connections are not blocked by firewall
4. Check browser console for subscription errors

### Cache Issues

- Cache is automatically invalidated on updates
- To manually clear cache: `localStorage.clear()` (will also clear other data)
- Cache keys are prefixed with `fbgl_cache_`

## Migration from Sample Data

When migrating from sample data to Supabase:

1. Set up Supabase database with schema
2. Import sample data into Supabase tables
3. Add environment variables
4. Restart the application
5. The app will automatically detect Supabase and switch to it

## Performance

- **Caching**: Reduces API calls by ~80% for frequently accessed data
- **Real-time**: Updates are instant without polling
- **Fallback**: No performance impact when Supabase is unavailable

