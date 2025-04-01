<script>
    import Card from '$lib/components/Card.svelte';

    let { cards = [], isDealerHand = false, gamePhase = 'INIT', isDealing = false } = $props();
</script>

<div class="cards-container">
    {#if cards.length === 0}
        <div class="card-placeholder"></div>
        <div class="card-placeholder"></div>
    {:else}
        {#each cards as card, index (card.code)}
            <Card
                    cardData={card}
                    isHidden={isDealerHand && index === 0 && gamePhase === 'PLAYER_TURN'}
                    {isDealing}
            />
        {/each}
    {/if}
</div>

<style>
    .cards-container {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 5px;
        min-height: 110px;
        padding: 5px;
        position: relative;
    }
    .card-placeholder {
        width: 70px;
        height: 100px;
        border-radius: 6px;
        background-color: rgba(255, 255, 255, 0.08);
        margin: 3px;
        box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    }
    @media (max-width: 768px) {
        .card-placeholder {
            width: 55px;
            height: 78px;
        }
        .cards-container {
            min-height: 85px;
        }
    }
</style>