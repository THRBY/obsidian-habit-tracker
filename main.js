const { Plugin, ItemView, Modal, Setting, Notice } = require('obsidian');

// ============= КОНСТАНТЫ И ТИПЫ =============
const CALENDAR_VIEW_TYPE = 'habit-tracker-calendar';
const DASHBOARD_VIEW_TYPE = 'habit-tracker-dashboard';

const HabitStatus = {
    ACTIVE: 'active',
    COMPLETED: 'completed',
    OBSOLETE: 'obsolete',
    AUTOMATED: 'automated',
    ACHIEVED: 'achieved',      // Цель достигнута
    CANCELLED: 'cancelled',    // Отменена
    FAILED: 'failed'           // Не получилось
};

const DEFAULT_SETTINGS = {
    defaultView: 'calendar',
    firstDayOfWeek: 1,
    showCompletedHabits: true,
    showAutomatedHabits: false
};

// ============= PRODUCTION CONSTANTS =============
const PLUGIN_VERSION = '1.0.0';
const DATA_VERSION = '1.0.0';

const ERROR_MESSAGES = {
    LOAD_FAILED: '❌ Failed to load habit data',
    SAVE_FAILED: '❌ Failed to save data',
    RENDER_FAILED: '⚠️ Component failed to load',
    INVALID_DATA: '⚠️ Data corrupted, using backup',
    NO_BACKUP: 'No backup available'
};

const THRESHOLDS = {
    HEATMAP: { FULL: 100, MEDIUM: 50, LOW: 0 },
    PERCENT: { MIN: 0, MAX: 100, EXCELLENT: 80, GOOD: 60, FAIR: 40 }
};

// ============= LOCALIZATION / ЛОКАЛИЗАЦИЯ =============
class LocalizationManager {
    static currentLocale = null;
    
    static detectLocale() {
        // Определяем язык из интерфейса Obsidian — всегда перечитываем, чтобы
        // реагировать на смену языка в настройках Obsidian без перезагрузки плагина
        try {
            // @ts-ignore - moment.locale() доступен в Obsidian
            const obsidianLocale = window.moment?.locale() || 'en';
            this.currentLocale = obsidianLocale.startsWith('ru') ? 'ru' : 'en';
        } catch (error) {
            this.currentLocale = 'en';
        }
        return this.currentLocale;
    }
    
    static t(key) {
        // Всегда перечитываем локаль — ловим смену языка в Obsidian на лету
        this.detectLocale();
        
        const translations = this.translations[this.currentLocale] || this.translations['en'];
        return translations[key] || key;
    }
    
    static translations = {
        en: {
            // Plugin
            'plugin.loading': 'Loading Habit Tracker Plugin',
            'plugin.loaded': 'Habit Tracker Plugin loaded successfully',
            'plugin.unloading': 'Unloading Habit Tracker Plugin',
            
            // Commands
            'command.open': 'Open Habit Tracker',
            'command.add': 'Add New Habit',
            'command.today': 'Mark Today\'s Habits',
            'command.dashboard': 'Open Statistics Dashboard',
            'command.export': 'Export Dashboard Report',
            
            // Ribbon
            'ribbon.open': 'Open Habit Tracker',
            
            // Calendar
            'calendar.title': 'Habit Tracker',
            'calendar.today': 'Today',
            'calendar.habits_today': 'Today\'s Habits',
            'calendar.add_habit': '+ Add Habit',
            'calendar.no_habits': 'No active habits',
            
            // Days of week
            'day.mon': 'Mon',
            'day.tue': 'Tue',
            'day.wed': 'Wed',
            'day.thu': 'Thu',
            'day.fri': 'Fri',
            'day.sat': 'Sat',
            'day.sun': 'Sun',
            
            // Months
            'month.0': 'January',
            'month.1': 'February',
            'month.2': 'March',
            'month.3': 'April',
            'month.4': 'May',
            'month.5': 'June',
            'month.6': 'July',
            'month.7': 'August',
            'month.8': 'September',
            'month.9': 'October',
            'month.10': 'November',
            'month.11': 'December',
            
            // Dashboard
            'dashboard.title': '📊 Habit Dashboard',
            'dashboard.filters': 'Filters',
            'dashboard.period': 'Period:',
            'dashboard.status': 'Status:',
            'dashboard.period.7': 'Last 7 days',
            'dashboard.period.30': 'Last 30 days',
            'dashboard.period.90': 'Last 90 days',
            'dashboard.period.all': 'All time',
            'dashboard.status.all': 'All statuses',
            'dashboard.kpi': 'Key Metrics (Month)',
            'dashboard.total': 'Total Habits',
            'dashboard.active': 'Active',
            'dashboard.automated': 'Automated',
            'dashboard.progress': 'Overall Progress (Month)',
            'dashboard.heatmap': '2. Monthly Heatmap',
            'dashboard.analytics': '3. Deep Analytics & Patterns',
            'dashboard.weekday': 'Average Progress by Weekday',
            'dashboard.trend': 'Monthly Trend (Completed Habits)',
            'dashboard.streaks': 'Streaks: Current / Best',
            'dashboard.cards': '4. Habit Details (Habit-by-Habit View)',
            'dashboard.no_habits': 'No active habits to display',
            
            // Habit Modal
            'habit.new': 'New Habit',
            'habit.edit': 'Edit Habit',
            'habit.name': 'Name',
            'habit.description': 'Description',
            'habit.icon': 'Icon (emoji)',
            'habit.color': 'Color',
            'habit.start': 'Start Date',
            'habit.end': 'End Date (optional)',
            'habit.save': 'Save',
            'habit.cancel': 'Cancel',
            'habit.delete': 'Delete',
            
            // Status
            'status.active': 'Active',
            'status.automated': 'Automated',
            'status.achieved': 'Achieved',
            'status.obsolete': 'Obsolete',
            'status.cancelled': 'Cancelled',
            'status.failed': 'Failed',
            
            // Stats
            'stats.total_days': 'Total days:',
            'stats.completed': 'Completed:',
            'stats.current_streak': 'Current streak:',
            'stats.best_streak': 'Best streak:',
            'stats.lifetime': 'Lifetime:',
            'stats.days': 'days',
            'stats.statistics': '📊 Statistics:',
            
            // Buttons
            'button.details': '📈 Details',
            'button.back': '← Back to Dashboard',
            'button.edit': 'Edit',
            
            // Notifications
            'notice.saved': 'Habit saved',
            'notice.deleted': 'Habit deleted',
            'notice.status_updated': 'Status updated',
            'notice.confirm_delete': 'Are you sure you want to delete this habit? All data will be lost.',
            
            // Errors
            'error.name_required': 'Please enter a habit name',
            'error.load_failed': '❌ Failed to load habit data',
            'error.save_failed': '❌ Failed to save data',
            'error.invalid_data': '⚠️ Data corrupted, using backup',
            'error.no_backup': 'No backup available',
            'error.action_failed': '⚠️ Action failed',
            
            // Day modal
            'day.habits_on': 'Habits on',
            'day.no_habits': 'No habits on this day',
            'day.add_note': 'Add note',
            
            // Heatmap legend
            'legend.full': '100%',
            'legend.medium': '>50%',
            'legend.low': '1-50%',
            'legend.zero': '0%',
            
            // Weak point
            'weak_point': 'Weak Point'
        },
        
        ru: {
            // Plugin
            'plugin.loading': 'Загрузка плагина Habit Tracker',
            'plugin.loaded': 'Плагин Habit Tracker успешно загружен',
            'plugin.unloading': 'Выгрузка плагина Habit Tracker',
            
            // Commands
            'command.open': 'Открыть трекер привычек',
            'command.add': 'Добавить новую привычку',
            'command.today': 'Отметить привычки на сегодня',
            'command.dashboard': 'Открыть дашборд статистики',
            'command.export': 'Экспортировать отчёт',
            
            // Ribbon
            'ribbon.open': 'Открыть трекер привычек',
            
            // Calendar
            'calendar.title': 'Трекер привычек',
            'calendar.today': 'Сегодня',
            'calendar.habits_today': 'Привычки на сегодня',
            'calendar.add_habit': '+ Добавить привычку',
            'calendar.no_habits': 'Нет активных привычек',
            
            // Days of week
            'day.mon': 'Пн',
            'day.tue': 'Вт',
            'day.wed': 'Ср',
            'day.thu': 'Чт',
            'day.fri': 'Пт',
            'day.sat': 'Сб',
            'day.sun': 'Вс',
            
            // Months
            'month.0': 'Январь',
            'month.1': 'Февраль',
            'month.2': 'Март',
            'month.3': 'Апрель',
            'month.4': 'Май',
            'month.5': 'Июнь',
            'month.6': 'Июль',
            'month.7': 'Август',
            'month.8': 'Сентябрь',
            'month.9': 'Октябрь',
            'month.10': 'Ноябрь',
            'month.11': 'Декабрь',
            
            // Dashboard
            'dashboard.title': '📊 Дашборд привычек',
            'dashboard.filters': 'Фильтры',
            'dashboard.period': 'Период:',
            'dashboard.status': 'Статус:',
            'dashboard.period.7': 'Последние 7 дней',
            'dashboard.period.30': 'Последние 30 дней',
            'dashboard.period.90': 'Последние 90 дней',
            'dashboard.period.all': 'Всё время',
            'dashboard.status.all': 'Все статусы',
            'dashboard.kpi': 'Ключевые показатели (месяц)',
            'dashboard.total': 'Всего привычек',
            'dashboard.active': 'Активных',
            'dashboard.automated': 'Автоматизированных',
            'dashboard.progress': 'Общий прогресс (месяц)',
            'dashboard.heatmap': '2. Тепловая карта месяца',
            'dashboard.analytics': '3. Глубокая аналитика и паттерны',
            'dashboard.weekday': 'Средний прогресс по дням недели',
            'dashboard.trend': 'Тенденция за месяц (выполнено привычек)',
            'dashboard.streaks': 'Серии выполнений: Текущая / Лучшая',
            'dashboard.cards': '4. Детализация по привычкам (Habit-by-Habit View)',
            'dashboard.no_habits': 'Нет активных привычек для отображения',
            
            // Habit Modal
            'habit.new': 'Новая привычка',
            'habit.edit': 'Редактировать привычку',
            'habit.name': 'Название',
            'habit.description': 'Описание',
            'habit.icon': 'Иконка (эмодзи)',
            'habit.color': 'Цвет',
            'habit.start': 'Дата начала',
            'habit.end': 'Дата окончания (необязательно)',
            'habit.save': 'Сохранить',
            'habit.cancel': 'Отмена',
            'habit.delete': 'Удалить',
            
            // Status
            'status.active': '🟢 Активная',
            'status.automated': '🤖 Автоматизирована',
            'status.achieved': '✅ Цель достигнута',
            'status.obsolete': '📦 Устарела',
            'status.cancelled': '🚫 Отменена',
            'status.failed': '❌ Не получилось',
            
            // Stats
            'stats.total_days': 'Всего дней:',
            'stats.completed': 'Выполнено:',
            'stats.current_streak': 'Текущая серия:',
            'stats.best_streak': 'Лучшая серия:',
            'stats.lifetime': 'Срок жизни:',
            'stats.days': 'дней',
            'stats.statistics': '📊 Статистика:',
            
            // Buttons
            'button.details': '📈 Подробнее',
            'button.back': '← Назад к дашборду',
            'button.edit': 'Редактировать',
            
            // Notifications
            'notice.saved': 'Привычка сохранена',
            'notice.deleted': 'Привычка удалена',
            'notice.status_updated': 'Статус обновлен',
            'notice.confirm_delete': 'Вы уверены, что хотите удалить эту привычку? Все данные будут потеряны.',
            
            // Errors
            'error.name_required': 'Укажите название привычки',
            'error.load_failed': '❌ Не удалось загрузить данные',
            'error.save_failed': '❌ Не удалось сохранить данные',
            'error.invalid_data': '⚠️ Данные повреждены, используется backup',
            'error.no_backup': 'Нет резервной копии',
            'error.action_failed': '⚠️ Действие не выполнено',
            
            // Day modal
            'day.habits_on': 'Привычки на',
            'day.no_habits': 'Нет привычек на этот день',
            'day.add_note': 'Добавить заметку',
            
            // Heatmap legend
            'legend.full': '100%',
            'legend.medium': '>50%',
            'legend.low': '1-50%',
            'legend.zero': '0%',
            
            // Weak point
            'weak_point': 'Слабое место'
        }
    };
}

