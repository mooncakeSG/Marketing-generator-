# AI Marketing Copy Generator

A web application that generates professional marketing copy using AI21's Jurassic-2 Large language model. The application helps create various types of marketing content with customizable tone and style.

Live demo: https://marketing-generator.onrender.com/

## Features

- 🎯 Multiple marketing templates:
  - Product Launch
  - Social Media Teaser
  - Email Campaign
  - Product Comparison
  - Brand Storytelling
- 🎨 Adjustable tone control (casual to formal)
- 📊 Usage statistics tracking
- 💾 Export options (TXT/PDF)
- 🌓 Dark/Light theme support
- 📱 Responsive design

## Technical Documentation

### Architecture Overview

#### Frontend
```
public/
├── index.html      # Main UI
├── styles.css      # Core styles
├── theme.js        # Theme management
└── scripts/
    ├── templates.js    # Prompt templates
    ├── validation.js   # Input validation
    ├── export.js       # Export functionality
    └── stats.js        # Usage statistics
```

#### Backend
```
server/
├── app.js             # Express server
├── routes/
│   └── api.js         # API endpoints
├── services/
│   ├── ai21.js        # AI21 integration
│   ├── filter.js      # Content filtering
│   └── tracker.js     # Usage tracking
└── utils/
    ├── validation.js  # Input validation
    └── export.js      # Export helpers
```

### API Integration

The application uses AI21's Jurassic-2 Large model with the following parameters:
```javascript
{
  temperature: 0.7,    // Balanced creativity
  maxTokens: 500,      // Sufficient length
  topP: 0.9,          // Focused yet diverse
  stopSequences: ["\n\n", "###"]
}
```

### Performance Optimization

- Frontend:
  - Lazy loading of non-critical resources
  - Client-side caching of templates
  - Debounced API calls
  - Progressive loading indicators
  - Optimized DOM updates

- Backend:
  - Response caching
  - Request queuing
  - Rate limiting
  - Error handling
  - Response compression

### Rate Limits

- AI21 API: 60 requests/minute
- Export API: 30 requests/minute
- Storage API: 100 requests/minute

## Prompt Engineering

### Template Design

1. **Product Launch**
   - Focus on unique value proposition
   - Highlight key features and benefits
   - Address target audience pain points
   - Include launch timing and availability
   - Strong call to action

2. **Social Media Teaser**
   - Hook attention in first line
   - Use conversational language
   - Include relevant hashtags
   - Drive engagement
   - Fit platform character limits

3. **Email Campaign**
   - Attention-grabbing subject line
   - Personalized greeting
   - Clear value proposition
   - Social proof elements
   - Compelling CTA
   - Urgency drivers

4. **Product Comparison**
   - Key differentiators
   - Feature comparison
   - Price-value proposition
   - Target audience fit
   - Competitive advantages

5. **Brand Storytelling**
   - Origin and mission
   - Core values
   - Customer impact
   - Vision for future
   - Emotional connection

### Tone Control

- Scale: 0-100
- Mapping:
  - 0-33: Casual/Conversational
  - 34-66: Professional/Balanced
  - 67-100: Formal/Corporate

### Content Filtering

- Pre-processing:
  - Template validation
  - Input sanitization
  - Length constraints
- Post-processing:
  - Inappropriate content filter
  - Format validation
  - Quality checks

## Setup and Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/marketing-generator.git
cd marketing-generator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your API keys:
```
AI21_API_KEY=your_api_key_here
GOOGLE_SHEETS_ID=your_sheets_id_here
```

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

- `AI21_API_KEY`: Your AI21 Studio API key
- `GOOGLE_SHEETS_ID`: Google Sheets ID for usage tracking
- `PORT`: Server port (default: 3001)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- AI21 for providing the language model API
- GSAP for the animation library
- DiceBear for the avatar API 