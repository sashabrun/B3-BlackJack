
<script lang="ts">
    import type { Card as CardType } from '$lib/api/deckOfCards';

    let {
        card = null as CardType | null,
        hidden = false
    } : {
        card?: CardType | null;
        hidden?: boolean;
    } = $props();

    const cardBackUrl = 'https://deckofcardsapi.com/static/img/back.png';

    let imageUrl = $derived(hidden || !card ? cardBackUrl : card.images.png);
    let altText = $derived(hidden || !card ? 'Card back' : `${card.value} of ${card.suit}`);
</script>

<div class="card inline-block w-20 h-28 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden mx-1.5 my-1 transition-transform duration-300 ease-out hover:scale-105">
    <img src={imageUrl} alt={altText} class="w-full h-full object-contain" draggable="false" />
</div>