// Инициализируем локаль при загрузке
LocalizationManager.detectLocale();

// Удобная сокращённая функция для перевода
const t = (key) => LocalizationManager.t(key);

// ============= УТИЛИТЫ ДЛЯ РАБОТЫ С ДАТАМИ =============
class DateUtils {
    static formatDate(date) {
        // Используем локальное время вместо UTC
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    static parseDate(dateStr) {
        // Парсим как локальную дату
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    static isToday(date) {
        return date === this.formatDate(new Date());
    }

    static getDaysDifference(date1, date2) {
        const d1 = this.parseDate(date1);
        const d2 = this.parseDate(date2);
        const diffTime = Math.abs(d2.getTime() - d1.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    static addDays(date, days) {
        const d = this.parseDate(date);
        d.setDate(d.getDate() + days);
        return this.formatDate(d);
    }

    static getDateRange(startDate, endDate) {
        const dates = [];
        const start = this.parseDate(startDate);
        const end = this.parseDate(endDate);
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            dates.push(this.formatDate(d));
        }
        
        return dates;
    }

    static getMonthName(month) {
        return t(`month.${month}`);
    }
}

// ============= DATA VALIDATOR =============
class DataValidator {
    static validateHabit(habit) {
        if (!habit || typeof habit !== 'object') return false;
        
        const required = ['id', 'name', 'startDate', 'status'];
        for (const field of required) {
            if (!habit[field]) {
                console.warn(`Missing required field: ${field}`);
                return false;
            }
        }
        
        if (!this.isValidDate(habit.startDate)) {
            console.warn('Invalid startDate:', habit.startDate);
            return false;
        }
        
        if (habit.endDate && !this.isValidDate(habit.endDate)) {
            console.warn('Invalid endDate:', habit.endDate);
            return false;
        }
        
        const validStatuses = Object.values(HabitStatus);
        if (!validStatuses.includes(habit.status)) {
            console.warn('Invalid status:', habit.status);
            return false;
        }
        
        return true;
    }
    
    static validateCompletion(completion) {
        if (!completion || typeof completion !== 'object') return false;
        if (!completion.habitId || !completion.date) return false;
        if (!this.isValidDate(completion.date)) return false;
        if (typeof completion.completed !== 'boolean') return false;
        return true;
    }
    
    static validateData(data) {
        try {
            if (!data || typeof data !== 'object') {
                console.error('Data is not an object');
                return false;
            }
            
            if (!Array.isArray(data.habits)) {
                console.error('habits is not an array');
                return false;
            }
            
            if (!Array.isArray(data.completions)) {
                console.error('completions is not an array');
                return false;
            }
            
            for (const habit of data.habits) {
                if (!this.validateHabit(habit)) return false;
            }
            
            for (const completion of data.completions) {
                if (!this.validateCompletion(completion)) return false;
            }
            
            return true;
        } catch (error) {
            console.error('Validation error:', error);
            return false;
        }
    }
    
    static isValidDate(dateStr) {
        if (typeof dateStr !== 'string') return false;
        const date = DateUtils.parseDate(dateStr);
        return date instanceof Date && !isNaN(date.getTime());
    }
    
    static sanitizeHabitName(name) {
        if (typeof name !== 'string') return 'Unnamed Habit';
        return name
            .replace(/<script[^>]*>.*?<\/script>/gi, '')
            .replace(/<[^>]+>/g, '')
            .trim()
            .substring(0, 200) || 'Unnamed Habit';
    }
}

// ============= КАЛЬКУЛЯТОР СТАТИСТИКИ =============
class StatsCalculator {
    static calculateStats(habit, completions) {
        const habitCompletions = completions.filter(c => c.habitId === habit.id);
        const today = DateUtils.formatDate(new Date());
        const startDate = habit.startDate;
        
        const totalDays = DateUtils.getDaysDifference(startDate, today) + 1;
        const completedDays = habitCompletions.filter(c => c.completed).length;
        const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
        
        const streaks = this.calculateStreaks(habit, habitCompletions);
        
        const lastCompleted = habitCompletions
            .filter(c => c.completed)
            .sort((a, b) => b.date.localeCompare(a.date))[0];
        
        return {
            habitId: habit.id,
            totalDays,
            completedDays,
            currentStreak: streaks.current,
            longestStreak: streaks.longest,
            completionRate: Math.round(completionRate * 100) / 100,
            lastCompletedDate: lastCompleted?.date
        };
    }

    /**
     * Статистика за конкретный период [periodStart, periodEnd] (оба включительно).
     * Период автоматически ограничивается датой начала привычки.
     */
    static calculatePeriodStats(habit, completions, periodStart, periodEnd) {
        // Нормализуем порядок дат на случай, если придут перепутанные границы
        if (periodEnd < periodStart) {
            const tmp = periodStart;
            periodStart = periodEnd;
            periodEnd = tmp;
        }

        const habitCompletions = completions.filter(c => c.habitId === habit.id);

        // Реальный старт: не раньше старта привычки
        const effectiveStart = habit.startDate && habit.startDate > periodStart
            ? habit.startDate
            : periodStart;

        // Если привычка началась позже конца периода — для неё в этом периоде нет дней
        if (effectiveStart > periodEnd) {
            return {
                habitId: habit.id,
                totalDays: 0,
                completedDays: 0,
                currentStreak: 0,
                longestStreak: 0,
                completionRate: 0,
                lastCompletedDate: undefined
            };
        }

        const allDates = DateUtils.getDateRange(effectiveStart, periodEnd);

        const completedEntries = habitCompletions.filter(c =>
            c.completed &&
            c.date >= effectiveStart &&
            c.date <= periodEnd
        );

        const completedDatesSet = new Set(completedEntries.map(c => c.date));

        const totalDays = allDates.length;
        const completedDays = completedEntries.length;
        const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

        // Серии внутри периода
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        // Если последний день периода (сегодня) ещё не выполнен — начинаем со предпоследнего
        const today = DateUtils.formatDate(new Date());
        const lastPeriodDate = allDates[allDates.length - 1];
        const startStreakIdx = (lastPeriodDate === today && !completedDatesSet.has(today))
            ? allDates.length - 2
            : allDates.length - 1;

        // Текущая серия: от конца к началу
        for (let i = startStreakIdx; i >= 0; i--) {
            if (completedDatesSet.has(allDates[i])) {
                currentStreak++;
            } else {
                break;
            }
        }

        // Лучшая серия: от начала к концу
        for (const date of allDates) {
            if (completedDatesSet.has(date)) {
                tempStreak++;
                longestStreak = Math.max(longestStreak, tempStreak);
            } else {
                tempStreak = 0;
            }
        }

        const lastCompleted = completedEntries
            .slice()
            .sort((a, b) => b.date.localeCompare(a.date))[0];

        return {
            habitId: habit.id,
            totalDays,
            completedDays,
            currentStreak,
            longestStreak,
            completionRate: Math.round(completionRate * 100) / 100,
            lastCompletedDate: lastCompleted?.date
        };
    }

    static calculateStreaks(habit, completions) {
        const today = DateUtils.formatDate(new Date());
        const startDate = habit.startDate;
        
        const allDates = DateUtils.getDateRange(startDate, today);
        const completedDates = new Set(
            completions.filter(c => c.completed).map(c => c.date)
        );
        
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        
        // Если сегодня ещё не выполнено — начинаем серию со вчера,
        // чтобы серия не обнулялась до конца текущего дня
        const lastIdx = completedDates.has(today)
            ? allDates.length - 1
            : allDates.length - 2;

        for (let i = lastIdx; i >= 0; i--) {
            if (completedDates.has(allDates[i])) {
                currentStreak++;
            } else {
                break;
            }
        }
        
        for (const date of allDates) {
            if (completedDates.has(date)) {
                tempStreak++;
                longestStreak = Math.max(longestStreak, tempStreak);
            } else {
                tempStreak = 0;
            }
        }
        
        return { current: currentStreak, longest: longestStreak };
    }

    static getLifetimeDays(habit) {
        const today = DateUtils.formatDate(new Date());
        return DateUtils.getDaysDifference(habit.createdDate, today) + 1;
    }
}

// ============= МЕНЕДЖЕР ПРИВЫЧЕК =============
class HabitManager {
    constructor(data) {
        this.data = data;
    }

    createHabit(name, description, startDate, endDate, icon, color) {
        const habit = {
            id: this.generateId(),
            name,
            description,
            status: HabitStatus.ACTIVE,
            createdDate: DateUtils.formatDate(new Date()),
            startDate: startDate || DateUtils.formatDate(new Date()),
            endDate,
            color: color || this.getRandomColor(),
            icon: icon || '✓'
        };

        this.data.habits.push(habit);
        return habit;
    }

    updateHabit(habitId, updates) {
        const habit = this.getHabit(habitId);
        if (!habit) return null;
        Object.assign(habit, updates);
        return habit;
    }

    deleteHabit(habitId) {
        const index = this.data.habits.findIndex(h => h.id === habitId);
        if (index === -1) return false;
        this.data.habits.splice(index, 1);
        this.data.completions = this.data.completions.filter(c => c.habitId !== habitId);
        return true;
    }

    getHabit(habitId) {
        return this.data.habits.find(h => h.id === habitId);
    }

    getAllHabits() {
        return this.data.habits;
    }

    getHabitsByDate(date) {
        return this.data.habits.filter(h => {
            // Исключаем все неактивные статусы из отображения в календаре
            if (
                h.status === HabitStatus.AUTOMATED ||
                h.status === HabitStatus.OBSOLETE  ||
                h.status === HabitStatus.ACHIEVED  ||
                h.status === HabitStatus.CANCELLED ||
                h.status === HabitStatus.FAILED
            ) {
                return false;
            }
            if (date < h.startDate) return false;
            if (h.endDate && date > h.endDate) return false;
            return true;
        });
    }

    toggleCompletion(habitId, date) {
        const existing = this.getCompletion(habitId, date);
        if (existing) {
            existing.completed = !existing.completed;
            return existing;
        }
        const completion = { habitId, date, completed: true };
        this.data.completions.push(completion);
        return completion;
    }

    setCompletion(habitId, date, completed, note) {
        const existing = this.getCompletion(habitId, date);
        if (existing) {
            existing.completed = completed;
            if (note !== undefined) existing.note = note;
            return existing;
        }
        const completion = { habitId, date, completed, note };
        this.data.completions.push(completion);
        return completion;
    }

    getCompletion(habitId, date) {
        return this.data.completions.find(c => c.habitId === habitId && c.date === date);
    }

    isCompleted(habitId, date) {
        const completion = this.getCompletion(habitId, date);
        return completion?.completed || false;
    }

    getCompletionsForHabit(habitId) {
        return this.data.completions.filter(c => c.habitId === habitId);
    }

    generateId() {
        return `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    getRandomColor() {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
            '#FFEAA7', '#DFE6E9', '#A29BFE', '#FD79A8',
            '#FDCB6E', '#6C5CE7', '#00B894', '#E17055'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    getData() {
        return this.data;
    }
}

// ============= КАЛЕНДАРЬ =============
class CalendarView extends ItemView {
    constructor(leaf, plugin) {
        super(leaf);
        this.plugin = plugin;
        this.currentDate = new Date();
    }

    getViewType() {
        return CALENDAR_VIEW_TYPE;
    }

    getDisplayText() {
        return 'Трекер привычек';
    }

    getIcon() {
        return 'check-circle';
    }

    async onOpen() {
        this.render();
    }

    async onClose() {}

    render() {
        const container = this.containerEl.children[1];
        container.empty();
        container.addClass('habit-tracker-view');

        this.renderHeader(container);
        this.renderCalendar(container);
        this.renderTodayHabits(container);
    }

    renderHeader(container) {
        const header = container.createDiv('habit-tracker-header');
        
        const prevBtn = header.createEl('button', { text: '◀' });
        prevBtn.onclick = () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.render();
        };

        const monthYear = header.createDiv('habit-tracker-month-year');
        monthYear.setText(
            `${DateUtils.getMonthName(this.currentDate.getMonth())} ${this.currentDate.getFullYear()}`
        );

        const nextBtn = header.createEl('button', { text: '▶' });
        nextBtn.onclick = () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.render();
        };

        const todayBtn = header.createEl('button', { text: 'Сегодня', cls: 'today-btn' });
        todayBtn.onclick = () => {
            this.currentDate = new Date();
            this.render();
        };

        const dashboardBtn = header.createEl('button', { text: '📊', cls: 'dashboard-btn' });
        dashboardBtn.onclick = () => {
            this.plugin.openDashboard();
        };
    }

    renderCalendar(container) {
        const calendar = container.createDiv('habit-tracker-calendar');
        
        const weekdays = calendar.createDiv('habit-tracker-weekdays');
        const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        dayNames.forEach(day => {
            weekdays.createDiv('habit-tracker-weekday').setText(day);
        });

        const days = calendar.createDiv('habit-tracker-days');
        this.renderDays(days);
    }

    renderDays(container) {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // Правильное выравнивание для понедельника как первого дня
        // getDay(): 0=вс, 1=пн, 2=вт, 3=ср, 4=чт, 5=пт, 6=сб
        // Преобразуем: пн=0, вт=1, ср=2, чт=3, пт=4, сб=5, вс=6
        let firstDayOfWeek = firstDay.getDay();
        const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
        
        // Добавляем пустые ячейки
        for (let i = 0; i < offset; i++) {
            container.createDiv('habit-tracker-day empty');
        }

        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            const dateStr = DateUtils.formatDate(date);
            const dayEl = container.createDiv('habit-tracker-day');
            
            const today = DateUtils.formatDate(new Date());
            if (dateStr === today) {
                dayEl.addClass('today');
            }

            const dayNum = dayEl.createDiv('day-number');
            dayNum.setText(day.toString());

            const indicators = dayEl.createDiv('habit-indicators');
            this.renderHabitIndicators(indicators, dateStr);

            dayEl.onclick = () => {
                this.plugin.openDayModal(dateStr);
            };
        }
    }

    renderHabitIndicators(container, date) {
        const habits = this.plugin.habitManager.getHabitsByDate(date);
        if (habits.length === 0) return;

        let completed = 0;
        habits.forEach(habit => {
            if (this.plugin.habitManager.isCompleted(habit.id, date)) {
                completed++;
            }
        });

        const indicator = container.createDiv('completion-indicator');
        
        if (completed === habits.length && habits.length > 0) {
            indicator.addClass('all-completed');
            indicator.setText('✓');
        } else if (completed > 0) {
            indicator.addClass('partial-completed');
            indicator.setText(`${completed}/${habits.length}`);
        } else {
            indicator.addClass('none-completed');
            indicator.setText(`0/${habits.length}`);
        }
    }

    renderTodayHabits(container) {
        const section = container.createDiv('habit-tracker-today');
        const today = DateUtils.formatDate(new Date());
        
        section.createEl('h3', { text: 'Привычки на сегодня' });
        
        const habits = this.plugin.habitManager.getHabitsByDate(today)
            .filter(h => h.status === 'active');

        if (habits.length === 0) {
            section.createDiv('no-habits').setText('Нет активных привычек');
        } else {
            const list = section.createDiv('habit-list');
            habits.forEach(habit => {
                this.renderHabitItem(list, habit, today);
            });
        }

        // Кнопка добавления привычки показывается ВСЕГДА
        const addBtn = section.createEl('button', { 
            text: '+ Добавить привычку',
            cls: 'add-habit-btn'
        });
        addBtn.onclick = () => {
            this.plugin.openHabitModal();
        };
    }

    renderHabitItem(container, habit, date) {
        const item = container.createDiv('habit-item');
        
        const checkbox = item.createEl('input', { type: 'checkbox' });
        checkbox.checked = this.plugin.habitManager.isCompleted(habit.id, date);
        checkbox.onchange = () => {
            this.plugin.habitManager.toggleCompletion(habit.id, date);
            this.plugin.saveSettings();
            this.render();
        };

        const label = item.createDiv('habit-label');
        if (habit.icon) {
            label.createSpan('habit-icon').setText(habit.icon);
        }
        label.createSpan('habit-name').setText(habit.name);

        const detailsBtn = item.createEl('button', { 
            text: '...',
            cls: 'habit-details-btn'
        });
        detailsBtn.onclick = () => {
            this.plugin.openHabitDetailsModal(habit.id);
        };

        if (habit.color) {
            item.style.borderLeft = `3px solid ${habit.color}`;
        }
    }
}

// ============= ДАШБОРД =============
class DashboardView extends ItemView {
    constructor(leaf, plugin) {
        super(leaf);
        this.plugin = plugin;
        this.selectedPeriod = 30;
        this.selectedStatus = HabitStatus.ACTIVE; // по умолчанию — только активные
        // Выбранный месяц для дашборда
        const now = new Date();
        this.dashboardMonth = now.getMonth();
        this.dashboardYear = now.getFullYear();
    }

    getViewType() {
        return DASHBOARD_VIEW_TYPE;
    }

    getDisplayText() {
        return '📊 Дашборд';
    }

    getIcon() {
        return 'bar-chart-2';
    }

    async onOpen() {
        this.render();
    }

    async onClose() {}

    render() {
        const container = this.containerEl.children[1];
        container.empty();
        container.addClass('habit-tracker-dashboard-view');

        container.createEl('h1', { text: '📊 Дашборд привычек' });

        // --- Навигация по месяцам ---
        const monthNav = container.createDiv('dashboard-month-nav');
        const prevMonthBtn = monthNav.createEl('button', { text: '◀', cls: 'month-nav-btn' });
        prevMonthBtn.onclick = () => {
            if (this.dashboardMonth === 0) {
                this.dashboardMonth = 11;
                this.dashboardYear--;
            } else {
                this.dashboardMonth--;
            }
            this.render();
        };
        const monthLabel = monthNav.createDiv('month-nav-label');
        monthLabel.setText(`${DateUtils.getMonthName(this.dashboardMonth)} ${this.dashboardYear}`);
        const nextMonthBtn = monthNav.createEl('button', { text: '▶', cls: 'month-nav-btn' });
        nextMonthBtn.onclick = () => {
            if (this.dashboardMonth === 11) {
                this.dashboardMonth = 0;
                this.dashboardYear++;
            } else {
                this.dashboardMonth++;
            }
            this.render();
        };
        const todayMonthBtn = monthNav.createEl('button', { text: 'Текущий', cls: 'month-nav-today-btn' });
        todayMonthBtn.onclick = () => {
            const now = new Date();
            this.dashboardMonth = now.getMonth();
            this.dashboardYear = now.getFullYear();
            this.render();
        };

        this.renderOverallStats(container);
        this.renderMonthlyHeatmap(container);
        this.renderDeepAnalytics(container);
        this.renderHabitCards(container);
    }


    renderOverallStats(container) {
        const section = container.createDiv('dashboard-overall');
        section.createEl('h2', { text: 'Ключевые показатели (месяц)' });

        const habits = this.plugin.habitManager.getAllHabits();
        const activeHabits    = habits.filter(h => h.status === HabitStatus.ACTIVE);
        const automatedHabits = habits.filter(h => h.status === HabitStatus.AUTOMATED);
        const achievedHabits  = habits.filter(h => h.status === HabitStatus.ACHIEVED);
        const obsoleteHabits  = habits.filter(h => h.status === HabitStatus.OBSOLETE);
        const cancelledHabits = habits.filter(h => h.status === HabitStatus.CANCELLED);
        const failedHabits    = habits.filter(h => h.status === HabitStatus.FAILED);

        const grid = section.createDiv('stats-grid-overview');

        // При клике "Всего" — показываем ВСЕ привычки (selectedStatus = 'all')
        this.createStatCard(grid, 'Всего привычек',       habits.length.toString(),          'all',                    'all');
        this.createStatCard(grid, '🟢 Активных',          activeHabits.length.toString(),    HabitStatus.ACTIVE,       'active');
        this.createStatCard(grid, '🤖 Автоматизированных',automatedHabits.length.toString(), HabitStatus.AUTOMATED,    'automated');
        this.createStatCard(grid, '✅ Цель достигнута',   achievedHabits.length.toString(),  HabitStatus.ACHIEVED,     'achieved');
        this.createStatCard(grid, '📦 Устарело',          obsoleteHabits.length.toString(),  HabitStatus.OBSOLETE,     'obsolete');
        this.createStatCard(grid, '🚫 Отменено',          cancelledHabits.length.toString(), HabitStatus.CANCELLED,    'cancelled');
        this.createStatCard(grid, '❌ Не получилось',     failedHabits.length.toString(),    HabitStatus.FAILED,       'failed');

        const monthlyProgress = this.calculateMonthlyProgress();
        const progressCard = grid.createDiv('stat-card stat-card-progress');
        progressCard.createDiv('stat-card-label').setText('Общий прогресс (месяц)');
        const valueEl = progressCard.createDiv('stat-card-value');
        valueEl.setText(`${monthlyProgress.toFixed(0)}%`);
    }

    renderMonthlyHeatmap(container) {
        const section = container.createDiv('dashboard-heatmap');
        section.createEl('h2', { text: 'Прогресс по дням месяца' });

        const legend = section.createDiv('heatmap-legend');
        const legendItems = [
            { label: '100%', cls: 'heatmap-legend-full' },
            { label: '> 50%', cls: 'heatmap-legend-medium' },
            { label: '1–50%', cls: 'heatmap-legend-low' },
            { label: '0%', cls: 'heatmap-legend-zero' }
        ];
        legendItems.forEach(item => {
            const el = legend.createDiv('heatmap-legend-item');
            const dot = el.createDiv(`heatmap-legend-dot ${item.cls}`);
            el.createDiv('heatmap-legend-label').setText(item.label);
        });

        const grid = section.createDiv('heatmap-grid');

        const weekdaysRow = grid.createDiv('heatmap-weekdays');
        ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].forEach(d => {
            weekdaysRow.createDiv('heatmap-weekday').setText(d);
        });

        const daysContainer = grid.createDiv('heatmap-days');

        const year  = this.dashboardYear;
        const month = this.dashboardMonth;
        const firstDay = new Date(year, month, 1);
        const lastDay  = new Date(year, month + 1, 0);
        const todayStr = DateUtils.formatDate(new Date());

        // смещение, чтобы неделя начиналась с понедельника
        let firstDayOfWeek = firstDay.getDay(); // 0=вс
        const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

        for (let i = 0; i < offset; i++) {
            daysContainer.createDiv('heatmap-day heatmap-day-empty');
        }

        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            const dateStr = DateUtils.formatDate(date);

            const habitsForDay = this.plugin.habitManager.getHabitsByDate(dateStr);

            let percent = 0;
            if (habitsForDay.length > 0) {
                let totalForDay = 0;
                let completedForDay = 0;
                habitsForDay.forEach(habit => {
                    totalForDay += 1;
                    if (this.plugin.habitManager.isCompleted(habit.id, dateStr)) {
                        completedForDay += 1;
                    }
                });
                if (totalForDay > 0) {
                    percent = (completedForDay / totalForDay) * 100;
                }
            }

            const dayEl = daysContainer.createDiv('heatmap-day');
            const numEl = dayEl.createDiv('heatmap-day-number');
            numEl.setText(day.toString());

            if (habitsForDay.length === 0) {
                dayEl.addClass('heatmap-day-no-habits');
            } else if (percent === 100) {
                dayEl.addClass('heatmap-day-full');
            } else if (percent > 50) {
                dayEl.addClass('heatmap-day-medium');
            } else if (percent > 0) {
                dayEl.addClass('heatmap-day-low');
            } else {
                dayEl.addClass('heatmap-day-zero');
            }

            if (dateStr === todayStr) {
                dayEl.addClass('heatmap-day-today');
            }

            if (habitsForDay.length > 0) {
                const percentEl = dayEl.createDiv('heatmap-day-percent');
                percentEl.setText(`${Math.round(percent)}%`);
            }

            dayEl.onclick = () => {
                this.plugin.openDayModal(dateStr);
            };
        }
    }

    renderDeepAnalytics(container) {
        const section = container.createDiv('dashboard-analytics');
        section.createEl('h2', { text: 'Глубокая аналитика и паттерны' });

        const wrap = section.createDiv('analytics-grid');

        // ==== 1) Средний прогресс по дням текущей недели ====
        const weekdayCard = wrap.createDiv('analytics-card');
        weekdayCard.createEl('h3', { text: 'Прогресс по дням текущей недели' });
        const weekdayBars = weekdayCard.createDiv('weekday-vertical-bars');

        const weekdayStats = this.calculateWeekdayAveragesForMonth(); // [{label, percent}]
        
        weekdayStats.forEach(({ label, percent, isWeakPoint }) => {
            const col = weekdayBars.createDiv('weekday-bar-column');
            
            // Значение процента сверху
            const value = col.createDiv('weekday-bar-value-top');
            value.setText(`${percent.toFixed(0)}%`);
            
            // Вертикальный бар
            const barContainer = col.createDiv('weekday-bar-container');
            const bar = barContainer.createDiv('weekday-bar-vertical');
            bar.style.height = `${Math.max(5, percent)}%`;
            bar.style.background = this.getPercentColor(percent);
            
            // Метка "Слабое место" если применимо
            if (isWeakPoint && percent < 50) {
                const weakLabel = barContainer.createDiv('weak-point-label');
                weakLabel.setText('Слабое место');
            }
            
            // Название дня снизу
            const dayLabel = col.createDiv('weekday-bar-label-bottom');
            dayLabel.setText(label);
        });

        // ==== 2) Тренд за месяц (линейный график) ====
        const trendCard = wrap.createDiv('analytics-card');
        trendCard.createEl('h3', { text: 'Тенденция за месяц (Количество выполненных привычек)' });
        
        const trend = this.calculateMonthlyCompletionTrend(); // [{day, completed, total}]
        const maxCompleted = Math.max(1, ...trend.map(t => t.completed));
        
        const chartContainer = trendCard.createDiv('trend-line-chart');
        
        // SVG для линейного графика
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "120");
        svg.setAttribute("viewBox", "0 0 400 120");
        svg.style.overflow = "visible";
        
        // Рассчитываем точки для линии
        const points = trend.map((t, i) => {
            const x = (i / (trend.length - 1)) * 380 + 10;
            const y = 100 - (t.completed / maxCompleted) * 80;
            return { x, y, day: t.day, completed: t.completed, total: t.total };
        });
        
        // Рисуем линию
        const pathData = points.map((p, i) => 
            `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
        ).join(' ');
        
        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", pathData);
        path.setAttribute("stroke", "#4CAF50");
        path.setAttribute("stroke-width", "2");
        path.setAttribute("fill", "none");
        svg.appendChild(path);
        
        // Рисуем точки с hover
        points.forEach(p => {
            const circle = document.createElementNS(svgNS, "circle");
            circle.setAttribute("cx", p.x);
            circle.setAttribute("cy", p.y);
            circle.setAttribute("r", "4");
            circle.setAttribute("fill", "#4CAF50");
            circle.style.cursor = "pointer";
            
            // Tooltip при наведении
            circle.addEventListener('mouseenter', (e) => {
                const tooltip = chartContainer.querySelector('.trend-tooltip') || chartContainer.createDiv('trend-tooltip');
                tooltip.setText(`День ${p.day}: ${p.completed}/${p.total}`);
                tooltip.style.display = 'block';
                tooltip.style.left = `${e.clientX - chartContainer.getBoundingClientRect().left}px`;
                tooltip.style.top = `${e.clientY - chartContainer.getBoundingClientRect().top - 30}px`;
            });
            
            circle.addEventListener('mouseleave', () => {
                const tooltip = chartContainer.querySelector('.trend-tooltip');
                if (tooltip) tooltip.style.display = 'none';
            });
            
            svg.appendChild(circle);
        });
        
        // Добавляем метки дней по оси X (каждый 3-й день)
        const dayLabels = trendCard.createDiv('trend-day-labels');
        trend.forEach((t, i) => {
            if (i % 3 === 0 || i === trend.length - 1) {
                const label = dayLabels.createDiv('trend-day-label');
                label.setText(t.day.toString());
                label.style.left = `${(i / (trend.length - 1)) * 100}%`;
            }
        });
        
        chartContainer.appendChild(svg);

        // ==== 3) Серии выполнений: текущая / лучшая ====
        const streakCard = wrap.createDiv('analytics-card analytics-card-streaks');
        streakCard.createEl('h3', { text: 'Серии выполнений: Текущая / Лучшая' });
        const streakList = streakCard.createDiv('streak-list');

        const habits = this.plugin.habitManager
            .getAllHabits()
            .filter(h => h.status === HabitStatus.ACTIVE);

        // сортируем по лучшей серии (desc)
        const rows = habits
            .map(habit => {
                const completions = this.plugin.habitManager.getCompletionsForHabit(habit.id);
                const stats = StatsCalculator.calculateStats(habit, completions);
                return { habit, stats };
            })
            .sort((a, b) => (b.stats.longestStreak || 0) - (a.stats.longestStreak || 0));

        const maxLongest = Math.max(1, ...rows.map(r => r.stats.longestStreak || 0));

        rows.forEach(({ habit, stats }) => {
            const item = streakList.createDiv('streak-item-new');
            
            // Левая часть: иконка и название
            const left = item.createDiv('streak-left');
            left.createDiv('streak-name').setText(`${habit.icon || '•'} ${habit.name}`);
            
            // Правая часть: бары
            const right = item.createDiv('streak-right');
            
            // Внешний бар (лучшая серия) - серый фон
            const outerBar = right.createDiv('streak-bar-outer');
            outerBar.style.width = `${Math.round(((stats.longestStreak || 0) / maxLongest) * 100)}%`;
            
            // Внутренний бар (текущая серия) - цветной
            const innerBar = outerBar.createDiv('streak-bar-inner');
            const innerPercent = stats.longestStreak > 0 
                ? (stats.currentStreak / stats.longestStreak) * 100 
                : 0;
            innerBar.style.width = `${Math.min(100, innerPercent)}%`;
            if (habit.color) {
                innerBar.style.background = habit.color;
            }
            
            // Метка текущей серии внутри бара
            const currentLabel = innerBar.createDiv('streak-current-label');
            currentLabel.setText(stats.currentStreak.toString());
            
            // Метка лучшей серии в конце
            const longestLabel = right.createDiv('streak-longest-label');
            longestLabel.setText(stats.longestStreak.toString());
        });
    }

    renderHabitCards(container) {
        const section = container.createDiv('dashboard-habit-cards');
        section.createEl('h2', { text: '4. Детализация по привычкам (Habit-by-Habit View)' });

        // Применяем фильтр статуса
        let habits = this.plugin.habitManager.getAllHabits();
        if (this.selectedStatus && this.selectedStatus !== 'all') {
            habits = habits.filter(h => h.status === this.selectedStatus);
        }
        // Если выбрано 'all' — показываем все привычки (без фильтрации по статусу)

        // Сортируем: сначала по статусу (active первые), потом по проценту выполнения (desc)
        const statusOrder = {
            [HabitStatus.ACTIVE]: 0,
            [HabitStatus.AUTOMATED]: 1,
            [HabitStatus.ACHIEVED]: 2,
            [HabitStatus.OBSOLETE]: 3,
            [HabitStatus.CANCELLED]: 4,
            [HabitStatus.FAILED]: 5
        };

        const habitsWithStats = habits.map(habit => {
            const completions = this.plugin.habitManager.getCompletionsForHabit(habit.id);
            const stats = StatsCalculator.calculateStats(habit, completions);
            const lifetime = StatsCalculator.getLifetimeDays(habit);
            return { habit, stats, lifetime };
        }).sort((a, b) => {
            const orderDiff = (statusOrder[a.habit.status] ?? 9) - (statusOrder[b.habit.status] ?? 9);
            if (orderDiff !== 0) return orderDiff;
            return b.stats.completionRate - a.stats.completionRate;
        });

        if (habitsWithStats.length === 0) {
            section.createDiv('no-habits').setText('Нет привычек для отображения');
            return;
        }

        const cardsGrid = section.createDiv('habit-cards-grid');

        habitsWithStats.forEach(({ habit, stats, lifetime }) => {
            const card = cardsGrid.createDiv('habit-card');
            
            // Заголовок карточки с иконкой и названием
            const header = card.createDiv('habit-card-header');
            const title = header.createDiv('habit-card-title');
            if (habit.icon) {
                title.createSpan('habit-card-icon').setText(habit.icon);
            }
            title.createSpan('habit-card-name').setText(habit.name);
            
            // Статус (badge)
            const statusBadge = header.createDiv('habit-card-status');
            statusBadge.addClass(`status-${habit.status}`);
            statusBadge.setText(this.getStatusText(habit.status).replace(/[🟢🤖📦✅🚫❌]\s/, ''));

            // Прогресс-бар с процентом (крупный)
            const progressSection = card.createDiv('habit-card-progress');
            const progressBar = progressSection.createDiv('habit-card-progress-bar');
            const progressFill = progressBar.createDiv('habit-card-progress-fill');
            progressFill.style.width = `${Math.min(100, stats.completionRate)}%`;
            progressFill.style.background = this.getPercentColor(stats.completionRate);
            
            const progressText = progressSection.createDiv('habit-card-progress-text');
            progressText.setText(`~${stats.completionRate.toFixed(1)}%`);

            // Статистика (компактная таблица с иконками)
            const statsSection = card.createDiv('habit-card-stats-section');
            statsSection.createEl('h4', { text: '📊 Статистика:' });
            
            const statsGrid = statsSection.createDiv('habit-card-stats-grid');
            
            const statItems = [
                { icon: '📅', label: 'Всего дней:', value: stats.totalDays },
                { icon: '✅', label: 'Выполнено:', value: stats.completedDays },
                { icon: '🔥', label: 'Текущая серия:', value: stats.currentStreak },
                { icon: '🏆', label: 'Лучшая серия:', value: stats.longestStreak },
                { icon: '⏱️', label: 'Срок жизни:', value: `${lifetime} дней` }
            ];

            statItems.forEach(({ icon, label, value }) => {
                const row = statsGrid.createDiv('habit-card-stat-row');
                const labelCell = row.createDiv('habit-card-stat-label');
                labelCell.createSpan('stat-icon').setText(icon);
                labelCell.createSpan().setText(label);
                row.createDiv('habit-card-stat-value').setText(value.toString());
            });

            // Кнопка "Подробнее" внизу карточки
            const footer = card.createDiv('habit-card-footer');
            const detailsBtn = footer.createEl('button', {
                text: '📈 Подробнее',
                cls: 'habit-card-details-btn'
            });
            detailsBtn.onclick = () => {
                this.plugin.openHabitDetailsModal(habit.id, false);
            };
        });
    }

    calculateWeekdayAveragesForMonth() {
        // Показываем прогресс только по текущей календарной неделе (Пн → сегодня)
        const today = new Date();
        const todayStr = DateUtils.formatDate(today);

        // Определяем начало текущей недели (понедельник)
        const dayOfWeek = today.getDay(); // 0=вс
        const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - mondayOffset);
        const startStr = DateUtils.formatDate(weekStart);

        // Дни от понедельника до сегодня включительно
        const dates = DateUtils.getDateRange(startStr, todayStr);

        // Пн..Вс
        const labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        const sums = Array(7).fill(0);
        const counts = Array(7).fill(0);

        dates.forEach(dateStr => {
            const d = DateUtils.parseDate(dateStr);
            let idx = d.getDay(); // 0=вс..6=сб
            idx = idx === 0 ? 6 : idx - 1; // 0..6 => Пн..Вс

            const habitsForDay = this.plugin.habitManager.getHabitsByDate(dateStr);
            if (habitsForDay.length === 0) return;

            let totalForDay = 0;
            let completedForDay = 0;
            habitsForDay.forEach(habit => {
                totalForDay += 1;
                if (this.plugin.habitManager.isCompleted(habit.id, dateStr)) {
                    completedForDay += 1;
                }
            });

            if (totalForDay === 0) return;
            const dayPercent = (completedForDay / totalForDay) * 100;
            sums[idx] += dayPercent;
            counts[idx] += 1;
        });

        return labels.map((label, i) => ({
            label,
            percent: counts[i] > 0 ? sums[i] / counts[i] : 0
        })).map((item, i, arr) => {
            const minPercent = Math.min(...arr.map(x => x.percent));
            return {
                ...item,
                isWeakPoint: (item.percent === minPercent && item.percent < 50)
            };
        });
    }

    calculateMonthlyCompletionTrend() {
        const year  = this.dashboardYear;
        const month = this.dashboardMonth;
        const monthStart = new Date(year, month, 1);
        const monthEnd   = new Date(year, month + 1, 0);

        const startStr = DateUtils.formatDate(monthStart);
        const endStr   = DateUtils.formatDate(monthEnd);
        const dates    = DateUtils.getDateRange(startStr, endStr);

        return dates.map(dateStr => {
            const d = DateUtils.parseDate(dateStr);
            const day = d.getDate();
            const habitsForDay = this.plugin.habitManager.getHabitsByDate(dateStr);

            let totalForDay = 0;
            let completedForDay = 0;
            habitsForDay.forEach(habit => {
                totalForDay += 1;
                if (this.plugin.habitManager.isCompleted(habit.id, dateStr)) {
                    completedForDay += 1;
                }
            });

            return { day, completed: completedForDay, total: totalForDay };
        });
    }

    createStatCard(container, label, value, filterStatus, cssClass) {
        const card = container.createDiv('stat-card');
        if (cssClass) {
            card.addClass(`stat-card-${cssClass}`);
        }
        // Подсвечиваем выбранную карточку
        if (
            (filterStatus === 'all' && this.selectedStatus === 'all') ||
            (filterStatus !== 'all' && filterStatus === this.selectedStatus)
        ) {
            card.addClass('stat-card-active-filter');
        }
        card.createDiv('stat-card-value').setText(value);
        card.createDiv('stat-card-label').setText(label);
        
        if (filterStatus !== null) {
            card.style.cursor = 'pointer';
            card.onclick = () => {
                this.selectedStatus = filterStatus;
                this.render();
            };
        }
    }

    /**
     * Общий прогресс за текущий месяц:
     * для каждого дня месяца считаем выполненные/все привычки
     * и усредняем по дням, где были привычки.
     */
    calculateMonthlyProgress() {
        const year  = this.dashboardYear;
        const month = this.dashboardMonth;

        const monthStart = new Date(year, month, 1);
        const monthEnd   = new Date(year, month + 1, 0);

        const startStr = DateUtils.formatDate(monthStart);
        const endStr   = DateUtils.formatDate(monthEnd);
        const dates    = DateUtils.getDateRange(startStr, endStr);

        let sumDayPercents = 0;
        let daysWithHabits = 0;

        dates.forEach(dateStr => {
            const habitsForDay = this.plugin.habitManager.getHabitsByDate(dateStr);
            if (habitsForDay.length === 0) {
                return;
            }

            let totalForDay = 0;
            let completedForDay = 0;

            habitsForDay.forEach(habit => {
                totalForDay += 1;
                if (this.plugin.habitManager.isCompleted(habit.id, dateStr)) {
                    completedForDay += 1;
                }
            });

            if (totalForDay > 0) {
                const dayPercent = (completedForDay / totalForDay) * 100;
                sumDayPercents += dayPercent;
                daysWithHabits += 1;
            }
        });

        if (daysWithHabits === 0) return 0;
        return sumDayPercents / daysWithHabits;
    }

    calculateStreaksForPeriod(completions, startDate, endDate) {
        const completedDates = new Set(
            completions.filter(c => c.completed).map(c => c.date)
        );

        const allDates = DateUtils.getDateRange(startDate, endDate);
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        // Текущая серия - от конца к началу
        for (let i = allDates.length - 1; i >= 0; i--) {
            if (completedDates.has(allDates[i])) {
                currentStreak++;
            } else {
                break;
            }
        }

        // Лучшая серия - от начала к концу
        for (const date of allDates) {
            if (completedDates.has(date)) {
                tempStreak++;
                longestStreak = Math.max(longestStreak, tempStreak);
            } else {
                tempStreak = 0;
            }
        }

        return { current: currentStreak, longest: longestStreak };
    }

    getStatusText(status) {
        const texts = {
            [HabitStatus.ACTIVE]: '🟢 Активная',
            [HabitStatus.AUTOMATED]: '🤖 Автоматизирована',
            [HabitStatus.OBSOLETE]: '📦 Устарела',
            [HabitStatus.ACHIEVED]: '✅ Цель достигнута',
            [HabitStatus.CANCELLED]: '🚫 Отменена',
            [HabitStatus.FAILED]: '❌ Не получилось'
        };
        return texts[status] || status;
    }

    getPercentColor(percent) {
        if (percent >= 80) return '#00B894';
        if (percent >= 60) return '#FDCB6E';
        if (percent >= 40) return '#FFA726';
        return '#FF6B6B';
    }
}

// ============= МОДАЛЬНЫЕ ОКНА =============
// ============= МОДАЛЬНЫЕ ОКНА =============

class DayModal extends Modal {
    constructor(app, plugin, date) {
        super(app);
        this.plugin = plugin;
        this.date = date;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass('habit-tracker-modal');

        contentEl.createEl('h2', { text: `Привычки на ${this.formatDate(this.date)}` });

        const habits = this.plugin.habitManager.getHabitsByDate(this.date);

        if (habits.length === 0) {
            contentEl.createDiv('no-habits').setText('Нет привычек на этот день');
            return;
        }

        const list = contentEl.createDiv('habit-modal-list');
        habits.forEach(habit => {
            const item = list.createDiv('habit-modal-item');
            
            const checkbox = item.createEl('input', { type: 'checkbox' });
            checkbox.checked = this.plugin.habitManager.isCompleted(habit.id, this.date);
            checkbox.onchange = () => {
                this.plugin.habitManager.toggleCompletion(habit.id, this.date);
                this.plugin.saveSettings();
                this.plugin.refreshView(); // Обновляем календарь
            };

            const label = item.createDiv('habit-modal-label');
            if (habit.icon) {
                label.createSpan('habit-icon').setText(habit.icon);
            }
            label.createSpan('habit-name').setText(habit.name);

            const completion = this.plugin.habitManager.getCompletion(habit.id, this.date);
            if (completion?.note) {
                item.createDiv('habit-note').setText(`Заметка: ${completion.note}`);
            }

            const editBtn = item.createEl('button', { text: '✏️', cls: 'icon-btn' });
            editBtn.onclick = () => {
                this.close();
                this.plugin.openHabitModal(habit);
            };

            if (habit.color) {
                item.style.borderLeft = `3px solid ${habit.color}`;
            }
        });
    }

