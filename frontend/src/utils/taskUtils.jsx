
export const getDueDateStatus = (dueDate, currentStatus) => {
    if (currentStatus === "COMPLETED" || currentStatus === "CANCELLED") {
        return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "OVERDUE";
    if (diffDays === 0) return "DUE_TODAY";
    if (diffDays === 1) return "DUE_TOMORROW";
    if (diffDays === 2) return "DUE_IN_2_DAYS";
    return null;
};


export const dueDateStatusConfig = {
    OVERDUE: {
        text: "Overdue",
        className: "bg-gray-100 border-gray-200 dark:border-[#404040] text-gray-500 dark:bg-gray-800/50 dark:text-gray-400",
    },
    DUE_TODAY: {
        text: "Due",
        className: "bg-red-50 border-red-300 text-red-600 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50",
    },
    DUE_TOMORROW: {
        text: "Due Tomorrow",
        className: "bg-orange-50 border-orange-300 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/50",
    },
    DUE_IN_2_DAYS: {
        text: "Due in 2 Days",
        className: "bg-yellow-50 border-yellow-300 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800/50",
    },
};

export const formatDueDateText = (dueDate, status, dueDateStatus) => {
    if (status === "COMPLETED" || status === "CANCELLED") {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(new Date(dueDate));
    }

    if (dueDateStatusConfig[dueDateStatus]) {
        return dueDateStatusConfig[dueDateStatus].text;
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(dueDate));
};


export const getCardBackground = (status, dueStatus, theme = 'light') => {
    const isDark = theme === 'dark';

    if (status === "COMPLETED") return isDark ? "rgba(6, 78, 59, 0.4)" : "rgba(220, 252, 231, 0.5)";
    if (status === "CANCELLED") return isDark ? "rgba(38, 38, 38, 0.4)" : "rgba(243, 244, 246, 0.5)";

    switch (dueStatus) {
        case "DUE_IN_2_DAYS":
            return isDark ? "rgba(113, 63, 18, 0.2)" : "rgba(254, 249, 195, 0.3)";
        case "DUE_TOMORROW":
            return isDark ? "rgba(124, 45, 18, 0.2)" : "rgba(255, 237, 213, 0.3)";
        case "DUE_TODAY":
            return isDark ? "rgba(127, 29, 29, 0.2)" : "rgba(254, 226, 226, 0.3)";
        case "OVERDUE":
            return isDark ? "rgba(38, 38, 38, 0.4)" : "rgba(243, 244, 246, 0.5)";
        default:
            return isDark ? "#1a1a1a" : "#ffffff";
    }
};

export const getCardBorder = (status, dueStatus, theme = 'light') => {
    const isDark = theme === 'dark';

    if (status === "COMPLETED") return isDark ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(34, 197, 94, 0.3)";
    if (status === "CANCELLED") return isDark ? "1px solid rgba(64, 64, 64, 0.5)" : "1px solid rgba(209, 213, 219, 0.5)";

    switch (dueStatus) {
        case "DUE_TODAY":
            return isDark ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid rgba(239, 68, 68, 0.5)";
        case "DUE_TOMORROW":
            return isDark ? "1px solid rgba(249, 115, 22, 0.4)" : "1px solid rgba(249, 115, 22, 0.5)";
        case "DUE_IN_2_DAYS":
            return isDark ? "1px solid rgba(234, 179, 8, 0.4)" : "1px solid rgba(234, 179, 8, 0.5)";
        default:
            return isDark ? "1px solid #404040" : "1px solid #e5e7eb";
    }
};

export const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-300/50",
    ONGOING: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-300/50",
    COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 dark:border-green-300/50",
    CANCELLED: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-300/50",
    OVERDUE: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-300/50",
};

export const priorityColors = {
    High: "bg-red-100 text-red-800 border border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-300/50",
    Medium: "bg-orange-100 text-orange-800 border border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-300/50",
    Low: "bg-green-100 text-green-800 border border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-300/50",
    OVERDUE: "bg-gray-100 text-gray-500 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700/50",
};

export const highlightSearchMatch = (text, searchTerm) => {
    if (!searchTerm || searchTerm.trim() === "") return text;

    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.split(regex).map((part, index) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
            <span
                key={index}
                className="bg-primary/30 text-primary px-1 font-bold"
            >
                {part}
            </span>
        ) : (
            part
        )
    );
};
