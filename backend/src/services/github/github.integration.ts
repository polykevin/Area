import { createIssueReaction } from "./reactions/create-issue.reaction";

export function githubIntegration(githubService, authRepo, engine, newIssueHook) {
    return {
        id: 'github',
        displayName: 'Github',

        instance: {
            githubService,
            authRepo,
            engine,
        },

        actions: [
            newIssueHook,
        ],

        reactions: [
            createIssueReaction,
        ],

        hooks: [
            newIssueHook,
        ]
    }
}