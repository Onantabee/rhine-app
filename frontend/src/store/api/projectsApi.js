import { baseApi } from "./baseApi";

const projectsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProjects: builder.query({
            query: () => "/api/projects",
            providesTags: ["Project"],
        }),
        getProjectById: builder.query({
            query: (projectId) => `/api/projects/${projectId}`,
            providesTags: (result, error, projectId) => [
                { type: "Project", id: projectId },
            ],
        }),
        createProject: builder.mutation({
            query: (data) => ({
                url: "/api/projects",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Project"],
        }),
        updateProject: builder.mutation({
            query: ({ projectId, ...data }) => ({
                url: `/api/projects/${projectId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: "Project", id: projectId },
                "Project",
            ],
        }),
        deleteProject: builder.mutation({
            query: (projectId) => ({
                url: `/api/projects/${projectId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Project"],
        }),
        getProjectMembers: builder.query({
            query: (projectId) => `/api/projects/${projectId}/members`,
            providesTags: (result, error, projectId) => [
                { type: "ProjectMember", id: projectId },
            ],
        }),
        inviteMember: builder.mutation({
            query: ({ projectId, ...data }) => ({
                url: `/api/projects/${projectId}/members`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: "ProjectMember", id: projectId },
            ],
        }),
        acceptInvite: builder.mutation({
            query: (token) => ({
                url: `/api/projects/accept-invite`,
                method: "POST",
                params: { token },
            }),
            invalidatesTags: ["Project"],
        }),
        removeMember: builder.mutation({
            query: ({ projectId, email }) => ({
                url: `/api/projects/${projectId}/members/${email}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: "ProjectMember", id: projectId },
            ],
        }),
        getMyRoleInProject: builder.query({
            query: (projectId) => `/api/projects/${projectId}/my-role`,
        }),
    }),
});

export const {
    useGetProjectsQuery,
    useGetProjectByIdQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    useGetProjectMembersQuery,
    useInviteMemberMutation,
    useAcceptInviteMutation,
    useRemoveMemberMutation,
    useGetMyRoleInProjectQuery,
} = projectsApi;

export default projectsApi;
