import { supabase, showLoading, hideLoading } from './supabase-client.js';

const resetForm = document.getElementById('resetForm');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

if (!resetForm) {
    console.error('Reset form not found');
} else {
    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const submitBtn = e.target.querySelector('button[type="submit"]');

        // Hide previous messages
        errorMessage.classList.add('hidden');
        successMessage.classList.add('hidden');

        // Show loading
        showLoading(submitBtn);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/login.html`
            });

            if (error) {
                throw new Error(error.message);
            }

            // Show success
            successMessage.textContent = 'Password reset link sent! Check your email.';
            successMessage.classList.remove('hidden');
            resetForm.reset();

        } catch (error) {
            console.error('Password reset error:', error);

            let userMessage = error.message || 'Failed to send reset link. Please try again.';

            // Handle specific Supabase auth error for email rate limits
            if (userMessage.includes('Email rate limit exceeded')) {
                userMessage = 'Email rate limit exceeded. Please wait about an hour before trying again, or contact support if the issue persists.';
            }

            errorMessage.textContent = userMessage;
            errorMessage.classList.remove('hidden');
        } finally {
            hideLoading(submitBtn);
        }
    });
}
