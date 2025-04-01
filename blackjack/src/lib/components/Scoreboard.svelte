
<script lang="ts">
    type GameOutcome = 'win' | 'loss' | 'push' | null;

    let {
        playerScore = 0,
        dealerScore = 0,
        remainingCards = 0,
        gameStatus = 'Press "Deal" to start.',
        deckId = null as string | null,
        outcome = null as GameOutcome
    } : {
        playerScore?: number;
        dealerScore?: number;
        remainingCards?: number;
        gameStatus?: string;
        deckId?: string | null;
        outcome?: GameOutcome;
    } = $props();

    let baseStatusClass = "text-xl font-bold mb-3 uppercase tracking-wider transition-colors duration-300";

    let animationClass = $derived(
        outcome === 'win' ? 'animate-pulse-win' :
            outcome === 'loss' ? 'animate-shake-loss' :
                outcome === 'push' ? 'animate-simple-fade-in' :
                    ''
    );

    let colorClass = $derived(
        outcome === 'win' ? 'text-green-300' :
            outcome === 'loss' ? 'text-red-400' :
                outcome === 'push' ? 'text-yellow-300' :
                    'text-blue-300'
    );

</script>

<div class="scoreboard mb-6 p-5 border border-green-600 rounded-lg bg-gradient-to-b from-gray-800/80 to-gray-900/70 text-white text-center shadow-xl">
    {#key outcome}
        <p class="{baseStatusClass} {colorClass} {animationClass}">
            {gameStatus}
        </p>
    {/key}
    <div class="flex flex-wrap justify-around items-center text-sm text-gray-300 gap-x-4 gap-y-1 mt-2">
        <span>Cards Left: <span class="font-semibold text-white">{remainingCards}</span></span>
        {#if deckId}
            <span class="hidden md:inline">Deck ID: <span class="font-mono text-xs opacity-70">{deckId.substring(0, 8)}...</span></span>
        {/if}
        <span class="font-semibold">Player: <span class="text-white">{playerScore}</span></span>
        <span class="font-semibold">Dealer: <span class="text-white">{dealerScore}</span></span>
    </div>
</div>
