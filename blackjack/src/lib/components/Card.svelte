<script lang="ts">
    import type {Card} from '$lib/api/deckOfCards';

    interface CardProps {
        cardData: Card | null;
        isHidden: boolean;
        isDealing: boolean;
    }

    let {cardData = null, isHidden = false, isDealing = false} = $props<CardProps>();

    const cardBackImage = "https://deckofcardsapi.com/static/img/back.png";

    let dealingClass = $state('');

    $effect(() => {
        if (isDealing) {
            dealingClass = 'dealing';
            const timer = setTimeout(() => {
                dealingClass = '';
            }, 500);

            return () => {
                clearTimeout(timer);
            };
        }
    });
</script>

<div class="card {dealingClass}">
    {#if isHidden || !cardData}
        <img src={cardBackImage} alt="Card back"/>
    {:else}
        <img src={cardData.image} alt={`${cardData.value} of ${cardData.suit}`}/>
    {/if}
</div>

<style>
    .card {
        width: 90px;
        height: 125px;
        background-color: white;
        border-radius: 6px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        display: inline-block;
        margin: 3px;
        position: relative;
        overflow: hidden;
        transition: transform 0.3s ease;
    }

    .card:hover {
        transform: translateY(-6px) rotate(1.5deg);
        z-index: 10;
    }

    img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 6px;
    }

    @keyframes dealAnimation {
        from {
            transform: translate(50px, -100px) rotate(20deg) scale(0.5);
            opacity: 0;
        }
        to {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
        }
    }

    .card.dealing {
        animation: dealAnimation 0.4s ease-out;
    }

    @media (max-width: 768px) {
        .card {
            width: 55px;
            height: 78px;
            margin: 2px;
        }
    }
</style>