
<script lang="ts">
    import Card from './Card.svelte';
    import type { Card as CardType } from '$lib/api/deckOfCards';

    let {
        cards = [] as CardType[],
        title = '',
        hideFirstCard = false,
        score = null as number | null,
        isTurn = false
    }: {
        cards?: CardType[];
        title?: string;
        hideFirstCard?: boolean;
        score?: number | null;
        isTurn?: boolean;
    } = $props();

</script>

<div class="hand-container mb-6 p-4 border border-green-600 rounded-lg min-h-[200px] bg-green-800/70 shadow-inner"
     class:border-yellow-400={isTurn}
     class:shadow-[0_0_15px_rgba(250,204,21,0.5)]={isTurn}>
<h3 class="text-xl font-bold mb-4 text-white/90 flex justify-between items-center px-2">
    <span>{title}</span>
    {#if score !== null}
        <span class="text-lg font-mono bg-gray-900/60 text-yellow-300 px-3 py-1 rounded-md shadow">Score: {score}</span>
    {/if}
</h3>
<div class="cards flex flex-wrap justify-center items-center min-h-[120px]">
    {#if cards.length > 0}
        {#each cards as card, i (card.code)}
            <div class="animate-deal-in">
                <Card card={card} hidden={i === 0 && hideFirstCard} />
            </div>
        {/each}
    {:else}
        <p class="text-gray-400 italic text-sm">No cards yet</p>
    {/if}
</div>
</div>

<style>
    @keyframes dealIn {
        from {
            opacity: 0;
            transform: translateY(-25px) scale(0.9);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    .animate-deal-in {
        animation: dealIn 0.4s ease-out forwards;
    }

    .hand-container {
        transition: border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    }
</style>