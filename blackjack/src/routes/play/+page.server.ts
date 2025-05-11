import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export const load = async ({ cookies }: RequestEvent) => {
    const userId = cookies.get('userId');

    if (!userId) {
        throw redirect(303, '/login');
    }

    return {
        userId
    };
}; 