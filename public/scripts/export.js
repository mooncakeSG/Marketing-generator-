// Export functionality module

// Export as text file
async function exportAsText(content, filename = 'marketing-copy.txt') {
    if (!content) {
        throw new Error('No content to export');
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

// Export as PDF
async function exportAsPDF(content, filename = 'marketing-copy.pdf') {
    if (!content) {
        throw new Error('No content to export');
    }

    try {
        // Load PDF library dynamically
        await loadPDFLib();
        
        const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
        
        // Create PDF document
        const doc = await PDFDocument.create();
        const page = doc.addPage([595.28, 841.89]); // A4 size
        const font = await doc.embedFont(StandardFonts.Helvetica);
        
        // Format content
        const lines = content.split('\n');
        let y = 800; // Start from top
        const fontSize = 12;
        const lineHeight = 14;
        
        lines.forEach(line => {
            if (y < 50) { // Add new page if needed
                page = doc.addPage([595.28, 841.89]);
                y = 800;
            }
            
            page.drawText(line, {
                x: 50,
                y: y,
                size: fontSize,
                font: font,
                color: rgb(0, 0, 0)
            });
            
            y -= lineHeight;
        });
        
        // Save PDF
        const pdfBytes = await doc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
    } catch (error) {
        console.error('PDF export failed:', error);
        throw new Error('Failed to export as PDF. Please try text format instead.');
    }
}

// Load PDF library dynamically
async function loadPDFLib() {
    if (window.PDFLib) return;

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/pdf-lib/dist/pdf-lib.min.js';
        script.onload = resolve;
        script.onerror = () => reject(new Error('Failed to load PDF library'));
        document.head.appendChild(script);
    });
}

// Export metadata
function getExportMetadata(content) {
    return {
        timestamp: new Date().toISOString(),
        wordCount: content.split(/\s+/).length,
        charCount: content.length,
        paragraphs: content.split('\n\n').length
    };
}

// Export functions
export {
    exportAsText,
    exportAsPDF,
    getExportMetadata
}; 