    onClose() {
        this.contentEl.empty();
    }

    formatDate(date) {
        const d = DateUtils.parseDate(date);
        const months = [
            'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
        ];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }
}

class HabitModal extends Modal {
    constructor(app, plugin, habit) {
        super(app);
        this.plugin = plugin;
        this.habit = habit;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass('habit-tracker-modal');

        contentEl.createEl('h2', { 
            text: this.habit ? 'Редактировать привычку' : 'Новая привычка' 
        });

        let name = this.habit?.name || '';
        let description = this.habit?.description || '';
        let icon = this.habit?.icon || '✓';
        let color = this.habit?.color || '#4ECDC4';
        let startDate = this.habit?.startDate || DateUtils.formatDate(new Date());
        let endDate = this.habit?.endDate || '';

        new Setting(contentEl)
            .setName('Название')
            .addText(text => text.setValue(name).onChange(value => name = value));

        new Setting(contentEl)
            .setName('Описание')
            .addTextArea(text => text.setValue(description).onChange(value => description = value));

        new Setting(contentEl)
            .setName('Иконка (эмодзи)')
            .addDropdown(dropdown => {
                const emojis = {
                    '✓': '✓ Галочка',
                    '💪': '💪 Сила',
                    '🏃': '🏃 Бег',
                    '🧘': '🧘 Медитация',
                    '📚': '📚 Книги',
                    '💧': '💧 Вода',
                    '🎯': '🎯 Цель',
                    '✍️': '✍️ Письмо',
                    '🥗': '🥗 Еда',
                    '😴': '😴 Сон',
                    '🚶': '🚶 Ходьба',
                    '🎨': '🎨 Творчество',
                    '💻': '💻 Работа',
                    '🎵': '🎵 Музыка',
                    '🌱': '🌱 Рост',
                    '⭐': '⭐ Звезда',
                    '🔥': '🔥 Огонь',
                    '💎': '💎 Алмаз',
                    '🏆': '🏆 Победа',
                    '❤️': '❤️ Сердце'
                };
                
                Object.keys(emojis).forEach(emoji => {
                    dropdown.addOption(emoji, emojis[emoji]);
                });
                
                dropdown.setValue(icon).onChange(value => icon = value);
            });

        new Setting(contentEl)
            .setName('Цвет')
            .addDropdown(dropdown => {
                const colors = {
                    '#FF6B6B': '🔴 Красный',
                    '#4ECDC4': '🔵 Бирюзовый',
                    '#45B7D1': '💙 Голубой',
                    '#96CEB4': '💚 Зелёный',
                    '#FFEAA7': '💛 Жёлтый',
                    '#DFE6E9': '⚪ Серый',
                    '#A29BFE': '💜 Фиолетовый',
                    '#FD79A8': '💗 Розовый',
                    '#FDCB6E': '🧡 Оранжевый',
                    '#6C5CE7': '🟣 Индиго',
                    '#00B894': '🟢 Изумрудный',
                    '#E17055': '🟠 Коралловый'
                };
                
                Object.keys(colors).forEach(colorCode => {
                    dropdown.addOption(colorCode, colors[colorCode]);
                });
                
                dropdown.setValue(color).onChange(value => color = value);
            });

        new Setting(contentEl)
            .setName('Дата начала')
            .addText(text => text.setValue(startDate).setPlaceholder('YYYY-MM-DD').onChange(value => startDate = value));

        new Setting(contentEl)
            .setName('Дата окончания (необязательно)')
            .addText(text => text.setValue(endDate).setPlaceholder('YYYY-MM-DD').onChange(value => endDate = value));

        new Setting(contentEl)
            .addButton(btn => btn.setButtonText('Сохранить').setCta().onClick(() => {
                if (!name) {
                    new Notice('Укажите название привычки');
                    return;
                }
                if (endDate && startDate && endDate < startDate) {
                    new Notice('Дата окончания не может быть раньше даты начала');
                    return;
                }
                if (this.habit) {
                    this.plugin.habitManager.updateHabit(this.habit.id, {
                        name, description, icon, color, startDate,
                        endDate: endDate || undefined
                    });
                } else {
                    // Создаем привычку с правильными параметрами, включая icon и color
                    this.plugin.habitManager.createHabit(name, description, startDate, endDate || undefined, icon, color);
                }
                this.plugin.saveSettings();
                this.plugin.refreshView();
                this.close();
                new Notice('Привычка сохранена');
            }))
            .addButton(btn => btn.setButtonText('Отмена').onClick(() => this.close()));
    }

