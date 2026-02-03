// Supabase Client Configuration
// IMPORTANT: The URL and ANON_KEY must be from the SAME Supabase project!

const SUPABASE_URL = 'https://jgcbhhqalyibkulrmdod.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY2JoaHFhbHlpYmt1bHJtZG9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MzAwMzMsImV4cCI6MjA4NTUwNjAzM30.PNH11I7JyRfFgpAu3LMB6_TV-6Scwh5rQRYE7oq3Z_c';

// Initialize Supabase client
// For browser, we expect window.supabase to be defined by the script tag
if (!window.supabase) {
    console.error('Supabase CDN script is missing!');
}

export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper function to show loading state
export function showLoading(button) {
    button.disabled = true;
    button.classList.add('loading');
    const originalText = button.textContent;
    button.dataset.originalText = originalText;
    button.innerHTML = '<span class="spinner"></span> Loading...';
}

export function hideLoading(button) {
    button.disabled = false;
    button.classList.remove('loading');
    button.textContent = button.dataset.originalText || 'Submit';
}

// Helper function to show toast notification
export function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `alert alert-${type} toast`;
    toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    min-width: 300px;
    animation: slideInRight 0.3s ease-out;
  `;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
