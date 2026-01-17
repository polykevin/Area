import { Injectable, Logger } from "@nestjs/common";
import { ServiceAuthRepository } from "src/auth/service-auth.repository";
import { Octokit } from "@octokit/rest";

@Injectable()
export class GithubService {
    private readonly logger = new Logger(GithubService.name);

    constructor(private authRepo: ServiceAuthRepository) {}

    private async getClient(userId: number): Promise<Octokit> {
        const auth = await this.authRepo.findByUserAndService(userId, 'github');
        if (!auth) throw new Error('User not connected to GitHub');
        return new Octokit({
            auth: auth.accessToken
        })
    }

    async listRepositories(userId: number) {
        const client = await this.getClient(userId);
        const { data } = await client.repos.listForAuthenticatedUser();
        return data;
    }

    async listIssues(userId: number, owner: string, repo: string) {
        const client = await this.getClient(userId);
        const { data } = await client.issues.listForRepo({
            owner,
            repo,
            state: 'open',
        });
        return data;
    }

    async createIssue(
        userId: number,
        owner: string,
        repo: string,
        title: string,
        body?: string,
    ) {
        const client = await this.getClient(userId);
        return client.issues.create({
            owner,
            repo,
            title,
            body
        });
    }
}