    onClose() {
        this.contentEl.empty();
    }
}

class HabitDetailsModal extends Modal {
    constructor(app, plugin, habitId, returnToDashboard = false) {
        super(app);
        this.plugin = plugin;
        this.habitId = habitId;
        this.returnToDashboard = returnToDashboard;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass('habit-tracker-modal', 'habit-details-modal');

        const habit = this.plugin.habitManager.getHabit(this.habitId);
        if (!habit) {
            contentEl.createDiv().setText('Привычка не найдена');
            return;
        }

        const header = contentEl.createDiv('habit-details-header');
        
        // Кнопка "Назад" если пришли из дашборда
        if (this.returnToDashboard) {
            const backBtn = header.createEl('button', { 
                text: '← Назад к дашборду',
                cls: 'back-btn'
            });
            backBtn.onclick = () => {
                this.close();
                this.plugin.openDashboard();
            };
        }
        
        const titleRow = header.createDiv('habit-title-row');
        if (habit.icon) {
            titleRow.createSpan('habit-icon-large').setText(habit.icon);
        }
        titleRow.createEl('h2', { text: habit.name });

        if (habit.description) {
            contentEl.createDiv('habit-description').setText(habit.description);
        }

        this.renderStats(contentEl, habit);
        this.renderActions(contentEl, habit);
    }

