/**
 * Utility functions for task due date calculations
 */

/**
 * Calculate due date status based on current date and task status
 */
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

/**
 * Format due date text based on status
 */
export const formatDueDateText = (dueDate, status, dueDateStatus) => {
    if (status === "COMPLETED" || status === "CANCELLED") {
        return new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        }).format(new Date(dueDate));
    }

    const statusConfig = {
        OVERDUE: { text: "Overdue" },
        DUE_TODAY: { text: "Due" },
        DUE_TOMORROW: { text: "Due Tomorrow" },
        DUE_IN_2_DAYS: { text: "Due in 2 Days" },
    };

    if (statusConfig[dueDateStatus]) {
        return statusConfig[dueDateStatus].text;
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(new Date(dueDate));
};

/**
 * Get card background color based on status
 */
export const getCardBackground = (status, dueStatus) => {
    if (status === "COMPLETED") return "rgba(0, 51, 0, 0.1)";
    if (status === "CANCELLED") return "rgba(51, 0, 51, 0.1)";

    switch (dueStatus) {
        case "DUE_IN_2_DAYS":
            return "rgba(51, 51, 0, 0.2)";
        case "DUE_TOMORROW":
            return "rgba(51, 33, 0, 0.2)";
        case "DUE_TODAY":
            return "rgba(51, 0, 0, 0.2)";
        case "OVERDUE":
            return "rgba(128, 128, 128, 0.2)";
        default:
            return "#1f1f1f";
    }
};

/**
 * Get card border color based on status
 */
export const getCardBorder = (status, dueStatus) => {
    if (status === "COMPLETED") return "1px solid rgba(34, 197, 94, 0.2)";
    if (status === "CANCELLED") return "1px solid rgba(64, 64, 64, 0.2)";

    switch (dueStatus) {
        case "DUE_TODAY":
            return "1px solid rgba(255, 0, 0, 0.7)";
        case "DUE_TOMORROW":
            return "1px solid rgba(128, 83, 0, 0.7)";
        case "DUE_IN_2_DAYS":
            return "1px solid rgba(128, 128, 0, 0.7)";
        default:
            return "1px solid #404040";
    }
};

/**
 * Color mappings for status and priority
 */
export const statusColors = {
    PENDING: "bg-yellow-500/50",
    ONGOING: "bg-blue-500/50",
    COMPLETED: "bg-green-500/50",
    CANCELLED: "bg-gray-500/50",
    OVERDUE: "bg-gray-500/50",
};

export const priorityColors = {
    High: "bg-red-500/50",
    Medium: "bg-orange-500/50",
    Low: "bg-yellow-500/50",
    OVERDUE: "bg-gray-500/50",
};
