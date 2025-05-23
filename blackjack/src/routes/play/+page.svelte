<script lang="ts">
    import { browser } from '$app/environment';
    import { createNewShuffledDeck, drawCards, type Card } from '$lib/api/deckOfCards';
    import { calculateHandValue } from '$lib/utils/scoring';
    import Hand from '$lib/components/Hand.svelte';
    import Controls from '$lib/components/Controls.svelte';
    import Scoreboard from '$lib/components/Scoreboard.svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';

    type GamePhase = 'INIT' | 'DEALING' | 'PLAYER_TURN' | 'DEALER_TURN' | 'GAME_OVER';
    type GameOutcome = 'win' | 'loss' | 'push' | 'blackjack' | null;

    let deckId = $state<string | null>(null);
    let playerCards = $state<Card[]>([]);
    let dealerCards = $state<Card[]>([]);
    let playerScore = $state<number>(0);
    let dealerScore = $state<number>(0);
    let dealerVisibleScore = $state<number>(0);
    let gamePhase = $state<GamePhase>('INIT');
    let remainingCards = $state<number>(52);
    let isLoading = $state<boolean>(false);
    let isDealingAnimation = $state<boolean>(false);
    let gameStatusMessage = $state<string>('Press Deal to start the game!');
    let gameStatusOutcome = $state<GameOutcome>(null);

    async function handleLogout() {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                goto('/');
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    }

    function navigateToRules() {
        goto('/rules');
    }

    function navigateToHome() {
        goto('/');
    }

    function setStatus(message: string, outcome: GameOutcome = null): void {
        gameStatusMessage = message;
        gameStatusOutcome = outcome;
    }

    async function sleep(ms: number): Promise<unknown> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function _handleGameError(error: Error, context: string = "Game Error"): Promise<void> {
        console.error(`${context}:`, error);
        setStatus(`Error: ${error.message}`, 'loss');
        gamePhase = 'GAME_OVER';
        isLoading = false;
    }

    async function _handleDeckFinish(): Promise<void> {
        setStatus('Deck finished! Shuffling a new one...', 'push');
        try {
            deckId = await createNewShuffledDeck();
            remainingCards = 52;
            setStatus('New deck ready. Press New Game.', null);
            gamePhase = 'GAME_OVER';
        } catch (error) {
            await _handleGameError(error as Error, "Failed to get new deck after finish");
        }
        isLoading = false;
    }

    async function _dealInitialCards(): Promise<void> {
        isDealingAnimation = true;
        const drawResult = await drawCards(deckId as string, 4);
        remainingCards = drawResult.remaining;

        playerCards = [drawResult.cards[0]]; await sleep(200);
        dealerCards = [drawResult.cards[1]]; await sleep(200);
        playerCards = [...playerCards, drawResult.cards[2]]; await sleep(200);
        dealerCards = [...dealerCards, drawResult.cards[3]];

        playerScore = calculateHandValue(playerCards);
        dealerScore = calculateHandValue(dealerCards);
        dealerVisibleScore = calculateHandValue([dealerCards[1]]);
        isDealingAnimation = false;
    }

    async function _startGameLogic(): Promise<void> {
        isLoading = true; gamePhase = 'DEALING'; setStatus('Dealing...');
        playerCards = []; dealerCards = []; playerScore = 0; dealerScore = 0; dealerVisibleScore = 0;
        try {
            if (!deckId) { deckId = await createNewShuffledDeck(); remainingCards = 52; }
            await _dealInitialCards();
            const playerHasBlackjack = playerScore === 21;
            const dealerHasBlackjack = dealerScore === 21;
            if (playerHasBlackjack || (dealerHasBlackjack && dealerCards.length === 2)) {
                dealerVisibleScore = dealerScore; gamePhase = 'GAME_OVER';
                if (playerHasBlackjack && dealerHasBlackjack) setStatus('Push! Both have Blackjack!', 'push');
                else if (playerHasBlackjack) setStatus('Blackjack! You win!', 'blackjack');
                else setStatus('Dealer has Blackjack! You lose.', 'loss');
            } else { gamePhase = 'PLAYER_TURN'; setStatus('Your turn: Hit or Stand?'); }
        } catch (error) {
            if ((error as Error).message === "Deck finished") await _handleDeckFinish();
            else await _handleGameError(error as Error, "startGame");
        } finally { isLoading = false; }
    }

    async function _playerHitLogic(): Promise<void> {
        if (gamePhase !== 'PLAYER_TURN' || isLoading) return;
        isLoading = true; setStatus('Hitting...'); isDealingAnimation = true;
        try {
            const drawResult = await drawCards(deckId as string, 1);
            playerCards = [...playerCards, drawResult.cards[0]];
            remainingCards = drawResult.remaining;
            playerScore = calculateHandValue(playerCards);
            await sleep(300); isDealingAnimation = false;
            if (playerScore > 21) { gamePhase = 'GAME_OVER'; setStatus('Bust! You lose.', 'loss'); }
            else if (playerScore === 21) { setStatus('You have 21! Standing...'); await sleep(500); await _dealerTurnLogic(); }
            else { setStatus('Your turn: Hit or Stand?'); gamePhase = 'PLAYER_TURN'; }
        } catch (error) {
            if ((error as Error).message === "Deck finished") await _handleDeckFinish();
            else await _handleGameError(error as Error, "playerHit");
        } finally { isLoading = false; }
    }

    async function _dealerTurnLogic(): Promise<void> {
        gamePhase = 'DEALER_TURN'; isLoading = true; setStatus("Dealer's turn...");
        dealerVisibleScore = dealerScore; await sleep(800);
        try {
            while (dealerScore < 17) {
                setStatus(`Dealer has ${dealerScore}. Dealer hits...`); await sleep(1000); isDealingAnimation = true;
                const drawResult = await drawCards(deckId as string, 1);
                dealerCards = [...dealerCards, drawResult.cards[0]];
                remainingCards = drawResult.remaining;
                dealerScore = calculateHandValue(dealerCards);
                dealerVisibleScore = dealerScore;
                await sleep(300); isDealingAnimation = false;
            }
            await sleep(500);
            if (dealerScore > 21) setStatus(`Dealer stands with ${dealerScore}. Dealer Busts!`, 'win');
            else setStatus(`Dealer stands with ${dealerScore}.`);
            await sleep(1200);
            gamePhase = 'GAME_OVER';
            if (dealerScore > 21) setStatus('Dealer busts! You win!', 'win');
            else if (playerScore > dealerScore) setStatus(`You win! ${playerScore} beats ${dealerScore}`, 'win');
            else if (dealerScore > playerScore) setStatus(`Dealer wins with ${dealerScore} vs ${playerScore}`, 'loss');
            else setStatus(`Push! Both have ${playerScore}`, 'push');
        } catch (error) {
            if ((error as Error).message === "Deck finished") {
                setStatus('Deck finished during dealer turn. Hand is a Push.', 'push');
                gamePhase = 'GAME_OVER';
                isLoading = false;
                await _handleDeckFinish();
            }
            else await _handleGameError(error as Error, "dealerTurn");
        } finally { isLoading = false; }
    }

    async function _playerStandLogic(): Promise<void> {
        if (gamePhase !== 'PLAYER_TURN' || isLoading) return;
        await _dealerTurnLogic();
    }

    type HandlerFunction = () => Promise<void> | void;

    let startGameHandler = $state<HandlerFunction>(() => {
        console.log("Start Game (noop - client script not ready?)");
        setStatus('Initializing...');
    });

    let playerHitHandler = $state<HandlerFunction>(() => {
        console.log("Hit (noop - client script not ready?)");
    });

    let playerStandHandler = $state<HandlerFunction>(() => {
        console.log("Stand (noop - client script not ready?)");
    });

    $effect(() => {
        if (browser) {
            startGameHandler = _startGameLogic;
            playerHitHandler = _playerHitLogic;
            playerStandHandler = _playerStandLogic;

            console.log("Client-side handlers assigned.");
            // if (!deckId) {
            //    createNewShuffledDeck().then(id => deckId = id).catch(e => _handleGameError(e, "Initial Deck Load"));
            // }
        }
    });

