# Modern React Chess ♟️

A fully-functional, single-page, modern Chess web application built from scratch with React and Tailwind CSS. The app features state-of-the-art styling, comprehensive chess movement validation, and Check/Checkmate logic systems entirely in pure JavaScript.

## ✨ Features

- **Modern UI/UX**: Sleek, fully responsive 8x8 Tailwind CSS grid structure with an elegant dark mode and slate/emerald piece styling.
- **Classic Chess Logistics**: Handles all standard movement rules across Pawns, Knights, Rooks, Bishops, Queens, and Kings.
- **Check & Checkmate Detection**: Deep state validation that accurately restricts illegal moves and tracks win/draw logic.
- **Pawn Promotion**: Seamless automatic promotion implementations.
- **Clean Architecture**: Functional React components cleanly abstracted from underlying mathematical board constraints.

## 💻 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Language**: Modern JavaScript (ES6+)

## 🚀 Getting Started

### Prerequisites

You will need **Node.js** (v18+) and **npm** installed on your system.

### Running Locally

```bash
# Clone the repository
git clone https://github.com/GauravMishrabest777/Chess.git

# Navigate into the project folder
cd Chess

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit the provided local host address (typically `http://localhost:5173`) in your browser to start playing! 

## 🎮 How to Play

1. **White moves first**. Wait your turn indicated by the dashboard.
2. **Select a Piece**: Click on any of your pieces. Yellow squares will highlight legal drop targets.
3. **Capture**: Enemy pieces within range can be captured natively by selecting their underlying square.
4. The system will automatically compute if your King falls into **"Check"** and block any moves that don't protect it!
