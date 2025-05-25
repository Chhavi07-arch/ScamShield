# ScamShield

ScamShield is a comprehensive web application designed to help users detect and protect themselves from various types of online scams. In an increasingly digital world, scammers are becoming more sophisticated in their approaches. ScamShield provides a suite of tools to verify phone numbers, analyze suspicious messages, scan QR codes, and check URLs for potential threats, all in one user-friendly platform.

## 🛡️ Features

### Dashboard
- **Centralized Hub**: Access all tools and features from a single, intuitive interface
- **Scam Statistics**: View real-time data on current scam trends and threats
- **Latest Scam News**: Stay informed with up-to-date news about recent scams via NewsAPI integration
- **Quick Access**: Jump directly to any scam detection tool with a single click

### Fake Phone Number Checker
- **Number Validation**: Verify if a phone number is legitimate or potentially fraudulent
- **Carrier Detection**: Identify the telecommunications provider associated with a number
- **Location Tracking**: Determine the geographic origin of phone numbers
- **Risk Assessment**: Receive a comprehensive risk score based on multiple verification factors
- **Numverify API Integration**: Leverage professional phone validation services for accurate results

### Message/Text Scam Analyzer
- **Content Analysis**: Scan message content for common scam patterns and red flags
- **Keyword Detection**: Identify suspicious language commonly used in scam messages
- **Intent Classification**: Determine if a message is trying to deceive, phish, or manipulate
- **Risk Highlighting**: Visual highlighting of problematic text portions
- **Gemini AI Integration**: Advanced machine learning analysis of message content to detect sophisticated scams

### QR Code & Image Detector
- **QR Code Scanning**: Decode and analyze QR codes before visiting potentially harmful links
- **Text Extraction**: Use Tesseract.js OCR to extract and analyze text from images
- **Embedded URL Analysis**: Check for malicious links hidden within QR codes
- **Visual Pattern Recognition**: Identify suspicious visual elements in QR codes and images
- **Safe Preview**: View QR code destinations without visiting the actual websites

### Link/URL Scanner
- **URL Validation**: Check if URLs are legitimate or potentially harmful
- **Phishing Detection**: Identify URLs mimicking legitimate websites
- **Malware Scanning**: Detect potential malware downloads using VirusTotal API integration
- **Security Assessment**: Receive detailed security reports for any URL
- **Safe Browsing**: Get warnings before visiting potentially dangerous websites

### Scam Game
- **Interactive Learning**: Test and improve your scam detection skills through gamification
- **Real-world Scenarios**: Practice identifying scams in simulated real-life situations
- **Difficulty Progression**: Increasing challenge levels as your skills improve
- **Score Tracking**: Monitor your progress and improvement over time
- **Educational Feedback**: Learn why certain scenarios are scams and how to spot them

### User-Friendly Experience
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Intuitive Interface**: Clean, modern UI that's easy to navigate for users of all technical abilities
- **Real-time Results**: Get immediate feedback and analysis
- **Comprehensive Reporting**: Detailed explanations of all detection results
- **Dark/Light Modes**: Comfortable viewing experience in any environment

## 🚀 Live Demo

Visit [ScamShield](https://github.com/Chhavi07-arch/ScamShield.git) to see the application in action.

## 🔧 Tech Stack

### Frontend
- **Framework**: React.js
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom components using Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router

### APIs and Integrations
- **News Data**: NewsAPI.org for real-time scam news and alerts
- **Phone Verification**: Numverify API for phone number validation and carrier detection
- **Text Analysis**: Google's Gemini AI API for advanced message content analysis
- **URL Security**: VirusTotal API for malicious link detection
- **OCR Technology**: Tesseract.js for text recognition in images

### Development Tools
- **Code Quality**: ESLint
- **Version Control**: Git & GitHub
- **Package Management**: npm

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

The application uses several API keys for various features. Create a `.env` file in the root directory with the following:

```
# News API key from newsapi.org
VITE_NEWS_API_KEY=your_newsapi_org_key_here

# Numverify API key for phone verification
VITE_NUMVERIFY_API_KEY=your_numverify_key_here

# Google Gemini API key for text analysis
VITE_GEMINI_API_KEY=your_gemini_key_here

# VirusTotal API key for URL scanning
VITE_VIRUSTOTAL_API_KEY=your_virustotal_key_here
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

Made with ❤️ by Team Trinity
