const API_BASE_URL = 'https://deckofcardsapi.com/api/deck';

export interface Card {
    code: string;
    value: string;
    suit: string;
    image: string;
}

interface DeckResponse {
    success: boolean;
    deck_id: string;
    shuffled: boolean;
    remaining: number;
    error?: string;
}

interface DrawCardResponse extends DeckResponse {
    cards: Card[];
}

export async function createNewShuffledDeck(): Promise<string> {
    try {
        const response = await fetch(`${API_BASE_URL}/new/shuffle/?deck_count=1`);
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        const data = await response.json() as DeckResponse;
        if (!data.success) throw new Error('API did not return success for new deck.');
        console.log("New deck created:", data.deck_id);
        return data.deck_id;
    } catch (error) {
        console.error('Error creating deck:', error);
        throw error;
    }
}

export async function drawCards(deckId: string, count: number): Promise<{ cards: Card[], remaining: number }> {
    if (!deckId) throw new Error('No deck ID provided for drawing cards.');
    try {
        const response = await fetch(`${API_BASE_URL}/${deckId}/draw/?count=${count}`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})) as Partial<DeckResponse>;
            if (response.status === 404 || (errorData.error && errorData.error.includes("Not enough cards remaining"))) {
                console.warn("Deck finished!");
                throw new Error("Deck finished");
            }
            throw new Error(`API Error drawing cards: ${response.statusText}`);
        }
        const data = await response.json() as DrawCardResponse;
        if (!data.success) {
            if (data.error && data.error.includes("Not enough cards remaining")) {
                console.warn("Deck finished!");
                throw new Error("Deck finished");
            }
            throw new Error(`API did not return success for drawing cards: ${data.error || 'Unknown reason'}`);
        }
        console.log(`Drew ${count} cards. Remaining: ${data.remaining}`);
        return { cards: data.cards, remaining: data.remaining };
    } catch (error) {
        console.error('Error drawing cards:', error);
        throw error;
    }
}