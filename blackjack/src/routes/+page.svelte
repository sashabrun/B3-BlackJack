
<script lang="ts">
    // ... (le reste du script reste identique)
    import { onMount } from 'svelte';
    import { createNewShuffledDeck, drawCards } from '$lib/api/deckOfCards.js';
    import { calculateHandValue } from '$lib/utils/scoring.js';
    import Hand from '$lib/components/Hand.svelte';
    import Controls from '$lib/components/Controls.svelte';
    import Scoreboard from '$lib/components/Scoreboard.svelte';
    import type { Card as CardType } from '$lib/api/deckOfCards';

    type GamePhase = 'INIT' | 'PLAYER_TURN' | 'DEALER_TURN' | 'GAME_OVER';
    type GameOutcome = 'win' | 'loss' | 'push' | null;

    let deckId = $state<string | null>(null);
    let playerCards = $state<CardType[]>([]);
    let dealerCards = $state<CardType[]>([]);
    let remainingCards = $state<number>(0);
    let gameStatus = $state<string>('Press "Deal" to start a new game!');
    let gamePhase = $state<GamePhase>('INIT');
    let gameOutcome = $state<GameOutcome>(null);
    let isLoading = $state<boolean>(false);

    let playerScore = $derived(calculateHandValue(playerCards));
    let dealerVisibleScore = $derived(gamePhase === 'PLAYER_TURN' ? calculateHandValue(dealerCards.slice(0, 1)) : calculateHandValue(dealerCards));
    let finalDealerScore = $derived(calculateHandValue(dealerCards));

    let canDeal = $derived(!isLoading && (gamePhase === 'INIT' || gamePhase === 'GAME_OVER'));
    let canHit = $derived(!isLoading && gamePhase === 'PLAYER_TURN');
    let canStand = $derived(!isLoading && gamePhase === 'PLAYER_TURN');
    let dealButtonText = $derived(gamePhase === 'INIT' ? 'Deal Cards' : 'Play Again');

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    async function startGame() {
        isLoading = true;
        gameOutcome = null;
        gameStatus = 'Shuffling and Dealing...';
        playerCards = [];
        dealerCards = [];
        gamePhase = 'INIT';

        try {
            const newDeckId = await createNewShuffledDeck();
            if (!newDeckId) throw new Error('Failed to create a new deck.');
            deckId = newDeckId;

            const initialDraw = await drawCards(deckId, 4);
            if (!initialDraw || initialDraw.cards.length < 4) {
                if (initialDraw?.remaining === 0) gameStatus = "Deck is empty!";
                throw new Error('Failed to draw initial cards.');
            }

            await delay(100);

            playerCards = [initialDraw.cards[0], initialDraw.cards[2]];
            dealerCards = [initialDraw.cards[1], initialDraw.cards[3]];
            remainingCards = initialDraw.remaining;

            if (playerScore === 21) {
                if (finalDealerScore === 21) {
                    determineWinner('Push! Both have Blackjack!');
                } else {
                    determineWinner('Blackjack! Player wins!');
                }
            } else if (finalDealerScore === 21) {
                determineWinner('Dealer has Blackjack! Dealer wins.');
            } else {
                gameStatus = "Player's Turn: Hit or Stand?";
                gamePhase = 'PLAYER_TURN';
            }

        } catch (error: any) {
            gameStatus = `Error starting game: ${error.message}`;
            gamePhase = 'GAME_OVER';
            deckId = null;
        } finally {
            isLoading = false;
        }
    }

    async function playerHit() {
        if (!canHit) return;
        isLoading = true;
        gameStatus = 'Hitting...';

        try {
            const drawResult = await drawCards(deckId!, 1);
            if (!drawResult || drawResult.cards.length === 0) {
                if (drawResult?.remaining === 0) gameStatus = "Deck is empty! Cannot hit.";
                playerStand();
                return;
            }

            await delay(100);

            playerCards = [...playerCards, drawResult.cards[0]];
            remainingCards = drawResult.remaining;

            if (playerScore > 21) {
                determineWinner('Player Busts! Dealer wins.');
            } else if (playerScore === 21) {
                playerStand();
            } else {
                gameStatus = "Player's Turn: Hit or Stand?";
            }
        } catch (error: any) {
            gameStatus = `Error during Hit: ${error.message}`;
            gamePhase = 'GAME_OVER';
        } finally {
            isLoading = false;
        }
    }

    function playerStand() {
        if (!canStand) return;
        gamePhase = 'DEALER_TURN';
        gameStatus = "Dealer's Turn...";
        dealerPlay();
    }

    async function dealerPlay() {
        isLoading = true;

        await delay(800);

        while (finalDealerScore < 17) {
            gameStatus = `Dealer has ${finalDealerScore}. Dealer hits...`;
            await delay(1000);

            try {
                const drawResult = await drawCards(deckId!, 1);
                if (!drawResult || drawResult.cards.length === 0) {
                    if (drawResult?.remaining === 0) gameStatus = "Deck is empty! Dealer stands.";
                    break;
                }

                await delay(100);

                dealerCards = [...dealerCards, drawResult.cards[0]];
                remainingCards = drawResult.remaining;

            } catch(error: any) {
                gameStatus = `Error during Dealer's turn: ${error.message}`;
                gamePhase = 'GAME_OVER';
                isLoading = false;
                return;
            }
        }

        if (finalDealerScore > 21) {
            determineWinner('Dealer Busts! Player wins!');
        } else {
            if (playerScore > finalDealerScore) {
                determineWinner(`Player wins! ${playerScore} vs ${finalDealerScore}`);
            } else if (finalDealerScore > playerScore) {
                determineWinner(`Dealer wins! ${finalDealerScore} vs ${playerScore}`);
            } else {
                determineWinner(`Push! Both have ${playerScore}`);
            }
        }

        isLoading = false;
    }

    function determineWinner(finalStatus: string) {
        gameStatus = finalStatus;
        gamePhase = 'GAME_OVER';

        if (playerScore > 21) gameOutcome = 'loss';
        else if (finalDealerScore > 21) gameOutcome = 'win';
        else if (playerScore > finalDealerScore) gameOutcome = 'win';
        else if (finalDealerScore > playerScore) gameOutcome = 'loss';
        else gameOutcome = 'push';

        isLoading = false;
    }
