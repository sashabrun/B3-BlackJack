import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { validateSignup, createUser } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const data = await request.json();

        const validationResult = await validateSignup({
            pseudo: data.pseudo || '',
            email: data.email || '',
            password: data.password || '',
            confirmPassword: data.confirmPassword || ''
        });

        if (!validationResult.success) {
            return json({ success: false, errors: validationResult.errors }, { status: 400 });
        }

        const user = await createUser({
            pseudo: data.pseudo,
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword
        });

        return json({
            success: true,
            user: {
                id: user.id,
                pseudo: user.pseudo,
                email: user.email
            }
        }, { status: 201 });
    } catch (error) {
        console.error('Error in signup API:', error);
        return json({
            success: false,
            errors: { form: 'Une erreur est survenue lors de la création du compte. Veuillez réessayer plus tard.' }
        }, { status: 500 });
    }
};