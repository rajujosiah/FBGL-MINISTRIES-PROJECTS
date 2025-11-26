/**
 * Data Caching Utility
 * Implements multi-layer caching with time-based invalidation
 */

// In-memory cache (fast, session-based)
const memoryCache = new Map();

// Cache configuration
const CACHE_CONFIG = {
    // Cache duration in milliseconds
    PROJECTS: 5 * 60 * 1000,        // 5 minutes
    BLOG_POSTS: 5 * 60 * 1000,      // 5 minutes
    HOME_PROJECTS: 5 * 60 * 1000,   // 5 minutes
    TEAM_MEMBERS: 10 * 60 * 1000,   // 10 minutes
    BOARD_MEMBERS: 10 * 60 * 1000,  // 10 minutes
    ADMINS: 15 * 60 * 1000,         // 15 minutes (rarely changes)
};

/**
 * Generate cache key
 */
const generateCacheKey = (type, params = {}) => {
    const paramString = Object.keys(params).length > 0
        ? JSON.stringify(params)
        : '';
    return `${type}_${paramString}`;
};

/**
 * Get data from cache (memory first, then localStorage)
 */
export const getCachedData = (type, params = {}) => {
    const key = generateCacheKey(type, params);

    // Try memory cache first (fastest)
    if (memoryCache.has(key)) {
        const cached = memoryCache.get(key);
        if (cached.expiresAt > Date.now()) {
            console.log(`✅ Cache HIT (memory): ${key}`);
            return cached.data;
        } else {
            // Expired, remove from memory
            memoryCache.delete(key);
        }
    }

    // Try localStorage (persists across sessions)
    try {
        const stored = localStorage.getItem(key);
        if (stored) {
            const cached = JSON.parse(stored);
            if (cached.expiresAt > Date.now()) {
                console.log(`✅ Cache HIT (localStorage): ${key}`);
                // Restore to memory cache for faster access
                memoryCache.set(key, cached);
                return cached.data;
            } else {
                // Expired, remove from localStorage
                localStorage.removeItem(key);
            }
        }
    } catch (error) {
        console.error('Error reading from localStorage:', error);
    }

    console.log(`❌ Cache MISS: ${key}`);
    return null;
};

/**
 * Set data in cache (both memory and localStorage)
 */
export const setCachedData = (type, data, params = {}) => {
    const key = generateCacheKey(type, params);
    const duration = CACHE_CONFIG[type] || 5 * 60 * 1000; // Default 5 minutes

    const cacheEntry = {
        data,
        expiresAt: Date.now() + duration,
        cachedAt: Date.now()
    };

    // Store in memory cache
    memoryCache.set(key, cacheEntry);

    // Store in localStorage (with error handling)
    try {
        localStorage.setItem(key, JSON.stringify(cacheEntry));
        console.log(`💾 Cached: ${key} (expires in ${duration / 1000}s)`);
    } catch (error) {
        // localStorage might be full or disabled
        console.warn('Failed to cache in localStorage:', error);
    }
};

/**
 * Invalidate specific cache entry
 */
export const invalidateCache = (type, params = {}) => {
    const key = generateCacheKey(type, params);

    // Remove from memory
    memoryCache.delete(key);

    // Remove from localStorage
    try {
        localStorage.removeItem(key);
        console.log(`🗑️ Invalidated cache: ${key}`);
    } catch (error) {
        console.error('Error removing from localStorage:', error);
    }
};

/**
 * Invalidate all cache entries of a specific type
 */
export const invalidateCacheType = (type) => {
    // Clear from memory
    for (const key of memoryCache.keys()) {
        if (key.startsWith(type)) {
            memoryCache.delete(key);
        }
    }

    // Clear from localStorage
    try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(type)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        console.log(`🗑️ Invalidated all ${type} cache entries`);
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
};

/**
 * Clear all cache
 */
export const clearAllCache = () => {
    // Clear memory cache
    memoryCache.clear();

    // Clear localStorage cache (only our cache entries)
    try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            // Only remove our cache entries (they contain '_')
            if (key && (
                key.startsWith('PROJECTS_') ||
                key.startsWith('BLOG_POSTS_') ||
                key.startsWith('HOME_PROJECTS_') ||
                key.startsWith('TEAM_MEMBERS_') ||
                key.startsWith('BOARD_MEMBERS_') ||
                key.startsWith('ADMINS_')
            )) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        console.log('🗑️ Cleared all cache');
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
};

/**
 * Get cache statistics
 */
export const getCacheStats = () => {
    const memorySize = memoryCache.size;
    let localStorageSize = 0;

    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.includes('_')) {
                localStorageSize++;
            }
        }
    } catch (error) {
        console.error('Error getting cache stats:', error);
    }

    return {
        memoryEntries: memorySize,
        localStorageEntries: localStorageSize,
        totalEntries: memorySize + localStorageSize
    };
};

// Export cache types for consistency
export const CACHE_TYPES = {
    PROJECTS: 'PROJECTS',
    BLOG_POSTS: 'BLOG_POSTS',
    HOME_PROJECTS: 'HOME_PROJECTS',
    TEAM_MEMBERS: 'TEAM_MEMBERS',
    BOARD_MEMBERS: 'BOARD_MEMBERS',
    ADMINS: 'ADMINS',
    AREA_MANAGERS: 'AREA_MANAGERS',
    PROJECT_MANAGERS: 'PROJECT_MANAGERS',
    SOCIAL_WORKERS: 'SOCIAL_WORKERS'
};
