// UI-related functions
export function updateToneValue(value) {
    const toneValue = document.querySelector('.tone-value');
    const toneDescription = document.getElementById('toneDescription');
    if (toneValue) {
        toneValue.textContent = value;
    }

    // Update tone description
    if (toneDescription) {
        if (value < 33) {
            toneDescription.textContent = 'Casual and conversational tone';
        } else if (value < 66) {
            toneDescription.textContent = 'Balanced and professional tone';
        } else {
            toneDescription.textContent = 'Formal and corporate tone';
        }
    }
}

export function copyToClipboard() {
    const copyText = document.getElementById('copyText');
    if (!copyText || !copyText.textContent.trim()) {
        showError('No content to copy');
        return;
    }

    const textToCopy = copyText.textContent;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        // Show success message
        const btn = document.querySelector('button[onclick="window.copyToClipboard()"]');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        }
    }).catch(err => {
        console.error('Failed to copy text:', err);
        showError('Failed to copy text to clipboard');
    });
}

export function showError(message) {
    const error = document.getElementById('error');
    if (error) {
        error.textContent = message;
        error.classList.remove('hidden');
    }
}

export function hideError() {
    const error = document.getElementById('error');
    if (error) {
        error.classList.add('hidden');
    }
}

export function showLoading() {
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');
    if (loading) {
        loading.classList.remove('hidden');
    }
    if (result) {
        result.classList.add('hidden');
    }
}

export function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.add('hidden');
    }
}

export function updateResult(content) {
    const result = document.getElementById('result');
    const copyText = document.getElementById('copyText');
    const loading = document.getElementById('loading');
    
    if (loading) {
        loading.classList.add('hidden');
    }
    if (result) {
        result.classList.remove('hidden');
    }
    if (copyText) {
        copyText.innerHTML = content.split('\n').map(line => `<p>${line}</p>`).join('');
    }
}

export function clearForm() {
    const form = document.getElementById('copyForm');
    const result = document.getElementById('result');
    const error = document.getElementById('error');
    const loading = document.getElementById('loading');

    if (form) {
        form.reset();
    }
    if (result) {
        result.classList.add('hidden');
    }
    if (error) {
        error.classList.add('hidden');
    }
    if (loading) {
        loading.classList.add('hidden');
    }
    updateToneValue(50); // Reset tone slider to default
}

// Export functionality
export function exportAsText() {
    const copyText = document.getElementById('copyText');
    if (!copyText || !copyText.textContent.trim()) {
        showError('No content to export');
        return Promise.reject(new Error('No content to export'));
    }

    const blob = new Blob([copyText.textContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'marketing-copy.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    return Promise.resolve();
}

export function exportAsPDF() {
    const copyText = document.getElementById('copyText');
    if (!copyText || !copyText.textContent.trim()) {
        showError('No content to export');
        return Promise.reject(new Error('No content to export'));
    }

    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
        showError('PDF export functionality not available');
        return Promise.reject(new Error('PDF export functionality not available'));
    }

    try {
        const doc = new jsPDF();
        const text = copyText.textContent;
        const splitText = doc.splitTextToSize(text, 180);
        
        doc.setFontSize(12);
        doc.text(splitText, 15, 15);
        doc.save('marketing-copy.pdf');
        return Promise.resolve();
    } catch (err) {
        console.error('Failed to export PDF:', err);
        showError('Failed to export as PDF');
        return Promise.reject(err);
    }
} 