    renderStats(container, habit) {
        const statsSection = container.createDiv('habit-stats-section');
        statsSection.createEl('h3', { text: 'Статистика' });

        const completions = this.plugin.habitManager.getCompletionsForHabit(habit.id);
        const stats = StatsCalculator.calculateStats(habit, completions);
        const statsGrid = statsSection.createDiv('stats-grid');

        this.createStatItem(statsGrid, 'Всего дней', stats.totalDays.toString());
        this.createStatItem(statsGrid, 'Выполнено', stats.completedDays.toString());
        this.createStatItem(statsGrid, 'Процент выполнения', `${stats.completionRate.toFixed(1)}%`);
        this.createStatItem(statsGrid, 'Текущая серия', `${stats.currentStreak} дн.`);
        this.createStatItem(statsGrid, 'Лучшая серия', `${stats.longestStreak} дн.`);
        
        const lifetimeDays = StatsCalculator.getLifetimeDays(habit);
        this.createStatItem(statsGrid, 'Срок жизни привычки', `${lifetimeDays} дн.`);

        if (stats.lastCompletedDate) {
            const daysAgo = DateUtils.getDaysDifference(stats.lastCompletedDate, DateUtils.formatDate(new Date()));
            this.createStatItem(statsGrid, 'Последнее выполнение', `${daysAgo} дн. назад`);
        }
    }

