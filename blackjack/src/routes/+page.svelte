
<script>
    import { browser } from '$app/environment';
    import { createNewShuffledDeck, drawCards } from '$lib/api/deckOfCards.js';
    import { calculateHandValue } from '$lib/utils/scoring.js';
    import Hand from '$lib/components/Hand.svelte';
    import Controls from '$lib/components/Controls.svelte';
    import Scoreboard from '$lib/components/Scoreboard.svelte';

    let deckId = $state(null);
    let playerCards = $state([]);
    let dealerCards = $state([]);
    let playerScore = $state(0);
    let dealerScore = $state(0);
    let dealerVisibleScore = $state(0);
    let gamePhase = $state('INIT');
    let remainingCards = $state(52);
    let isLoading = $state(false);
    let isDealingAnimation = $state(false);
    let gameStatusMessage = $state('Press Deal to start the game!');
    let gameStatusOutcome = $state(null);

    function setStatus(message, outcome = null) {
        gameStatusMessage = message;
        gameStatusOutcome = outcome;
    }

    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function _handleGameError(error, context = "Game Error") {
        console.error(`${context}:`, error);
        setStatus(`Error: ${error.message}`, 'loss');
        gamePhase = 'GAME_OVER';
        isLoading = false;
    }

    async function _handleDeckFinish() {
        setStatus('Deck finished! Shuffling a new one...', 'push');
        try {
            deckId = await createNewShuffledDeck();
            remainingCards = 52;
            setStatus('New deck ready. Press New Game.', null);
            gamePhase = 'GAME_OVER';
        } catch (error) {
            await _handleGameError(error, "Failed to get new deck after finish");
        }
        isLoading = false;
    }

    async function _dealInitialCards() {
        isDealingAnimation = true;
        const drawResult = await drawCards(deckId, 4);
        remainingCards = drawResult.remaining;

        playerCards = [drawResult.cards[0]]; await sleep(200);
        dealerCards = [drawResult.cards[1]]; await sleep(200);
        playerCards = [...playerCards, drawResult.cards[2]]; await sleep(200);
        dealerCards = [...dealerCards, drawResult.cards[3]];

        playerScore = calculateHandValue(playerCards); dealerScore = calculateHandValue(dealerCards); dealerVisibleScore = calculateHandValue([dealerCards[1]]);
        isDealingAnimation = false;
    }

    async function _startGameLogic() {
        isLoading = true; gamePhase = 'DEALING'; setStatus('Dealing...');
        playerCards = []; dealerCards = []; playerScore = 0; dealerScore = 0; dealerVisibleScore = 0;
        try {
            if (!deckId) { deckId = await createNewShuffledDeck(); remainingCards = 52; }
            await _dealInitialCards();
            const playerHasBlackjack = playerScore === 21; const dealerHasBlackjack = dealerScore === 21;
            if (playerHasBlackjack || (dealerHasBlackjack && dealerCards.length === 2)) {
                dealerVisibleScore = dealerScore; gamePhase = 'GAME_OVER';
                if (playerHasBlackjack && dealerHasBlackjack) setStatus('Push! Both have Blackjack!', 'push');
                else if (playerHasBlackjack) setStatus('Blackjack! You win!', 'blackjack');
                else setStatus('Dealer has Blackjack! You lose.', 'loss');
            } else { gamePhase = 'PLAYER_TURN'; setStatus('Your turn: Hit or Stand?'); }
        } catch (error) {
            if (error.message === "Deck finished") await _handleDeckFinish(); else await _handleGameError(error, "startGame");
        } finally { isLoading = false; }
    }

    async function _playerHitLogic() {
        if (gamePhase !== 'PLAYER_TURN' || isLoading) return;
        isLoading = true; setStatus('Hitting...'); isDealingAnimation = true;
        try {
            const drawResult = await drawCards(deckId, 1);
            playerCards = [...playerCards, drawResult.cards[0]]; remainingCards = drawResult.remaining; playerScore = calculateHandValue(playerCards);
            await sleep(300); isDealingAnimation = false;
            if (playerScore > 21) { gamePhase = 'GAME_OVER'; setStatus('Bust! You lose.', 'loss'); }
            else if (playerScore === 21) { setStatus('You have 21! Standing...'); await sleep(500); await _dealerTurnLogic(); }
            else { setStatus('Your turn: Hit or Stand?'); gamePhase = 'PLAYER_TURN'; }
        } catch (error) {
            if (error.message === "Deck finished") await _handleDeckFinish(); else await _handleGameError(error, "playerHit");
        } finally { isLoading = false; }
    }

    async function _dealerTurnLogic() {
        gamePhase = 'DEALER_TURN'; isLoading = true; setStatus("Dealer's turn...");
        dealerVisibleScore = dealerScore; await sleep(800);
        try {
            while (dealerScore < 17) {
                setStatus(`Dealer has ${dealerScore}. Dealer hits...`); await sleep(1000); isDealingAnimation = true;
                const drawResult = await drawCards(deckId, 1);
                dealerCards = [...dealerCards, drawResult.cards[0]]; remainingCards = drawResult.remaining; dealerScore = calculateHandValue(dealerCards); dealerVisibleScore = dealerScore;
                await sleep(300); isDealingAnimation = false;
            }
            await sleep(500);
            if (dealerScore > 21) setStatus(`Dealer stands with ${dealerScore}. Dealer Busts!`, 'win'); else setStatus(`Dealer stands with ${dealerScore}.`);
            await sleep(1200);
            gamePhase = 'GAME_OVER';
            if (dealerScore > 21) setStatus('Dealer busts! You win!', 'win');
            else if (playerScore > dealerScore) setStatus(`You win! ${playerScore} beats ${dealerScore}`, 'win');
            else if (dealerScore > playerScore) setStatus(`Dealer wins with ${dealerScore} vs ${playerScore}`, 'loss');
            else setStatus(`Push! Both have ${playerScore}`, 'push');
        } catch (error) {
            if (error.message === "Deck finished") { setStatus('Deck finished during dealer turn. Hand is a Push.', 'push'); gamePhase = 'GAME_OVER'; isLoading = false; await _handleDeckFinish(); }
            else await _handleGameError(error, "dealerTurn");
        } finally { isLoading = false; }
    }

    async function _playerStandLogic() {
        if (gamePhase !== 'PLAYER_TURN' || isLoading) return;
        await _dealerTurnLogic();
    }

    let startGameHandler = $state(() => { console.log("Start Game (noop - client script not ready?)"); setStatus('Initializing...');});
    let playerHitHandler = $state(() => { console.log("Hit (noop - client script not ready?)"); });
    let playerStandHandler = $state(() => { console.log("Stand (noop - client script not ready?)"); });

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

    <Hand cards={dealerCards} {gamePhase} isDealerHand={true} {isDealingAnimation}/>

    <Hand cards={playerCards} {gamePhase} {isDealingAnimation}/>

    <Controls
            {isLoading}
            {gamePhase}
            on:deal={startGameHandler}
            on:hit={playerHitHandler}
            on:stand={playerStandHandler}
    />

</div>

<style>
    .game-area {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
</style>