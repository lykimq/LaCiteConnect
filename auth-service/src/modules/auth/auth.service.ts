import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { FirebaseService } from '../firebase/firebase.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private firebaseService: FirebaseService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async registerWithEmail(email: string, password: string, firstName?: string, lastName?: string) {
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.usersService.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });

        const { password: _, ...result } = user;
        return result;
    }

    async loginWithFirebase(firebaseToken: string) {
        try {
            const decodedToken = await this.firebaseService.verifyIdToken(firebaseToken);
            const { uid, email } = decodedToken;

            let user = await this.usersService.findByFirebaseUid(uid);
            if (!user) {
                user = await this.usersService.create({
                    email,
                    firebaseUid: uid,
                    isEmailVerified: true,
                });
            }

            const payload = { email: user.email, sub: user.id };
            return {
                access_token: this.jwtService.sign(payload),
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid Firebase token');
        }
    }

    async verifyEmail(token: string) {
        try {
            const decoded = this.jwtService.verify(token);
            await this.usersService.update(decoded.sub, {
                isEmailVerified: true,
            });
            return { message: 'Email verified successfully' };
        } catch (error) {
            throw new UnauthorizedException('Invalid verification token');
        }
    }

    async sendPasswordResetEmail(email: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new BadRequestException('User not found');
        }

        const token = this.jwtService.sign(
            { email: user.email, sub: user.id },
            { expiresIn: '1h' },
        );

        // TODO: Implement email sending logic
        return { message: 'Password reset email sent' };
    }

    async resetPassword(token: string, newPassword: string) {
        try {
            const decoded = this.jwtService.verify(token);
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await this.usersService.update(decoded.sub, {
                password: hashedPassword,
            });
            return { message: 'Password reset successfully' };
        } catch (error) {
            throw new UnauthorizedException('Invalid reset token');
        }
    }
}