    createStatItem(container, label, value) {
        const item = container.createDiv('stat-item');
        item.createDiv('stat-label').setText(label);
        item.createDiv('stat-value').setText(value);
    }

    renderActions(container, habit) {
        const actions = container.createDiv('habit-actions');

        new Setting(actions)
            .setName('Статус привычки')
            .addDropdown(dropdown => {
                dropdown
                    .addOption(HabitStatus.ACTIVE, '🟢 Активная')
                    .addOption(HabitStatus.AUTOMATED, '🤖 Автоматизирована')
                    .addOption(HabitStatus.ACHIEVED, '✅ Цель достигнута')
                    .addOption(HabitStatus.OBSOLETE, '📦 Устарела')
                    .addOption(HabitStatus.CANCELLED, '🚫 Отменена')
                    .addOption(HabitStatus.FAILED, '❌ Не получилось')
                    .setValue(habit.status)
                    .onChange(async (value) => {
                        this.plugin.habitManager.updateHabit(habit.id, { status: value });
                        await this.plugin.saveSettings();
                        this.plugin.refreshView();
                        new Notice('Статус обновлен');
                    });
            });

        new Setting(actions)
            .addButton(btn => btn.setButtonText('Редактировать').onClick(() => {
                this.close();
                this.plugin.openHabitModal(habit);
            }))
            .addButton(btn => btn.setButtonText('Удалить').setWarning().onClick(async () => {
                if (confirm('Вы уверены, что хотите удалить эту привычку? Все данные будут потеряны.')) {
                    this.plugin.habitManager.deleteHabit(habit.id);
                    await this.plugin.saveSettings();
                    this.plugin.refreshView();
                    this.close();
                    new Notice('Привычка удалена');
                }
            }));
    }

