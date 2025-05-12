// Define the Card type for better type safety
export interface Card {
    code: string;
    value: string;
    suit: string;
    image: string;
}

export function calculateHandValue(cards: Card[]): number {
    let value = 0;
    let aceCount = 0;

    if (!Array.isArray(cards)) return 0;

    for (const card of cards) {
        if (!card || !card.value) continue;
        const cardValue = card.value;
        if (['KING', 'QUEEN', 'JACK'].includes(cardValue)) {
            value += 10;
        } else if (cardValue === 'ACE') {
            aceCount += 1;
            value += 11;
        } else {
            const numericValue = parseInt(cardValue, 10);
            if (!isNaN(numericValue)) {
                value += numericValue;
            }
        }
    }

    while (value > 21 && aceCount > 0) {
        value -= 10;
        aceCount -= 1;
    }

    return value;
}