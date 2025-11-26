# 🎭 Code Mood Analyzer

A fun and unique CLI tool that analyzes the "mood" of your code based on various metrics like comments, complexity, naming patterns, and more!

## 🌟 Features

- **Mood Detection**: Analyzes your code and determines its emotional state (Ecstatic, Happy, Content, Neutral, Stressed, Frustrated, Sad, Zen, Chaotic, or Mysterious)
- **Multi-language Support**: Works with JavaScript, TypeScript, Python, Java, C/C++, Go, Ruby, Rust, PHP, Swift, and more
- **Detailed Metrics**: Provides statistics on lines of code, comments, functions, nesting depth, and mood indicators
- **Smart Suggestions**: Gives actionable feedback to improve your code's "mood"
- **Directory Analysis**: Analyze entire codebases and see aggregate mood statistics

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Christian-Akor/expert-doodle.git
cd expert-doodle

# Install dependencies
npm install

# Optional: Link for global use
npm link
```

## 🚀 Usage

### Analyze a single file
```bash
npm start -- path/to/your/file.js
# or if linked globally:
code-mood path/to/your/file.js
```

### Analyze a directory
```bash
npm start -- ./src
# or
code-mood ./src
```

### Try with sample files
```bash
npm run analyze
```

### View help
```bash
npm start -- --help
```

### View all possible moods
```bash
npm start -- --moods
```

## 🎭 Possible Moods

| Mood | Emoji | Description |
|------|-------|-------------|
| Ecstatic | 🎉 | Code is absolutely thriving! |
| Happy | 😊 | Pleasant vibes, well-maintained |
| Content | 🙂 | Steady and stable |
| Neutral | 😐 | Neither happy nor sad |
| Stressed | 😰 | Under pressure! |
| Frustrated | 😤 | Someone had a rough day |
| Sad | 😢 | Needs some love |
| Zen | 🧘 | Perfectly balanced |
| Chaotic | 🌪️ | Wild and unpredictable |
| Mysterious | 🔮 | Keeps its secrets |

## 📊 Metrics Analyzed

The analyzer looks at:
- **Comment Ratio**: How well-documented is your code?
- **Mood Words**: Positive vs negative language in comments
- **Stress Indicators**: TODOs, FIXMEs, HACKs, urgent language
- **Code Complexity**: Nesting depth, line length
- **Test Coverage**: Does your code have tests?
- **Function Count**: How many functions are defined

## 🧪 Running Tests

```bash
npm test
```

## 🔧 Development

```bash
# Run linter
npm run lint

# Run tests with coverage
npm test -- --coverage
```

## 📁 Project Structure

```
expert-doodle/
├── src/
│   ├── cli.js        # CLI interface
│   └── index.js      # Main entry point
├── lib/
│   ├── analyzer.js   # Core analysis engine
│   └── fileUtils.js  # File handling utilities
├── samples/          # Sample code files for testing
├── __tests__/        # Test files
└── README.md
```

## 📝 Example Output

```
══════════════════════════════════════════════════
  📊 CODE MOOD ANALYZER RESULTS
══════════════════════════════════════════════════

📁 File: happy-code.js
😊  Mood: HAPPY (Score: 75/100)

"Pleasant vibes here! The code seems well-maintained and loved."

──────────────────────────────────────────────────
📈 STATISTICS
──────────────────────────────────────────────────
  Total Lines:     45
  Code Lines:      30
  Comment Lines:   10
  Blank Lines:     5
  Functions:       3
  Max Nesting:     1 levels

──────────────────────────────────────────────────
💭 SUGGESTIONS
──────────────────────────────────────────────────
  • ✨ Your code is in a great state! Keep up the good work
══════════════════════════════════════════════════
```

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

MIT License - feel free to use this in your own projects!