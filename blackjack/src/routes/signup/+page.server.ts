import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';
import { validateSignup, createUser } from '$lib/server/auth';

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        let formData;
        let data = {
            pseudo: '',
            email: '',
            password: '',
            confirmPassword: ''
        };

        try {
            formData = await request.formData();

            data = {
                pseudo: formData.get('pseudo')?.toString() || '',
                email: formData.get('email')?.toString() || '',
                password: formData.get('password')?.toString() || '',
                confirmPassword: formData.get('confirmPassword')?.toString() || ''
            };

            const validationResult = await validateSignup(data);

            if (!validationResult.success) {
                return fail(400, {
                    data: {
                        pseudo: data.pseudo,
                        email: data.email
                    },
                    errors: validationResult.errors
                });
            }

            const user = await createUser(data);

            throw redirect(303, '/play');
        } catch (error) {
            console.error('Error in signup action:', error);

            if (error instanceof Response) {
                throw error;
            }

            return fail(500, {
                data: {
                    pseudo: data.pseudo,
                    email: data.email
                },
                errors: {
                    form: 'Une erreur est survenue lors de la création du compte. Veuillez réessayer plus tard.'
                }
            });
        }
    }
};