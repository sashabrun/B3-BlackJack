import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getUserById } from '$lib/server/auth';

export const GET: RequestHandler = async ({ url, cookies }) => {
    const userId = cookies.get('userId');

    if (!userId) {
        return json({
            authenticated: false
        }, { status: 401 });
    }

    try {
        const user = await getUserById(userId);

        if (!user) {
            return json({
                authenticated: false
            }, { status: 401 });
        }

        return json({
            authenticated: true,
            user: {
                id: user.id,
                pseudo: user.pseudo,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        return json({
            authenticated: false,
            error: 'Une erreur est survenue lors de la récupération des informations utilisateur.'
        }, { status: 500 });
    }
};