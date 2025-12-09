import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    private readonly logger = new Logger(JwtAuthGuard.name);

    canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    this.logger.log(`Incoming request: ${req.method} ${req.url}`);
    this.logger.log(`Authorization header: ${req.headers['authorization']}`);
    return super.canActivate(context);
    }
}