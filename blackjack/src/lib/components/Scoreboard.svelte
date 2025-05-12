<script lang="ts">
    interface ScoreboardProps {
        playerScore: number;
        dealerScore: number;
        dealerVisibleScore: number;
        gamePhase: string;
        remainingCards: number;
        gameStatusMessage: string;
        gameStatusOutcome: string | null;
    }

    let {
        playerScore = 0,
        dealerScore = 0,
        dealerVisibleScore = 0,
        gamePhase = 'INIT',
        remainingCards = 52,
        gameStatusMessage = '',
        gameStatusOutcome = null
    } = $props<ScoreboardProps>();

    let displayDealerScore = $derived((gamePhase === 'PLAYER_TURN') ? dealerVisibleScore : dealerScore);
</script>

<div class="scoreboard-container">
    <div class="area dealer-area">
        <div class="info-header">
            <span class="label">Dealer</span>
            <span class="score">{displayDealerScore}</span>
        </div>
    </div>

    <div class="mid-section">
        <div
                id="game-status-display"
                class="game-status"
                class:win={gameStatusOutcome === 'win' || gameStatusOutcome === 'blackjack'}
                class:loss={gameStatusOutcome === 'loss'}
                class:push={gameStatusOutcome === 'push'}
                class:win-pulse={gameStatusOutcome === 'win' || gameStatusOutcome === 'blackjack'}
        >
            {gameStatusMessage}
        </div>
        <div class="game-info">
            <span>Cards Left: {remainingCards}</span>
        </div>
    </div>

    <div class="area player-area">
        <div class="info-header">
            <span class="label">Player</span>
            <span class="score">{playerScore}</span>
        </div>
    </div>
</div>

<style>
    .scoreboard-container {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    .area {
        padding: 10px;
        border-radius: 10px;
        background-color: rgba(0,0,0,0.25);
        min-height: 45px;
    }
    .dealer-area { border: 1px solid rgba(230, 198, 86, 0.3); }
    .player-area { border: 1px solid rgba(139, 233, 253, 0.3); }

    .info-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 5px;
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .dealer-area .label { color: #e6c656; }
    .player-area .label { color: #8be9fd; }
    .score {
        background-color: rgba(0,0,0,0.5);
        padding: 4px 12px;
        border-radius: 15px;
        font-weight: bold;
        border: 1px solid #444;
        min-width: 35px;
        text-align: center;
    }

    .mid-section {
        text-align: center;
        margin: 5px 0;
    }
    .game-status {
        padding: 10px 20px;
        background-color: rgba(0,0,0,0.5);
        border-radius: 30px;
        font-size: 1.1rem;
        margin: 0 auto 10px auto;
        max-width: 450px;
        border: 1px solid #777;
        min-height: 1.3em; line-height: 1.3em;
        transition: all 0.3s ease;
    }
    .game-status.win, .game-status.blackjack { color: #50fa7b; border-color: #50fa7b; }
    .game-status.loss { color: #ff5555; border-color: #ff5555; }
    .game-status.push { color: #f1fa8c; border-color: #f1fa8c; }

    .game-info {
        font-size: 0.9rem;
        color: #bbb;
    }

    @media (max-width: 768px) {
        .area { min-height: 40px; }
        .info-header { font-size: 0.9rem; }
        .score { padding: 3px 10px; font-size: 0.9rem;}
        .game-status { font-size: 1rem; max-width: 90%; padding: 8px 15px;}
    }
</style>