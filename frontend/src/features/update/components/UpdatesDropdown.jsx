import React, { useState, useEffect, useRef } from 'react';
import { Bell, MessageSquare } from 'lucide-react';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { useGetProjectUpdatesQuery, useMarkUpdatesAsReadMutation } from '../api/updateApi';
import { useGetCommentsByRecipientQuery } from '../../task/api/commentsApi';
import { useGetTasksQuery } from '../../task/api/tasksApi';

const UpdatesDropdown = () => {
    const activeProject = useSelector((state) => state.project.activeProject);
    const userEmail = useSelector((state) => state.auth.userEmail) ?? null;
    const parsedProjectId = activeProject?.id ?? null;
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const { data: updates = [], isLoading } = useGetProjectUpdatesQuery(parsedProjectId, {
        skip: !parsedProjectId,
    });
    const [markAsRead] = useMarkUpdatesAsReadMutation();

    const { data: receivedComments = [] } = useGetCommentsByRecipientQuery(userEmail, {
        skip: !userEmail,
    });

    const { data: projectTasks = [] } = useGetTasksQuery(parsedProjectId, {
        skip: !parsedProjectId,
    });

    const projectTaskIds = new Set(projectTasks.map((t) => t.id));
    const totalUnreadMessages = receivedComments.filter(
        (c) => !c.readByRecipient && projectTaskIds.has(c.taskId)
    ).length;

    const unreadCount = updates.filter(u => !u.isRead).length;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!parsedProjectId) return null;

    const toggleDropdown = () => {
        const newIsOpen = !isOpen;
        setIsOpen(newIsOpen);

        if (newIsOpen && unreadCount > 0) {
            const unreadIds = updates.filter(u => !u.isRead).map(u => u.id);
            markAsRead({ projectId: parsedProjectId, updateIds: unreadIds });
        }
    };


    return (
        <div className="relative flex items-center" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors text-gray-600 dark:text-[#bfbfbf] dark:text-gray-300 cursor-pointer"
                aria-label="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute h-5 w-5 bg-red-500 text-white text-xs border border-red-400 flex justify-center items-center -right-0.5 -top-0.5 cursor-pointer z-10 rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute -right-14 md:right-0 top-full mt-2.5 w-80 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#404040] shadow-lg overflow-hidden z-50 origin-top-right">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-[#404040] flex justify-between items-center bg-gray-50 dark:bg-[#262626]">
                        <h3 className="font-semibold text-gray-800 dark:text-[#bfbfbf]">Updates</h3>
                    </div>

                    <div className="max-h-[70vh] overflow-y-auto">
                        {totalUnreadMessages > 0 && (
                            <div className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 border-b border-gray-100 dark:border-[#2a2a2a]">
                                <MessageSquare size={16} className="text-red-500 flex-shrink-0" />
                                <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                                    You have{' '}
                                    <span className="font-bold">{totalUnreadMessages}</span>
                                    {' '}unread {totalUnreadMessages === 1 ? 'message' : 'messages'}
                                </p>
                            </div>
                        )}
                        {isLoading ? (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                Loading updates...
                            </div>
                        ) : updates.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center">
                                <Bell className="w-8 h-8 mb-3 opacity-20" />
                                <p>No updates yet</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-100 dark:divide-[#2a2a2a] max-h-[250px] overflow-y-auto">
                                {updates.map((update) => (
                                    <li
                                        key={update.id}
                                        className={`p-4 hover:bg-gray-50 dark:hover:bg-[#222] transition-colors ${!update.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">
                                                    {update.message}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
                                                </p>
                                            </div>
                                            {!update.isRead && (
                                                <div className="flex-shrink-0 mt-1.5 flex justify-center w-2 h-2">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdatesDropdown;