</script>

<div class="game-header">
    <button class="nav-button logout" on:click={handleLogout}>Déconnexion</button>
    <h2 class="game-title">Blackjack</h2>
    <button class="nav-button rules" on:click={navigateToRules}>Règles</button>
</div>

<div class="game-area">
    <Scoreboard
            playerScore={playerScore}
            dealerScore={dealerScore}
            dealerVisibleScore={dealerVisibleScore}
            gamePhase={gamePhase}
            remainingCards={remainingCards}
            gameStatusMessage={gameStatusMessage}
            gameStatusOutcome={gameStatusOutcome}
    />

    <Hand cards={dealerCards} gamePhase={gamePhase} isDealerHand={true} isDealing={isDealingAnimation}/>

    <Hand cards={playerCards} gamePhase={gamePhase} isDealerHand={false} isDealing={isDealingAnimation}/>

    <Controls
            isLoading={isLoading}
            gamePhase={gamePhase}
            on:deal={startGameHandler}
            on:hit={playerHitHandler}
            on:stand={playerStandHandler}
    />
</div>

<style>
    .game-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        margin-bottom: 20px;
    }

    .game-title {
        font-family: 'Playfair Display', serif;
        font-weight: 900;
        font-size: 1.8rem;
        background: linear-gradient(to right, #e6c656, #f7df8e, #e6c656);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin: 0;
    }

    .nav-button {
        padding: 8px 16px;
        background: linear-gradient(to right, #8b4513, #a0522d);
        color: white;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-weight: 600;
        font-size: 0.9rem;
        letter-spacing: 1px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.25);
        transition: all 0.2s ease;
    }

    .nav-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        background: linear-gradient(to right, #a0522d, #cd853f);
    }

    .game-area {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    @media (max-width: 768px) {
        .game-header {
            margin-bottom: 10px;
        }

        .game-title {
            font-size: 1.5rem;
        }

        .nav-button {
            padding: 6px 12px;
            font-size: 0.8rem;
        }
    }
</style>