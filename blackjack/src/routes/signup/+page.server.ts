import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';
import { validateSignup, createUser } from '$lib/server/auth';

export const actions: Actions = {
    default: async ({ request }) => {
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

            console.log('Form submission received:', {
                pseudo: data.pseudo,
                email: data.email,
                hasPassword: !!data.password,
                hasConfirmPassword: !!data.confirmPassword
            });

            const validationResult = await validateSignup(data);

            if (!validationResult.success) {
                console.log('Validation failed:', validationResult.errors);
                return fail(400, {
                    data: {
                        pseudo: data.pseudo,
                        email: data.email
                    },
                    errors: validationResult.errors
                });
            }

            console.log('Validation passed, creating user');
            const user = await createUser(data);
            console.log('User created successfully:', { id: user.id });

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