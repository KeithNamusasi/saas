import { supabase, showLoading, hideLoading } from './supabase-client.js';

const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

if (!loginForm) {
    console.error('Login form not found');
} else {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitBtn = e.target.querySelector('button[type="submit"]');

        // Hide previous errors
        errorMessage.classList.add('hidden');

        // Show loading
        showLoading(submitBtn);

        try {
            // Use signInWithPassword as per expert advice
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                // Check if it's an email confirmation issue
                if (error.message.includes('Email not confirmed')) {
                    throw new Error('Please confirm your email address before logging in, or check Supabase settings to disable email confirmation.');
                }
                throw new Error(error.message);
            }

            if (data.user) {
                // Redirect to dashboard
                window.location.href = '../app/dashboard.html';
            }
        } catch (error) {
            console.error('Login error:', error);
            errorMessage.textContent = error.message || 'Login failed. Please try again.';
            errorMessage.classList.remove('hidden');
        } finally {
            hideLoading(submitBtn);
        }
    });
}

// Check if already logged in
window.addEventListener('load', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        window.location.href = '../app/dashboard.html';
    }
});
