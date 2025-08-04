# PipeCalc - Tube Cutting Optimizer

An Electron-based desktop application for optimizing tube/pipe cutting operations to minimize material waste.

## Overview

PipeCalc is a cutting optimization tool that helps calculate the most efficient way to cut standard-length tubes (5500mm) into smaller pieces while minimizing waste. It uses an intelligent algorithm to group similar cutting patterns and provides detailed cutting plans.

## Features

- **Optimal Cutting Algorithm**: Automatically arranges cuts to minimize waste material
- **Pattern Grouping**: Groups identical cutting patterns together for efficient production
- **Waste Tracking**: Shows total waste and waste per tube group
- **Desktop Application**: Cross-platform Electron app with native performance

## Screenshots

*Add screenshots of your application here*

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Development Setup

1. Clone the repository:
```bash
git clone https://github.com/rataonfire/pipecalc.git
cd pipecalc/core
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

### Building for Production

Create distributable packages for your platform:

```bash
# For all platforms
npm run make

# The output will be in the 'out' directory
```

## Usage

1. **Input Details**: Add the details (pieces) you need to cut:
   - Name: Identifier for the piece
   - Length: Length in millimeters
   - Amount: Quantity needed

2. **Run Optimization**: The app automatically calculates the optimal cutting plan

3. **View Results**: 
   - See grouped cutting patterns
   - Check total waste and efficiency
   - Get detailed cutting instructions for each tube

### Example

If you need:
- 10 pieces of 1200mm
- 15 pieces of 800mm  
- 20 pieces of 600mm

The optimizer will arrange these cuts across multiple 5500mm tubes, grouping similar patterns together and minimizing leftover material.

## Technical Details

### Architecture

The application is built with:
- **Electron**: Desktop application framework
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework

### Core Algorithm

The optimization algorithm (`optimizer.ts`) works by:

1. **Sorting**: Details are sorted by length (longest first)
2. **Best Fit**: For each tube, it finds the best-fitting piece that minimizes waste
3. **Grouping**: Similar cutting patterns are grouped together
4. **Iteration**: Process continues until all pieces are allocated

### Project Structure

```
pipecalc/
├── core/
│   ├── src/
│   │   ├── logic/
│   │   │   └── optimizer.ts    # Core optimization algorithm
│   │   ├── types/
│   │   │   └── types.ts        # TypeScript type definitions
│   │   ├── main.ts             # Electron main process
│   │   ├── preload.ts          # Preload script
│   │   └── renderer.ts         # Renderer process
│   ├── package.json
│   └── vite.config.ts
```

## API Reference

### Types

```typescript
interface Detail {
  name: string;
  length: number;
  amount: number;
}

interface Tube {
  tubeLength: number;
  remainingLength: number;
  placedDetails: readonly Detail[];
}

interface OptimizedTubeGroup {
  name: string;
  tubes: Tube[];
  waste: number;
  amount: number;
}

interface CuttingState {
  tubeGroups: OptimizedTubeGroup[];
  remainingDetails: Detail[];
  totalWaste: number;
  totalTubes: number;
  isComplete: boolean;
}
```

### Main Function

```typescript
optimizeCutting(details: Detail[]): CuttingState
```

Optimizes the cutting of tubes based on the provided details.

## Development

### Available Scripts

- `npm start` - Start the Electron app in development mode
- `npm run package` - Package the app without creating distributables
- `npm run make` - Create platform-specific distributables
- `npm run lint` - Run ESLint on TypeScript files

### Building from Source

The project uses Electron Forge for building:

```bash
# Windows
npm run make -- --platform=win32

# macOS
npm run make -- --platform=darwin

# Linux
npm run make -- --platform=linux
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use ESLint for code linting
- Keep functions small and focused
- Add comments for complex logic

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

- **rat101** - *Initial work* - [rataonfire@proton.me](mailto:rataonfire@proton.me)

## Acknowledgments

- Built with Electron and TypeScript
- Optimization algorithm inspired by bin packing solutions
## Roadmap
[ ]Add tests
[ ]Add better error handling
[ ]Create better deployment path
