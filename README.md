# ScamShield

<p align="center">
  <img src="public/vite.svg" alt="ScamShield Logo" width="100" height="100">
</p>

ScamShield is a comprehensive web application designed to help users detect and protect themselves from various types of online scams. In an increasingly digital world, scammers are becoming more sophisticated in their approaches. ScamShield provides a suite of tools to verify phone numbers, analyze suspicious messages, scan QR codes, and check URLs for potential threats, all in one user-friendly platform.

## 🛡️ Features

- **Dashboard** - Central hub with scam statistics, latest scam news from NewsAPI.org, and quick access to all tools
- **Fake Phone Number Checker** - Verify if a phone number is legitimate or potentially fraudulent
- **Message/Text Scam Analyzer** - Analyze suspicious text messages to identify potential scams using pattern recognition
- **QR Code & Image Detector** - Scan QR codes and images for malicious content using Tesseract.js for text recognition
- **Link/URL Scanner** - Check URLs for security threats before visiting them
- **Scam Game** - Educational game to test and improve your scam detection skills
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🚀 Live Demo

Visit [ScamShield](https://github.com/Chhavi07-arch/ScamShield.git) to see the application in action.

## 🔧 Tech Stack

- **Frontend Framework**: React.js
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom components using Tailwind CSS
- **Icons**: Lucide React
- **API Integration**: NewsAPI.org for scam news
- **OCR Technology**: Tesseract.js for text recognition in images
- **Routing**: React Router
- **Code Quality**: ESLint

## 📂 Project Structure

```
ScamShield/
├── public/                 # Static files
│   ├── vite.svg           # Logo
│   ├── scam-news.json     # Fallback news data
│   └── messages.json      # Sample message data
│
├── src/                    # Source files
│   ├── assets/            # Images and other assets
│   ├── components/        # React components
│   │   ├── Dashboard/     # Dashboard components
│   │   ├── Features/      # Feature components
│   │   ├── Game/          # Scam game components
│   │   ├── ScamDetector/  # Scam detection components
│   │   └── ui/            # UI components
│   │
│   ├── pages/             # Page components
│   │   ├── Dashboard.jsx  # Dashboard page
│   │   ├── Home.jsx       # Home page
│   │   ├── Game.jsx       # Game page
│   │   └── Features.jsx   # Features page
│   │
│   ├── App.jsx            # Main App component
│   ├── App.css            # App styles
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
│
├── .env.example           # Example environment variables
├── .gitignore             # Git ignore file
├── package.json           # Project dependencies
├── tailwind.config.js     # Tailwind CSS configuration
└── vite.config.js         # Vite configuration
```

## 🔌 Environment Variables

The application uses API keys for news data. Create a `.env` file in the root directory with the following:

```
# News API key from newsapi.org
VITE_NEWS_API_KEY=your_newsapi_org_key_here
```

## 💻 Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Chhavi07-arch/ScamShield.git
   cd ScamShield
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your API keys (see Environment Variables section).

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## 🏗️ Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🧪 Future Enhancements

- Integration with more scam detection APIs
- User accounts to save scan history
- Community-reported scam database
- Browser extension for real-time protection
- Mobile app version

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📬 Contact

For any questions or feedback, please reach out to [your-email@example.com](mailto:your-email@example.com).

---

Made with ❤️ by Chhavi Ahlawat
