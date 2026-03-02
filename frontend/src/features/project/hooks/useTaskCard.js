
import { useCountUnreadCommentsQuery } from '../../task/api/commentsApi';
import { useGetTaskNewStateQuery } from '../../task/api/tasksApi';
import { useGetUserByEmailQuery } from '../../user/api/usersApi';
import { getDueDateStatus } from '../../task/utils/taskUtils';

export const useTaskCard = ({
  task,
  isAdmin,
  assignee,
  loggedInUser,
  createdBy,
}) => {
  const { dueDate, taskStatus, projectId } = task;

  const { data: adminUser } = useGetUserByEmailQuery(createdBy, {
    skip: !createdBy,
  });
  const { data: employeeUser } = useGetUserByEmailQuery(assignee, {
    skip: !assignee,
  });

  const { data: unreadCountByRecipient = 0 } = useCountUnreadCommentsQuery(
    {
      taskId: task.id,
      recipientEmail: loggedInUser?.email,
    },
    {
      skip: !loggedInUser?.email,
    }
  );

  const { data: taskNewState } = useGetTaskNewStateQuery(
    { projectId, taskId: task.id },
    {
      skip: isAdmin || !projectId,
    }
  );
  const taskIsNew = taskNewState?.isNew || false;

  const dueDateStatus = getDueDateStatus(dueDate, taskStatus);

  const fullName = String(employeeUser?.name || "");
  const names = fullName.split(/\s+/);
  const firstName = names[0];
  const lastName = names[1];

  const shouldGrayOut = () => {
    return dueDateStatus === "OVERDUE" || taskStatus === "CANCELLED";
  };

  return {
    adminUser,
    employeeUser,
    unreadCountByRecipient,
    taskIsNew,
    dueDateStatus,
    firstName,
    lastName,
    shouldGrayOut,
  };
};
