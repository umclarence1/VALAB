# 🧪 Virtual Chemistry Laboratory

**DI-Hack 2025 Submission** - *"Co-Designing Accessibility: Empowering Persons with Disabilities Through Technology"*

An immersive, accessible virtual chemistry laboratory designed specifically for students with physical disabilities. This application provides a safe, inclusive environment for conducting chemistry experiments without the physical barriers of traditional laboratories.

## 🎯 Project Goals

- **Accessibility First**: Designed for students with physical disabilities
- **Interactive Learning**: 3D virtual laboratory environment
- **Safety**: Risk-free experimentation
- **Inclusive Education**: Equal access to scientific education

## ✨ Key Features

### 🚪 **Interactive Lobby**
- Virtual building with multiple laboratory doors
- Smooth animations and transitions
- Keyboard and screen reader navigation
- Voice command support

### 🧪 **Chemistry Laboratory**
- Realistic 3D laboratory equipment
- Interactive beakers, flasks, test tubes, and burners
- Chemical substance library
- Step-by-step experiment guidance
- Safety protocols and warnings

### ♿ **Accessibility Features**
- **Voice Commands**: Hands-free operation
- **Screen Reader Support**: Full ARIA implementation
- **Keyboard Navigation**: Complete keyboard accessibility
- **High Contrast Mode**: Enhanced visibility
- **Adjustable Font Sizes**: Customizable text sizing
- **Reduced Motion**: Motion sensitivity support
- **Audio Feedback**: Sound cues for interactions

## 🛠️ Technology Stack

- **React 19** - Modern UI framework
- **Three.js** - 3D graphics and visualization
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Utility components for R3F
- **Framer Motion** - Smooth animations
- **Vite** - Fast build tool and dev server

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd virtuallab
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎮 Usage Guide

### Basic Navigation
- **Mouse**: Click and drag to look around
- **Keyboard**: Use Tab to navigate between interactive elements
- **Voice**: Say "Select beaker" or "Open settings"

### Keyboard Shortcuts
- `Tab` - Navigate between elements
- `Space` - Select/Interact with objects
- `Esc` - Go back or cancel action
- `H` - Open help guide
- `V` - Toggle voice commands
- `S` - Open settings

### Conducting Experiments
1. Start in the lobby and click on the Chemistry Lab door
2. Select equipment by clicking or using keyboard navigation
3. Follow the step-by-step instructions in the instruction panel
4. Add substances and observe reactions safely

## ⚙️ Accessibility Settings

Access settings via the gear icon (⚙️) in the top-right corner:

- **Voice Commands**: Enable/disable voice control
- **High Contrast**: Improve visual contrast
- **Reduce Motion**: Minimize animations for motion sensitivity
- **Font Size**: Adjust text size (Small/Medium/Large/Extra Large)
- **Audio Feedback**: Enable/disable sound cues
- **Keyboard Navigation**: Customize keyboard behavior

## 🔬 Available Experiments

- **Basic Mixing**: Combine water with different substances
- **Chemical Reactions**: Observe color changes and gas production
- **pH Testing**: Test acidity levels safely
- **Crystallization**: Watch crystal formation process

*More experiments coming soon in Physics and Biology labs!*

## 🛡️ Safety Features

- **Virtual Environment**: No real chemical hazards
- **Safety Warnings**: Visual and audio safety alerts
- **Emergency Stop**: Immediate experiment termination
- **Proper Procedures**: Guided safe laboratory practices

## 🤝 Contributing

This project is part of DI-Hack 2025. Contributions that improve accessibility and educational value are welcome!

## 📋 Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏆 DI-Hack 2025 Category

**Enhancing Learning & Education** - Creating inclusive learning environments through innovative technology solutions.

## 📞 Support

For accessibility issues or feature requests, please contact the development team.

---

*Built with ❤️ for accessible education*

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
