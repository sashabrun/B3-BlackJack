import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { validateLogin } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const data = await request.json();

        const validationResult = await validateLogin({
            email: data.email || '',
            password: data.password || ''
        });

        if (!validationResult.success || !validationResult.userId) {
            return json({
                success: false,
                errors: validationResult.errors
            }, { status: 400 });
        }

        cookies.set('userId', validationResult.userId, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 7 jours
            domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost'
        });

        return json({ 
            success: true,
            userId: validationResult.userId
        }, { status: 200 });
    } catch (error) {
        console.error('Error in login API:', error);
        return json({
            success: false,
            errors: { form: 'Une erreur est survenue lors de la connexion. Veuillez réessayer plus tard.' }
        }, { status: 500 });
    }
};