</script>

<main class="container mx-auto p-4 sm:p-6 md:p-8 min-h-screen bg-green-700 rounded-b-xl shadow-2xl max-w-4xl">
    <h1 class="text-4xl sm:text-5xl font-black text-center my-6 sm:my-8 text-yellow-300 tracking-wide uppercase" style="text-shadow: 2px 2px 0px rgba(0,0,0,0.4), 4px 4px 0px rgba(0,0,0,0.2);">
        Blackjack Arena
    </h1>

    <Scoreboard
            playerScore={playerScore}
            dealerScore={dealerVisibleScore}
            remainingCards={remainingCards}
            gameStatus={gameStatus}
            deckId={deckId}
            outcome={gameOutcome}
    />

    <div class="game-area mt-8">
        <Hand
                title="Dealer's Hand"
                cards={dealerCards}
                hideFirstCard={gamePhase === 'PLAYER_TURN'}
                score={dealerVisibleScore}
                isTurn={gamePhase === 'DEALER_TURN'}
        />
        <Hand
                title="Player's Hand"
                cards={playerCards}
                score={playerScore}
                isTurn={gamePhase === 'PLAYER_TURN'}
        />
    </div>

    <Controls
            canDeal={canDeal}
            canHit={canHit}
            canStand={canStand}
            isLoading={isLoading}
            dealText={dealButtonText}
            on:deal={startGame}
            on:hit={playerHit}
            on:stand={playerStand}
    />

    <footer class="text-center text-xs text-green-200/70 mt-10 pb-4">
        Powered by <a href="https://deckofcardsapi.com/" target="_blank" rel="noopener noreferrer" class="hover:text-yellow-300 underline">Deck of Cards API</a> | SvelteKit & TailwindCSS
    </footer>

</main>

<style>
    main {
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(0,0,0,0.2);
    }
</style>