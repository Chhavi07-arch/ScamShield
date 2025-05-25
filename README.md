# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# ScamShield

ScamShield is a comprehensive web application designed to help users detect and protect themselves from various types of scams, including phone scams, message scams, QR code scams, and malicious URLs.

## Features

- **Fake Phone Number Checker**: Verify if a phone number is legitimate or potentially fraudulent using the Numverify API
- **Message/Text Scam Analyzer**: Analyze suspicious text messages to identify potential scams using pattern recognition
- **QR Code & Image Detector**: Scan QR codes and images for malicious content using Tesseract.js for text recognition
- **Link/URL Scanner**: Check URLs for security threats before visiting them using Google Safe Browsing API
- **Dashboard**: View scam statistics and latest scam news

## Environment Variables

The application uses several API keys for the different scam detection features. These keys should be stored in a `.env` file in the root directory of the project.

### Setting up the .env file

1. Create a `.env` file in the root directory of the project
2. Add the following environment variables:

```
# ScamShield API Keys

# Phone Number Verification API (Numverify)
VITE_PHONE_API_KEY=your_numverify_api_key_here

# URL Scanner API (Google Safe Browsing)
VITE_URL_SCANNER_API_KEY=your_google_safe_browsing_api_key_here
```

3. Replace the placeholder values with your actual API keys

> **Important**: Make sure the `.env` file is included in your `.gitignore` file to prevent accidentally committing your API keys to version control.

### API Keys

For production use, you'll need to obtain API keys from the following services:

- **Phone verification**: [Numverify API](https://numverify.com/) - Provides phone number validation and information
- **URL scanning**: [Google Safe Browsing API](https://developers.google.com/safe-browsing) - Checks URLs against Google's database of unsafe web resources

## Dependencies

- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool and development server
- [Tesseract.js](https://tesseract.projectnaptha.com/) - OCR (Optical Character Recognition) library for text detection in images
- [Lucide React](https://lucide.dev/) - Icon library

## Development

To start the development server:

```bash
npm run dev
```

## Building for Production

To build the application for production:

```bash
npm run build
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
