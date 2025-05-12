import { prisma } from '$lib/server/prisma';
import bcrypt from 'bcrypt';

export interface SignupData {
    pseudo: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface ValidationResult {
    success: boolean;
    errors: Record<string, string>;
}

export async function validateSignup(data: SignupData): Promise<ValidationResult> {
    console.log('Validating signup data:', { ...data, password: '[HIDDEN]', confirmPassword: '[HIDDEN]' });
    const errors: Record<string, string> = {};

    if (!data.pseudo || data.pseudo.trim() === '') {
        errors.pseudo = 'Le pseudo est requis';
    } else if (data.pseudo.length < 3) {
        errors.pseudo = 'Le pseudo doit contenir au moins 3 caractères';
    }

    if (!data.email || data.email.trim() === '') {
        errors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = 'Format d\'email invalide';
    }

    if (!data.password) {
        errors.password = 'Le mot de passe est requis';
    } else if (data.password.length < 6) {
        errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (!data.confirmPassword) {
        errors.confirmPassword = 'La confirmation du mot de passe est requise';
    } else if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (data.pseudo && !errors.pseudo) {
        try {
            console.log('Checking if pseudo exists:', data.pseudo);
            const existingUserByPseudo = await prisma.user.findUnique({
                where: { pseudo: data.pseudo }
            });
            if (existingUserByPseudo) {
                console.log('Pseudo already exists');
                errors.pseudo = 'Ce pseudo est déjà utilisé';
            }
        } catch (error) {
            console.error('Error checking pseudo uniqueness:', error);
            errors.form = 'Une erreur est survenue lors de la validation du pseudo';
        }
    }

    if (data.email && !errors.email) {
        try {
            console.log('Checking if email exists:', data.email);
            const existingUserByEmail = await prisma.user.findUnique({
                where: { email: data.email }
            });
            if (existingUserByEmail) {
                console.log('Email already exists');
                errors.email = 'Cet email est déjà utilisé';
            }
        } catch (error) {
            console.error('Error checking email uniqueness:', error);
            errors.form = 'Une erreur est survenue lors de la validation de l\'email';
        }
    }

    console.log('Validation result:', { success: Object.keys(errors).length === 0, errors });
    return {
        success: Object.keys(errors).length === 0,
        errors
    };
}

export async function validateLogin(data: LoginData): Promise<ValidationResult & { userId?: string }> {
    const errors: Record<string, string> = {};

    // Check required fields
    if (!data.email || data.email.trim() === '') {
        errors.email = 'L\'email est requis';
    }

    if (!data.password) {
        errors.password = 'Le mot de passe est requis';
    }

    if (Object.keys(errors).length === 0) {
        try {
            const user = await prisma.user.findUnique({
                where: { email: data.email }
            });

            if (!user) {
                errors.email = 'Identifiants incorrects';
                return { success: false, errors };
            }

            const passwordMatch = await bcrypt.compare(data.password, user.password);
            if (!passwordMatch) {
                errors.password = 'Identifiants incorrects';
                return { success: false, errors };
            }

            return {
                success: true,
                errors: {},
                userId: user.id
            };
        } catch (error) {
            console.error('Error validating login:', error);
            errors.form = 'Une erreur est survenue lors de la connexion';
        }
    }

    return {
        success: false,
        errors
    };
}

export async function createUser(data: SignupData) {
    try {
        console.log('Creating user with email:', data.email);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        const newUser = await prisma.user.create({
            data: {
                pseudo: data.pseudo.trim(),
                email: data.email.trim(),
                password: hashedPassword
            }
        });
        console.log('User created successfully:', { id: newUser.id, pseudo: newUser.pseudo });
        return newUser;
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user');
    }
}

export async function getUserById(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                pseudo: true,
                email: true,
                createdAt: true
            }
        });
        return user;
    } catch (error) {
        console.error('Error getting user by ID:', error);
        return null;
    }
}