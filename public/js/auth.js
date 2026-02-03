import { supabase } from "./supabase-client.js";

/**
 * Get current user or redirect to login page
 */
export async function getUserOrRedirect() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        console.log('No active session, redirecting to login...');
        window.location.href = '/auth/login.html';
        return null;
    }

    return user;
}

/**
 * Sign out current user
 */
export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Logout error:', error);
        alert('Logout failed: ' + error.message);
    } else {
        window.location.href = '/auth/login.html';
    }
}
