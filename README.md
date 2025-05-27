# AI Marketing Copy Generator

Deployment Website: https://marketing-generator.onrender.com

A modern web application that generates marketing copy using AI21's language model, featuring a beautiful UI with animations and dark mode support.

## Features

- 🤖 AI-powered marketing copy generation using AI21 API
- 🎨 Modern, responsive UI with dark mode support
- ✨ Smooth GSAP animations throughout the interface
- 📝 Pre-built templates for common marketing scenarios
- 🎚️ Tone adjustment slider for customizing content style
- 📋 One-click copy to clipboard functionality
- 📱 Mobile-friendly design
- 🤖 Custom AI mascot (using DiceBear API)
- 📜 History panel to track generated content

## Tech Stack

- Frontend: HTML5, CSS3, JavaScript
- Animations: GSAP (GreenSock Animation Platform)
- Backend: Node.js with Express
- AI: AI21 Studio API
- Icons: Custom SVG icons
- Avatar: DiceBear API

## Setup

1. Clone the repository:
```bash
git clone [your-repo-url]
cd marketing-generator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your AI21 API key:
```
AI21_API_KEY=your_api_key_here
PORT=3001
```

4. Start the server:
```bash
node app.js
```

5. Open your browser and navigate to `http://localhost:3001`

## Usage

1. Select a template or enter your custom prompt
2. Adjust the tone slider to match your desired style
3. Click "Generate Copy" or press Ctrl/Cmd + Enter
4. Copy the generated text to clipboard with one click
5. Toggle dark mode for comfortable viewing

## Project Structure

```
├── public/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # Styling
│   └── scripts.js      # Frontend JavaScript
├── app.js              # Express server
├── package.json        # Dependencies
└── README.md          # Documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- AI21 for providing the language model API
- GSAP for the animation library
- DiceBear for the avatar API 