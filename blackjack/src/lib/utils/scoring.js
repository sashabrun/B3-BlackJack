/** @typedef { import('$lib/api/deckOfCards').Card } Card */

/**
 * Calcule la valeur d'une main de Blackjack.
 * @param {Card[]} hand Un tableau d'objets carte.
 * @returns {number} La valeur de la main.
 */
export function calculateHandValue(hand) {
    let value = 0;
    let aceCount = 0;

    if (!hand || hand.length === 0) {
        return 0;
    }

    for (const card of hand) {
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