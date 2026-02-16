
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
        className: "bg-gray-100 border-gray-300 text-gray-500",
    },
    DUE_TODAY: {
        text: "Due",
        className: "bg-red-50 border-red-300 text-red-600",
    },
    DUE_TOMORROW: {
        text: "Due Tomorrow",
        className: "bg-orange-50 border-orange-300 text-orange-600",
    },
    DUE_IN_2_DAYS: {
        text: "Due in 2 Days",
        className: "bg-yellow-50 border-yellow-300 text-yellow-700",
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


export const getCardBackground = (status, dueStatus) => {
    if (status === "COMPLETED") return "rgba(220, 252, 231, 0.5)";
    if (status === "CANCELLED") return "rgba(243, 244, 246, 0.5)";

    switch (dueStatus) {
        case "DUE_IN_2_DAYS":
            return "rgba(254, 249, 195, 0.3)";
        case "DUE_TOMORROW":
            return "rgba(255, 237, 213, 0.3)";
        case "DUE_TODAY":
            return "rgba(254, 226, 226, 0.3)";
        case "OVERDUE":
            return "rgba(243, 244, 246, 0.5)";
        default:
            return "#ffffff";
    }
};

export const getCardBorder = (status, dueStatus) => {
    if (status === "COMPLETED") return "1px solid rgba(34, 197, 94, 0.3)";
    if (status === "CANCELLED") return "1px solid rgba(209, 213, 219, 0.5)";

    switch (dueStatus) {
        case "DUE_TODAY":
            return "1px solid rgba(239, 68, 68, 0.5)";
        case "DUE_TOMORROW":
            return "1px solid rgba(249, 115, 22, 0.5)";
        case "DUE_IN_2_DAYS":
            return "1px solid rgba(234, 179, 8, 0.5)";
        default:
            return "1px solid #e5e7eb";
    }
};

export const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    ONGOING: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-gray-100 text-gray-500",
    OVERDUE: "bg-gray-100 text-gray-500",
};

export const priorityColors = {
    High: "bg-red-100 text-red-800",
    Medium: "bg-orange-100 text-orange-800",
    Low: "bg-yellow-100 text-yellow-800",
    OVERDUE: "bg-gray-100 text-gray-500",
};

export const highlightSearchMatch = (text, searchTerm) => {
    if (!searchTerm || searchTerm.trim() === "") return text;

    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.split(regex).map((part, index) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
            <span
                key={index}
                className="bg-[#7733ff]/30 text-[#7733ff] px-1 font-bold"
            >
                {part}
            </span>
        ) : (
            part
        )
    );
};
