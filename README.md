# Habit Tracker for Obsidian

A powerful and beautiful habit tracking plugin for Obsidian with advanced analytics and visual insights.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Obsidian](https://img.shields.io/badge/obsidian-0.15.0%2B-purple)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 📅 Calendar View
- **Visual habit tracking** with daily completion indicators
- **Color-coded days**: Green (100%), Yellow (partial), Red (0%)
- **Click any day** to view and manage habits
- **Today highlighting** for quick access

### 📊 Advanced Analytics Dashboard
- **Monthly heatmap** showing completion patterns
- **Weekday analysis** to identify strong/weak days
- **Trend visualization** with interactive line charts
- **Streak tracking** (current & longest streaks)
- **Habit cards** with detailed statistics

### 🎯 Habit Management
- **Multiple habit statuses**: Active, Automated, Achieved, Obsolete, Cancelled, Failed
- **Custom icons** (emoji) for each habit
- **Color coding** for visual organization
- **Date ranges** for time-limited habits
- **Notes** on individual completions

### 📈 Statistics
- Completion rate percentage
- Total days tracked
- Current and longest streaks
- Habit lifetime tracking
- Weekly patterns analysis

## 🚀 Installation

### From Obsidian Community Plugins (Recommended)
1. Open Obsidian Settings
2. Go to **Community Plugins** → **Browse**
3. Search for **"Habit Tracker"**
4. Click **Install**, then **Enable**

### Manual Installation
1. Download the [latest release](https://github.com/YOUR_USERNAME/obsidian-habit-tracker/releases)
2. Extract files to your vault: `VaultFolder/.obsidian/plugins/habit-tracker/`
3. Reload Obsidian
4. Enable "Habit Tracker" in Settings → Community Plugins

## 📖 Usage

### Getting Started

1. **Open Habit Tracker**
   - Click the ✓ icon in the left sidebar, or
   - Use Command Palette (`Ctrl/Cmd + P`) → "Open Habit Tracker"

2. **Create Your First Habit**
   - Click **"+ Add Habit"**
   - Enter name (e.g., "Morning Exercise")
   - Choose an emoji icon 💪
   - Select a color
   - Set start date
   - Click **Save**

3. **Track Daily Progress**
   - Check off habits as you complete them
   - Click any calendar day to mark past habits
   - Add notes to track details

4. **View Analytics**
   - Click the 📊 icon to open Dashboard
   - Explore heatmaps, trends, and streaks
   - Filter by time period and status

### Quick Actions

**Keyboard Shortcuts** (configurable in Settings):
- Open Tracker: Set your preferred hotkey
- Add New Habit: Quick habit creation
- Mark Today's Habits: Rapid daily logging
- Open Dashboard: View analytics

**Right-click Context Menu**:
- Quick access to habit details
- Edit habit properties
- Change status

## 🎨 Features in Detail

### Calendar Heatmap
Visualize your entire month at a glance:
- **Dark Green**: 100% completion - perfect day!
- **Light Green**: >50% completion - good progress
- **Yellow**: 1-50% completion - partial success
- **Red**: 0% completion - needs attention
- **Gray**: No habits tracked

### Dashboard Analytics

**1. Key Metrics**
- Total habits, active habits, automated habits
- Monthly progress percentage

**2. Monthly Heatmap**
- Day-by-day completion visualization
- Click any day to see details

**3. Deep Analytics**
- **Weekday Patterns**: Identify which days you're most consistent
- **Monthly Trend**: See your progress over time
- **Streak Analysis**: Current vs. best streaks for each habit

**4. Habit Cards**
- Individual card for each habit
- Progress bar with completion %
- Statistics: total days, completed, streaks
- Quick access to details

### Habit Statuses

- **🟢 Active**: Currently tracking
- **🤖 Automated**: Habit is now automatic (21+ day streak)
- **✅ Achieved**: Goal completed!
- **📦 Obsolete**: No longer relevant
- **🚫 Cancelled**: Consciously stopped
- **❌ Failed**: Didn't work out (learning experience)

## 🔧 Configuration

### Settings

Access plugin settings in Obsidian Settings → Habit Tracker:

- **First day of week**: Monday or Sunday
- **Default view**: Calendar or Dashboard
- **Show completed habits**: Include in today's list
- **Auto-save interval**: Frequency of automatic saves

### Customization

**Custom Emoji Icons**: Choose from 20+ built-in emojis or use any emoji

**Color Schemes**: 12 pre-defined colors for habit categorization

**Date Ranges**: Set start and optional end dates for habits

## 💾 Data Storage

All data is stored locally in your vault:
- Location: `.obsidian/plugins/habit-tracker/data.json`
- Format: JSON (human-readable)
- Backup: Automatic backups created on save
- Sync: Compatible with Obsidian Sync, iCloud, etc.

### Data Structure
```json
{
  "version": "1.0.0",
  "habits": [
    {
      "id": "habit_123",
      "name": "Morning Exercise",
      "icon": "💪",
      "color": "#4ECDC4",
      "startDate": "2024-01-01",
      "status": "active"
    }
  ],
  "completions": [
    {
      "habitId": "habit_123",
      "date": "2024-01-01",
      "completed": true,
      "note": "30 min workout"
    }
  ]
}
```

## 🛠️ Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/obsidian-habit-tracker.git
cd obsidian-habit-tracker

# Install dependencies
npm install

# Build
npm run build

# Development mode (auto-rebuild)
npm run dev
```

### Project Structure
```
obsidian-habit-tracker/
├── main.js          # Main plugin code
├── styles.css       # Styling
├── manifest.json    # Plugin metadata
├── versions.json    # Version compatibility
└── README.md        # Documentation
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Bug Reports
Please use GitHub Issues and include:
- Obsidian version
- Plugin version
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots (if applicable)

## 📝 Changelog

### Version 1.0.0 (2024-02-27)
- Initial release
- Calendar view with daily tracking
- Advanced analytics dashboard
- Multiple habit statuses
- Streak tracking
- Monthly heatmap
- Habit cards with statistics
- Data validation and error handling
- Automatic backups

## 🙏 Acknowledgments

- Inspired by habit tracking methodologies
- Built with the [Obsidian API](https://github.com/obsidianmd/obsidian-api)
- Icons from standard emoji set

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/obsidian-habit-tracker/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/obsidian-habit-tracker/discussions)
- **Obsidian Forum**: [Plugin Thread](https://forum.obsidian.md/)

## 🌟 Show Your Support

If you find this plugin helpful, please:
- ⭐ Star the repository
- 🐛 Report bugs
- 💡 Suggest features
- 📢 Share with others

---

**Made with ❤️ for the Obsidian community**