    onClose() {
        this.contentEl.empty();
    }
}

// ============= ГЛАВНЫЙ ПЛАГИН =============
class HabitTrackerPlugin extends Plugin {
    async onload() {
        try {
            console.log(`Loading Habit Tracker Plugin v${PLUGIN_VERSION}`);

            await this.loadSettings();

            this.registerView(CALENDAR_VIEW_TYPE, (leaf) => new CalendarView(leaf, this));
            this.registerView(DASHBOARD_VIEW_TYPE, (leaf) => new DashboardView(leaf, this));

            this.addRibbonIcon('check-circle', 'Open Habit Tracker', () => {
                this.safeExecute(() => this.activateView(), 'open tracker');
            });

            this.addCommand({
                id: 'open-habit-tracker',
                name: 'Open Habit Tracker',
                callback: () => this.safeExecute(() => this.activateView(), 'open tracker')
            });

            this.addCommand({
                id: 'add-new-habit',
                name: 'Add New Habit',
                callback: () => this.safeExecute(() => this.openHabitModal(), 'add habit')
            });

            this.addCommand({
                id: 'mark-today-habits',
                name: 'Mark Today\'s Habits',
                callback: () => this.safeExecute(() => {
                    const today = DateUtils.formatDate(new Date());
                    this.openDayModal(today);
                }, 'mark today')
            });

            this.addCommand({
                id: 'open-dashboard',
                name: 'Open Statistics Dashboard',
                callback: () => this.safeExecute(() => this.openDashboard(), 'open dashboard')
            });

            // Export dashboard
            this.addCommand({
                id: 'export-habit-dashboard-report',
                name: 'Export Dashboard Report',
                callback: () => this.safeExecute(() => this.createDashboardFile(), 'export')
            });

            // Auto-save every 5 minutes
            this.registerInterval(
                window.setInterval(() => this.autoSave(), 5 * 60 * 1000)
            );

            this.app.workspace.onLayoutReady(() => {
                this.activateView();
            });
            
            console.log('Habit Tracker Plugin loaded successfully');
        } catch (error) {
            console.error('Critical error during plugin load:', error);
            new Notice(ERROR_MESSAGES.LOAD_FAILED + '. Check console for details.');
        }
    }

    async onunload() {
        try {
            console.log('Unloading Habit Tracker Plugin');
            
            // Final save
            await this.saveSettings();
            
            // Cleanup views
            this.app.workspace.detachLeavesOfType(CALENDAR_VIEW_TYPE);
            this.app.workspace.detachLeavesOfType(DASHBOARD_VIEW_TYPE);
        } catch (error) {
            console.error('Error during unload:', error);
        }
    }

    async loadSettings() {
        try {
            const savedData = await this.loadData();
            
            if (!savedData) {
                console.log('No saved data, initializing defaults');
                this.initializeDefaults();
                return;
            }
            
            // Version check and migration
            if (savedData.version && savedData.version !== DATA_VERSION) {
                console.log(`Migrating data from ${savedData.version} to ${DATA_VERSION}`);
                await this.migrateData(savedData);
                return;
            }
            
            // Data validation
            if (!DataValidator.validateData(savedData)) {
                console.error('Data validation failed');
                new Notice(ERROR_MESSAGES.INVALID_DATA);
                await this.restoreFromBackup();
                return;
            }
            
            const data = {
                habits: savedData.habits || [],
                completions: savedData.completions || [],
                settings: Object.assign({}, DEFAULT_SETTINGS, savedData.settings),
                version: DATA_VERSION
            };

            this.settings = data.settings;
            this.habitManager = new HabitManager(data);
            
            console.log(`Loaded ${data.habits.length} habits, ${data.completions.length} completions`);
        } catch (error) {
            console.error('Failed to load settings:', error);
            new Notice(ERROR_MESSAGES.LOAD_FAILED);
            this.initializeDefaults();
        }
    }

