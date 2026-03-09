import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetTasksQuery } from '../../task/api/tasksApi';
import { LoadingSpinner, Chip } from "../../../core/ui";
import { getCardBackground, getCardBorder, getDueDateStatus } from '../../task/utils/taskUtils';
import { useTheme } from '../../../core/hooks/useTheme';

const StatCard = ({ title, count, status, dueStatus, variant, onClick }) => {
    const { theme } = useTheme();
    const isClickable = onClick && (status === 'TOTAL' || count > 0);

    const style = {
        background: getCardBackground(status, dueStatus, theme),
        border: getCardBorder(status, dueStatus, theme),
    };

    return (
        <div
            className={`p-3 md:p-6 border h-full flex flex-col justify-center items-start gap-1 md:gap-2 ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
            style={style}
            onClick={isClickable ? onClick : undefined}
        >
            <div className="">
                <Chip variant={variant} size="sm" className="font-bold">
                    {title}
                </Chip>
            </div>
            <h3 className="text-3xl font-bold text-gray-600 dark:text-[#bfbfbf]">{count == 0 ? "—" : count}</h3>
        </div>
    );
};

export default function Dashboard() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const userEmail = useSelector((state) => state.auth.userEmail);
    const activeProject = useSelector((state) => state.project.activeProject);
    const isAdmin = activeProject?.role === "PROJECT_ADMIN";

    const { data: tasks = [], isLoading } = useGetTasksQuery(projectId, {
        skip: !projectId,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    const relevantTasks = isAdmin
        ? tasks
        : tasks.filter(t => t.assigneeId === userEmail);

    const stats = {
        total: relevantTasks.length,
        pending: relevantTasks.filter(t => {
            if (!t.assigneeId && !t.assigneeEmail) return false;
            const dueStatus = getDueDateStatus(t.dueDate, t.taskStatus);
            return t.taskStatus === 'PENDING' && dueStatus !== 'OVERDUE' && dueStatus !== 'DUE_TODAY';
        }).length,
        ongoing: relevantTasks.filter(t => {
            if (!t.assigneeId && !t.assigneeEmail) return false;
            const dueStatus = getDueDateStatus(t.dueDate, t.taskStatus);
            return t.taskStatus === 'ONGOING' && dueStatus !== 'OVERDUE' && dueStatus !== 'DUE_TODAY';
        }).length,
        completed: relevantTasks.filter(t => t.taskStatus === 'COMPLETED').length,
        cancelled: relevantTasks.filter(t => t.taskStatus === 'CANCELLED').length,
        overdue: relevantTasks.filter(t => {
            if (!t.assigneeId && !t.assigneeEmail) return false;
            return getDueDateStatus(t.dueDate, t.taskStatus) === 'OVERDUE';
        }).length,
        due: relevantTasks.filter(t => {
            if (!t.assigneeId && !t.assigneeEmail) return false;
            return getDueDateStatus(t.dueDate, t.taskStatus) === 'DUE_TODAY';
        }).length,
        unassigned: relevantTasks.filter(t => !t.assigneeId && !t.assigneeEmail).length
    };

    const cardData = [
        {
            title: isAdmin ? 'Project Tasks' : 'My Tasks',
            count: stats.total,
            status: 'TOTAL',
            dueStatus: null,
            variant: 'DEFAULT',
            onClick: () => navigate(`/project/${projectId}/tasks`)
        },
        {
            title: 'Pending',
            count: stats.pending,
            status: 'PENDING',
            dueStatus: null,
            variant: 'PENDING',
            onClick: () => navigate(`/project/${projectId}/tasks?filter=PENDING`)
        },
        {
            title: 'Ongoing',
            count: stats.ongoing,
            status: 'ONGOING',
            dueStatus: null,
            variant: 'ONGOING',
            onClick: () => navigate(`/project/${projectId}/tasks?filter=ONGOING`)
        },
        {
            title: 'Completed',
            count: stats.completed,
            status: 'COMPLETED',
            dueStatus: null,
            variant: 'COMPLETED',
            onClick: () => navigate(`/project/${projectId}/tasks?filter=COMPLETED`)
        },
        {
            title: 'Overdue',
            count: stats.overdue,
            status: null,
            dueStatus: 'OVERDUE',
            variant: 'OVERDUE',
            onClick: () => navigate(`/project/${projectId}/tasks?dueFilter=OVERDUE`)
        },
        {
            title: 'Due',
            count: stats.due,
            status: null,
            dueStatus: 'DUE_TODAY',
            variant: 'DUE_TODAY',
            onClick: () => navigate(`/project/${projectId}/tasks?dueFilter=DUE_TODAY`)
        },
        ...(isAdmin ? [{
            title: 'Unassigned',
            count: stats.unassigned,
            status: 'UNASSIGNED',
            dueStatus: null,
            variant: 'CANCELLED',
            onClick: () => navigate(`/project/${projectId}/tasks?assigneeEmail=UNASSIGNED`)
        }] : []),
        {
            title: 'Cancelled',
            count: stats.cancelled,
            status: 'CANCELLED',
            dueStatus: null,
            variant: 'CANCELLED',
            onClick: () => navigate(`/project/${projectId}/tasks?filter=CANCELLED`)
        },
    ];

    return (
        <div className="h-full overflow-y-auto">
            <header className='p-4 md:p-6 pb-0 md:pb-0'>
                <div className="border-b border-gray-200 dark:border-[#404040] flex flex-col gap-1 pb-4 mb-4">
                    <h1 className="text-2xl md:text-3xl text-gray-600 dark:text-[#bfbfbf]">Dashboard</h1>
                </div>
            </header>

            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4 p-4 md:p-6 pt-0 md:pt-0">
                {cardData.map((card) => (
                    <StatCard
                        key={card.title}
                        {...card}
                    />
                ))}
            </div>
        </div>
    );
}
