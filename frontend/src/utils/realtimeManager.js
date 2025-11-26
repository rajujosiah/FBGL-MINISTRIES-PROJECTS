import { createClient } from '@supabase/supabase-js';
import { invalidateCacheType, CACHE_TYPES } from './cacheManager';

// Initialize Supabase client for realtime subscriptions
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey && supabaseUrl !== 'https://your-project.supabase.co') {
    supabase = createClient(supabaseUrl, supabaseKey);
}

// Store active subscriptions
let subscriptions = [];

/**
 * Initialize realtime subscriptions for all relevant tables
 */
export const initializeRealtimeSubscriptions = () => {
    if (!supabase) {
        console.warn('Supabase not configured, realtime updates disabled');
        return;
    }

    // Clear existing subscriptions
    cleanupSubscriptions();

    console.log('🔌 Initializing Realtime Subscriptions...');

    // Subscribe to PROJECTS changes
    const projectsSub = supabase
        .channel('public:projects')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, (payload) => {
            console.log('🔄 Realtime update: PROJECTS', payload);
            invalidateCacheType(CACHE_TYPES.PROJECTS);
            invalidateCacheType(CACHE_TYPES.HOME_PROJECTS);
        })
        .subscribe();
    subscriptions.push(projectsSub);

    // Subscribe to BLOG_POSTS changes
    const blogSub = supabase
        .channel('public:blog_posts')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, (payload) => {
            console.log('🔄 Realtime update: BLOG_POSTS', payload);
            invalidateCacheType(CACHE_TYPES.BLOG_POSTS);
        })
        .subscribe();
    subscriptions.push(blogSub);

    // Subscribe to AREA_MANAGERS changes
    const areaManagersSub = supabase
        .channel('public:area_managers')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'area_managers' }, (payload) => {
            console.log('🔄 Realtime update: AREA_MANAGERS', payload);
            invalidateCacheType(CACHE_TYPES.AREA_MANAGERS);
        })
        .subscribe();
    subscriptions.push(areaManagersSub);

    // Subscribe to PROJECT_MANAGERS changes
    const projectManagersSub = supabase
        .channel('public:project_managers')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'project_managers' }, (payload) => {
            console.log('🔄 Realtime update: PROJECT_MANAGERS', payload);
            invalidateCacheType(CACHE_TYPES.PROJECT_MANAGERS);
        })
        .subscribe();
    subscriptions.push(projectManagersSub);

    // Subscribe to SOCIAL_WORKERS changes
    const socialWorkersSub = supabase
        .channel('public:social_workers')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'social_workers' }, (payload) => {
            console.log('🔄 Realtime update: SOCIAL_WORKERS', payload);
            invalidateCacheType(CACHE_TYPES.SOCIAL_WORKERS);
        })
        .subscribe();
    subscriptions.push(socialWorkersSub);

    // Subscribe to BOARD_MEMBERS changes
    const boardMembersSub = supabase
        .channel('public:board_members')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'board_members' }, (payload) => {
            console.log('🔄 Realtime update: BOARD_MEMBERS', payload);
            invalidateCacheType(CACHE_TYPES.BOARD_MEMBERS);
        })
        .subscribe();
    subscriptions.push(boardMembersSub);

    // Subscribe to ADMINS changes
    const adminsSub = supabase
        .channel('public:admins')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'admins' }, (payload) => {
            console.log('🔄 Realtime update: ADMINS', payload);
            invalidateCacheType(CACHE_TYPES.ADMINS);
        })
        .subscribe();
    subscriptions.push(adminsSub);
};

/**
 * Cleanup all subscriptions
 */
export const cleanupSubscriptions = () => {
    if (subscriptions.length > 0) {
        console.log('🔌 Cleaning up Realtime Subscriptions...');
        subscriptions.forEach(sub => supabase.removeChannel(sub));
        subscriptions = [];
    }
};
