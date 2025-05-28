// UI-related functions
export function updateToneValue(value) {
    const toneValue = document.querySelector('.tone-value');
    const toneDescription = document.getElementById('toneDescription');
    toneValue.textContent = value;

    // Update tone description
    if (value < 33) {
        toneDescription.textContent = 'Casual and conversational tone';
    } else if (value < 66) {
        toneDescription.textContent = 'Balanced and professional tone';
    } else {
        toneDescription.textContent = 'Formal and corporate tone';
    }
}

export function copyToClipboard() {
    const copyText = document.getElementById('copyText');
    const textToCopy = copyText.innerText;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        // Show success message
        const btn = document.querySelector('button[onclick="copyToClipboard()"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text:', err);
        showError('Failed to copy text to clipboard');
    });
}

export function showError(message) {
    const error = document.getElementById('error');
    error.textContent = message;
    error.classList.remove('hidden');
}

export function hideError() {
    const error = document.getElementById('error');
    error.classList.add('hidden');
}

export function showLoading() {
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');
    loading.classList.remove('hidden');
    result.classList.add('hidden');
}

export function hideLoading() {
    const loading = document.getElementById('loading');
    loading.classList.add('hidden');
}

export function updateResult(content) {
    const result = document.getElementById('result');
    const copyText = document.getElementById('copyText');
    const loading = document.getElementById('loading');
    
    loading.classList.add('hidden');
    result.classList.remove('hidden');
    copyText.innerHTML = content.split('\n').map(line => `<p>${line}</p>`).join('');
}

export function clearForm() {
    document.getElementById('copyForm').reset();
    document.getElementById('result').classList.add('hidden');
    document.getElementById('error').classList.add('hidden');
    document.getElementById('loading').classList.add('hidden');
    updateToneValue(50); // Reset tone slider to default
}

// Export functionality
export function exportAsText() {
    const copyText = document.getElementById('copyText');
    if (!copyText || !copyText.textContent.trim()) {
        showError('No content to export');
        return;
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
}

export function exportAsPDF() {
    const copyText = document.getElementById('copyText');
    if (!copyText || !copyText.textContent.trim()) {
        showError('No content to export');
        return;
    }

    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
        showError('PDF export functionality not available');
        return;
    }

    try {
        const doc = new jsPDF();
        const text = copyText.textContent;
        const splitText = doc.splitTextToSize(text, 180);
        
        doc.setFontSize(12);
        doc.text(splitText, 15, 15);
        doc.save('marketing-copy.pdf');
    } catch (err) {
        console.error('Failed to export PDF:', err);
        showError('Failed to export as PDF');
    }
} 