    async saveSettings() {
        try {
            if (!this.habitManager) {
                console.warn('HabitManager not initialized');
                return;
            }
            
            const data = this.habitManager.getData();
            data.version = DATA_VERSION;
            
            // Validate before save
            if (!DataValidator.validateData(data)) {
                console.error('Data validation failed before save');
                new Notice('⚠️ Data validation failed');
                return;
            }
            
            // Create backup
            await this.createBackup();
            
            // Save
            await this.saveData(data);
        } catch (error) {
            console.error('Failed to save settings:', error);
            new Notice(ERROR_MESSAGES.SAVE_FAILED);
            
            // Try to restore from backup
            try {
                await this.restoreFromBackup();
            } catch (recoveryError) {
                console.error('Recovery failed:', recoveryError);
            }
        }
    }

    // Helper methods
    safeExecute(fn, context = 'unknown') {
        try {
            return fn();
        } catch (error) {
            console.error(`Error in ${context}:`, error);
            new Notice(`⚠️ Action failed: ${context}`);
        }
    }

    initializeDefaults() {
        console.log('Initializing with default data');
        const defaultData = {
            habits: [],
            completions: [],
            settings: { ...DEFAULT_SETTINGS },
            version: DATA_VERSION
        };
        this.settings = defaultData.settings;
        this.habitManager = new HabitManager(defaultData);
    }

    async createBackup() {
        try {
            if (!this.habitManager) return;
            const data = this.habitManager.getData();
            await this.saveData(data, 'habit-tracker-backup');
        } catch (error) {
            console.error('Backup creation failed:', error);
        }
    }

    async restoreFromBackup() {
        try {
            const backupData = await this.loadData('habit-tracker-backup');
            
            if (!backupData) {
                throw new Error(ERROR_MESSAGES.NO_BACKUP);
            }
            
            if (DataValidator.validateData(backupData)) {
                this.habitManager = new HabitManager(backupData);
                new Notice('✅ Restored from backup');
                return true;
            }
            
            throw new Error('Backup data is also corrupted');
        } catch (error) {
            console.error('Restore failed:', error);
            new Notice(ERROR_MESSAGES.NO_BACKUP);
            this.initializeDefaults();
            return false;
        }
    }

    async migrateData(oldData) {
        try {
            const oldVersion = oldData.version || '0.0.0';
            console.log(`Migrating from ${oldVersion} to ${DATA_VERSION}`);
            
            let migratedData = { ...oldData };
            
            // Future migrations go here
            // if (oldVersion < '1.0.0') {
            //     migratedData = this.migrate_v0_to_v1(migratedData);
            // }
            
            migratedData.version = DATA_VERSION;
            
            if (DataValidator.validateData(migratedData)) {
                this.habitManager = new HabitManager(migratedData);
                await this.saveSettings();
                new Notice('✅ Data migrated successfully');
            } else {
                throw new Error('Migration produced invalid data');
            }
        } catch (error) {
            console.error('Migration failed:', error);
            await this.restoreFromBackup();
        }
    }

    async autoSave() {
        try {
            await this.saveSettings();
            console.log('Auto-save completed');
        } catch (error) {
            console.error('Auto-save failed:', error);
        }
    }

    async activateView() {
        const { workspace } = this.app;
        let leaf = null;
        const leaves = workspace.getLeavesOfType(CALENDAR_VIEW_TYPE);

        if (leaves.length > 0) {
            leaf = leaves[0];
        } else {
            const rightLeaf = workspace.getRightLeaf(false);
            if (rightLeaf) {
                leaf = rightLeaf;
                await leaf.setViewState({ type: CALENDAR_VIEW_TYPE, active: true });
            }
        }

        if (leaf) {
            workspace.revealLeaf(leaf);
        }
    }

    refreshView() {
        const leaves = this.app.workspace.getLeavesOfType(CALENDAR_VIEW_TYPE);
        leaves.forEach(leaf => {
            if (leaf.view instanceof CalendarView) {
                leaf.view.render();
            }
        });
    }

    openDayModal(date) {
        new DayModal(this.app, this, date).open();
    }

    openHabitModal(habit) {
        new HabitModal(this.app, this, habit).open();
    }

    openHabitDetailsModal(habitId, returnToDashboard = false) {
        new HabitDetailsModal(this.app, this, habitId, returnToDashboard).open();
    }

    async activateDashboard() {
        const { workspace } = this.app;
        let leaf = null;
        const leaves = workspace.getLeavesOfType(DASHBOARD_VIEW_TYPE);

        if (leaves.length > 0) {
            leaf = leaves[0];
        } else {
            leaf = workspace.getLeaf(true);
            await leaf.setViewState({ type: DASHBOARD_VIEW_TYPE, active: true });
        }

        if (leaf) {
            workspace.revealLeaf(leaf);
        }
    }

    async createDashboardFile() {
        const dashboardFileName = 'Dashboard привычек.md';
        const root = this.app.vault.getRoot();
        
        // Проверяем есть ли уже такой файл
        let file = this.app.vault.getAbstractFileByPath(dashboardFileName);
        
        if (!file) {
            // Создаем файл если его нет
            file = await this.app.vault.create(dashboardFileName, '# 📊 Дашборд привычек\n\nЗагрузка...');
        }
        
        // Генерируем HTML контент дашборда
        const dashboardContent = this.generateDashboardMarkdown();
        
        // Обновляем файл содержимым
        await this.app.vault.modify(file, dashboardContent);
        
        // Открываем файл
        const leaf = this.app.workspace.getLeaf(true);
        await leaf.openFile(file);
    }

    generateDashboardMarkdown() {
        let markdown = `# 📊 Дашборд привычек

`;

        const habits = this.habitManager.getAllHabits();
        const activeHabits = habits.filter(h => h.status === HabitStatus.ACTIVE);
        const automatedHabits = habits.filter(h => h.status === HabitStatus.AUTOMATED);
        const achievedHabits = habits.filter(h => h.status === HabitStatus.ACHIEVED);
        const obsoleteHabits = habits.filter(h => h.status === HabitStatus.OBSOLETE);
        const cancelledHabits = habits.filter(h => h.status === HabitStatus.CANCELLED);
        const failedHabits = habits.filter(h => h.status === HabitStatus.FAILED);

        // Общая статистика в виде callouts
        markdown += `> [!success] 📊 ОБЩАЯ СТАТИСТИКА
> | | |
> |---|---|
> | 📝 **Всего привычек** | ${habits.length} |
> | 🟢 **Активных** | ${activeHabits.length} |
> | 🤖 **Автоматизированных** | ${automatedHabits.length} |
> | ✅ **Достигнутых** | ${achievedHabits.length} |
> | 📦 **Устаревших** | ${obsoleteHabits.length} |
> | 🚫 **Отменённых** | ${cancelledHabits.length} |
> | ❌ **Не получилось** | ${failedHabits.length} |

## 📋 Статистика по привычкам

`;

        habits.forEach(habit => {
            const completions = this.habitManager.getCompletionsForHabit(habit.id);
            const stats = StatsCalculator.calculateStats(habit, completions);
            const lifetime = StatsCalculator.getLifetimeDays(habit);
            
            const percentage = Math.min(100, stats.completionRate);
            const progressBar = this.generateProgressBar(percentage);
            
            const statusEmoji = this.getStatusEmoji(habit.status);
            const statusText = this.getStatusTextShort(habit.status);

            markdown += `### ${habit.icon || '•'} ${habit.name}

> [!${this.getStatusCalloutType(habit.status)}] ${statusEmoji} ${statusText}
> **Выполнено:** ${progressBar} **${stats.completionRate.toFixed(1)}%**
> 
> 📊 **Статистика:**
> - Всего дней: **${stats.totalDays}**
> - Выполнено: **${stats.completedDays}**
> - Текущая серия: **${stats.currentStreak} 🔥**
> - Лучшая серия: **${stats.longestStreak} 🏆**
> - Срок жизни: **${lifetime} дней**

`;
        });

        markdown += `---
*⏰ Обновлено: ${new Date().toLocaleString('ru-RU')}*`;

        return markdown;
    }

    generateProgressBar(percentage) {
        const filled = Math.round(percentage / 10);
        const empty = 10 - filled;
        return '█'.repeat(filled) + '░'.repeat(empty);
    }

    getStatusEmoji(status) {
        const emojis = {
            [HabitStatus.ACTIVE]: '🟢',
            [HabitStatus.AUTOMATED]: '🤖',
            [HabitStatus.OBSOLETE]: '📦',
            [HabitStatus.ACHIEVED]: '✅',
            [HabitStatus.CANCELLED]: '🚫',
            [HabitStatus.FAILED]: '❌'
        };
        return emojis[status] || '•';
    }

    getStatusCalloutType(status) {
        const types = {
            [HabitStatus.ACTIVE]: 'success',
            [HabitStatus.AUTOMATED]: 'note',
            [HabitStatus.OBSOLETE]: 'warning',
            [HabitStatus.ACHIEVED]: 'check',
            [HabitStatus.CANCELLED]: 'warning',
            [HabitStatus.FAILED]: 'failure'
        };
        return types[status] || 'note';
    }

    getStatusTextShort(status) {
        const texts = {
            [HabitStatus.ACTIVE]: '🟢 Активная',
            [HabitStatus.AUTOMATED]: '🤖 Авто',
            [HabitStatus.OBSOLETE]: '📦 Устарела',
            [HabitStatus.ACHIEVED]: '✅ Достигнута',
            [HabitStatus.CANCELLED]: '🚫 Отменена',
            [HabitStatus.FAILED]: '❌ Ошибка'
        };
        return texts[status] || status;
    }

    // Открыть интерактивный дашборд как отдельный View
    openDashboard() {
        this.activateDashboard();
    }
}

module.exports = HabitTrackerPlugin;
