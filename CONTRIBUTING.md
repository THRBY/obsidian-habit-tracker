# Contributing to Habit Tracker

Thank you for your interest in contributing to Habit Tracker! 🎉

## 🚀 Quick Start

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Code of Conduct

Be respectful, inclusive, and constructive. We're all here to learn and improve.

## 🐛 Bug Reports

When reporting bugs, please include:

- **Obsidian version**
- **Plugin version**
- **Operating system**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Console errors** (if any)

### Bug Report Template

```markdown
**Environment:**
- Obsidian: 1.4.16
- Plugin: 1.0.0
- OS: macOS 14.1

**Steps to Reproduce:**
1. Open habit tracker
2. Create a habit
3. Mark it complete
4. [Error occurs here]

**Expected:**
Habit should be marked as complete

**Actual:**
Error message appears

**Console Error:**
```
[Error details here]
```

**Screenshots:**
[Attach screenshots]
```

## ✨ Feature Requests

We love new ideas! When suggesting features:

1. Check if it's already requested in Issues
2. Describe the problem you're trying to solve
3. Explain your proposed solution
4. Consider potential drawbacks
5. Add mockups/examples if possible

### Feature Request Template

```markdown
**Problem:**
As a user, I want [something] so that [benefit]

**Proposed Solution:**
Add [feature] which would work by [explanation]

**Alternatives:**
- Option A: [description]
- Option B: [description]

**Additional Context:**
[Any other context, mockups, examples]
```

## 💻 Development Setup

### Prerequisites

- Node.js 16+
- npm or yarn
- Obsidian for testing
- Git

### Local Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/obsidian-habit-tracker.git
cd obsidian-habit-tracker

# Install dependencies (if any)
npm install

# Create a symlink to your vault's plugins folder
ln -s $(pwd) /path/to/your/vault/.obsidian/plugins/habit-tracker

# Enable the plugin in Obsidian Settings
```

### Development Workflow

1. Make changes to `main.js` or `styles.css`
2. Reload Obsidian to see changes
   - `Ctrl/Cmd + R` or
   - Disable and re-enable plugin
3. Test thoroughly
4. Commit with descriptive message

## 📐 Code Style

### JavaScript

```javascript
// Use const/let, not var
const habitName = 'Exercise';
let completionCount = 0;

// Use arrow functions when appropriate
const calculateStats = (habit) => {
    return StatsCalculator.calculateStats(habit, completions);
};

// Use template literals
console.log(`Loading ${habitName}`);

// Add comments for complex logic
// Calculate the average completion rate over the last 30 days
const avgRate = calculateAverage(completions, 30);
```

### CSS

```css
/* Use kebab-case for class names */
.habit-card {
    padding: 16px;
}

/* Group related properties */
.habit-card {
    /* Layout */
    display: flex;
    flex-direction: column;
    
    /* Spacing */
    padding: 16px;
    margin-bottom: 12px;
    
    /* Visual */
    background: var(--background-secondary);
    border-radius: 8px;
}

/* Use CSS variables for theming */
.habit-card {
    color: var(--text-normal);
    background: var(--background-secondary);
}
```

### Error Handling

Always wrap risky operations in try-catch:

```javascript
async loadData() {
    try {
        const data = await this.loadFile();
        
        if (!this.validateData(data)) {
            throw new Error('Invalid data');
        }
        
        return data;
    } catch (error) {
        console.error('Load failed:', error);
        return this.getDefaultData();
    }
}
```

## 🧪 Testing

Before submitting:

1. **Manual Testing**
   - Create/edit/delete habits
   - Mark habits complete/incomplete
   - View calendar and dashboard
   - Test all commands
   - Check on mobile (if possible)

2. **Edge Cases**
   - Empty state (no habits)
   - Large dataset (100+ habits)
   - Corrupted data
   - Missing data

3. **Console Check**
   - No errors in console
   - No warnings
   - No memory leaks

## 📚 Documentation

Update documentation when changing:

- Features → Update README.md
- Commands → Update usage section
- Settings → Update configuration docs
- API → Update technical docs

## 🎨 UI/UX Guidelines

### Design Principles

1. **Consistency** - Match Obsidian's design language
2. **Clarity** - Clear labels and intuitive interactions
3. **Performance** - Fast and responsive
4. **Accessibility** - Keyboard navigation, screen readers

### Color Usage

```css
/* Use Obsidian's CSS variables */
--text-normal        /* Primary text */
--text-muted         /* Secondary text */
--background-primary /* Main background */
--background-secondary /* Cards, panels */
--interactive-accent /* Buttons, links */
```

### Icons

- Use Lucide icons when possible
- Keep icons consistent in size
- Add tooltips for icon-only buttons

## 🔍 Code Review Process

Pull requests will be reviewed for:

1. **Functionality** - Does it work as intended?
2. **Code Quality** - Is it readable and maintainable?
3. **Performance** - Is it efficient?
4. **Security** - Are there any vulnerabilities?
5. **Documentation** - Are changes documented?

## 📦 Pull Request Checklist

Before submitting:

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Manual testing done
- [ ] No console errors
- [ ] Commit messages are descriptive

## 🏷️ Commit Messages

Use conventional commits:

```
feat: Add CSV export functionality
fix: Resolve calendar alignment issue
docs: Update installation instructions
style: Format code with prettier
refactor: Simplify stats calculation
perf: Optimize rendering performance
test: Add validation tests
chore: Update dependencies
```

## 🔄 Branch Naming

```
feature/add-csv-export
fix/calendar-alignment
docs/update-readme
refactor/stats-calculator
```

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## ❓ Questions?

- Open an issue with the "question" label
- Join discussions on GitHub Discussions
- Ask on the Obsidian forum

## 🙏 Thank You!

Every contribution, no matter how small, helps improve Habit Tracker for everyone!

---

**Happy contributing! 🎉**
