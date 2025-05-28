const markdownpdf = require('markdown-pdf');
const fs = require('fs');
const path = require('path');

const options = {
    cssPath: path.join(__dirname, 'pdf-style.css'),
    remarkable: {
        html: true,
        breaks: true,
        plugins: ['syntax-highlighting']
    },
    paperFormat: 'A4',
    paperOrientation: 'portrait',
    paperBorder: '1cm'
};

// Convert markdown to PDF
markdownpdf(options)
    .from(path.join(__dirname, '../docs/technical_documentation.md'))
    .to(path.join(__dirname, '../docs/technical_documentation.pdf'), function () {
        console.log('PDF generated successfully!');
    }); 