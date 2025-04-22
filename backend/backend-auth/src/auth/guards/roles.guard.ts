import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType } from '@prisma/client';

/**
 * Roles Guard
 * This guard implements role-based access control (RBAC)
 * It checks if the user has the required role to access a route
 */
@Injectable()
export class RolesGuard implements CanActivate {

    // Constructor for the RolesGuard
    constructor(private reflector: Reflector) { }

    /**
     * Check if the user has the required role
     * @param context Execution context containing request information
     * @returns boolean indicating if access is allowed
     */
    canActivate(context: ExecutionContext): boolean {

        // Get the required roles from the reflector
        const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>('roles', [
            context.getHandler(), // Get the handler from the context
            context.getClass(), // Get the class from the context
        ]);

        // If no roles are required, allow access
        if (!requiredRoles) {
            return true;
        }

        // Get the user from the request
        const { user } = context.switchToHttp().getRequest();

        // Check if the user has the required role
        return requiredRoles.some((role) => user.role === role);
    }
}