const BASE_URL = 'https://deckofcardsapi.com/api/deck';

/** @typedef { { code: string, image: string, images: { svg: string, png: string }, value: string, suit: string } } Card */
/** @typedef { { success: boolean, deck_id: string, remaining: number, shuffled: boolean } } DeckInfo */
/** @typedef { { success: boolean, deck_id: string, cards: Card[], remaining: number } } DrawResponse */
/** @typedef { { success: boolean, error: string } } ApiError */


/**
 * Crée un nouveau paquet de cartes mélangé.
 * @returns {Promise<string|null>} L'ID du paquet ou null en cas d'erreur.
 */
export async function createNewShuffledDeck() {
    try {
        const response = await fetch(`${BASE_URL}/new/shuffle/?deck_count=1`);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        /** @type {DeckInfo | ApiError} */
        const data = await response.json();
        if (data.success) {
            // @ts-ignore
            return data.deck_id;
        } else {
            console.error('API Error (create deck):', data);
            return null;
        }
    } catch (error) {
        console.error('Fetch Error (create deck):', error);
        return null;
    }
}

/**
 * Tire un certain nombre de cartes d'un paquet spécifique.
 * @param {string} deckId L'ID du paquet.
 * @param {number} count Le nombre de cartes à tirer.
 * @returns {Promise<{cards: Card[], remaining: number}|null>} Les cartes tirées et le nombre restant, ou null.
 */
export async function drawCards(deckId, count) {
    if (!deckId) {
        console.error('No deck ID provided for drawing cards');
        return null;
    }
    try {
        const response = await fetch(`${BASE_URL}/${deckId}/draw/?count=${count}`);
        if (!response.ok && response.status !== 404) {
            throw new Error(`API Error: ${response.status}`);
        }

        /** @type {DrawResponse | ApiError} */
        const data = await response.json();

        if (data.success) {
            // @ts-ignore
            return { cards: data.cards, remaining: data.remaining };
        } else {
            // @ts-ignore
            if (data.error && data.error.includes("Not enough cards remaining")) {
                console.warn("Deck empty or not enough cards to draw.");
                return { cards: [], remaining: 0 };
            }
            console.error('API Error (draw cards):', data);
            return null;
        }
    } catch (error) {
        console.error('Fetch Error (draw cards):', error);
        return null;
    }
}

/**
 * Remélange les cartes restantes dans le paquet.
 * @param {string} deckId L'ID du paquet.
 * @returns {Promise<boolean>} True si réussi, false sinon.
 */
export async function reshuffleDeck(deckId) {
    return false;
}