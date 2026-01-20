import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Ajouter une gestion d'erreur personnalisée
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // Vous pouvez lancer une exception basée sur "info" ou "err"
    if (err || !user) {
      throw err || new UnauthorizedException('Token invalide ou manquant. Utilisez le format: Authorization: Bearer <token>');
    }
    return user;
  }
}