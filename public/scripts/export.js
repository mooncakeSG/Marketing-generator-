// Export functionality module

// Export as text file
export function exportAsText() {
    const content = document.getElementById('copyText')?.innerText.trim();

    if (!content) {
        return Promise.reject(new Error('No content to export'));
    }

    try {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'marketing-copy.txt';
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
        return Promise.resolve();
    } catch (err) {
        console.error('Export error:', err);
        return Promise.reject(new Error('Failed to export as text'));
    }
}

// Export as PDF
export function exportAsPDF() {
    const content = document.getElementById('copyText')?.innerText.trim();

    if (!content) {
        return Promise.reject(new Error('No content to export'));
    }

    try {
        if (!window.jspdf?.jsPDF) {
            return Promise.reject(new Error('PDF export functionality not available'));
        }

        const doc = new window.jspdf.jsPDF();
        const splitText = doc.splitTextToSize(content, 180); // Width of 180 units
        
        doc.setFontSize(12);
        doc.text(splitText, 15, 15);
        doc.save('marketing-copy.pdf');
        return Promise.resolve();
    } catch (err) {
        console.error('Export error:', err);
        return Promise.reject(new Error('Failed to export as PDF'));
    }
}

// Get metadata for export
export function getExportMetadata() {
    const content = document.getElementById('copyText')?.innerText.trim();
    return {
        hasContent: Boolean(content),
        contentLength: content?.length || 0,
        timestamp: new Date().toISOString()
    };
} 