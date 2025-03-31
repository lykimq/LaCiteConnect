import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    @Exclude()
    password?: string;

    @Column({ nullable: true })
    firstName?: string;

    @Column({ nullable: true })
    lastName?: string;

    @Column({ nullable: true })
    firebaseUid?: string;

    @Column({ default: false })
    isEmailVerified: boolean;

    @Column({ default: false })
    isPhoneVerified: boolean;

    @Column({ nullable: true })
    phoneNumber?: string;

    @Column({ type: 'jsonb', nullable: true })
    profilePicture?: {
        url: string;
        publicId: string;
    };

    @Column({ type: 'jsonb', nullable: true })
    socialLinks?: {
        google?: string;
        facebook?: string;
        twitter?: string;
    };

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}