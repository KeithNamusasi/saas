import { supabase, showLoading, hideLoading, showToast } from './supabase-client.js';

const signupForm = document.getElementById('signupForm');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

if (!signupForm) {
    console.error('Signup form not found');
} else {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const businessName = document.getElementById('businessName').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitBtn = e.target.querySelector('button[type="submit"]');

        // Hide previous messages
        errorMessage.classList.add('hidden');
        successMessage.classList.add('hidden');

        // Show loading
        showLoading(submitBtn);

        try {
            // 1. Create auth user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password
            });

            if (authError) {
                throw new Error(authError.message);
            }

            if (!authData.user) {
                throw new Error('Signup succeeded but no user was returned. Please check your email for confirmation.');
            }

            // 2. Create business record using modular helper
            const { getOrCreateBusiness } = await import('./businesses.js');
            await getOrCreateBusiness(authData.user, {
                name: businessName,
                phone: phone
            });

            // 3. Success
            successMessage.textContent = 'Account created successfully! Redirecting...';
            successMessage.classList.remove('hidden');

            setTimeout(() => {
                window.location.href = '/app/dashboard.html';
            }, 1500);

        } catch (error) {
            console.error('Signup error:', error);

            let userMessage = error.message || 'An unexpected error occurred. Please try again.';

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
