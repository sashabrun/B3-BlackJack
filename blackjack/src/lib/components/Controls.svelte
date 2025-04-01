
<script>
    import { createEventDispatcher } from 'svelte';

    let { isLoading = false, gamePhase = 'INIT' } = $props();

    const dispatch = createEventDispatcher();

    let canDeal = $derived((gamePhase === 'INIT' || gamePhase === 'GAME_OVER') && !isLoading);
    let canHit = $derived(gamePhase === 'PLAYER_TURN' && !isLoading);
    let canStand = $derived(gamePhase === 'PLAYER_TURN' && !isLoading);
    let dealButtonText = $derived((gamePhase === 'INIT') ? 'Deal' : 'New Game');
</script>

<div class="controls">
    <button
            class="control-btn deal"
            disabled={!canDeal}
            onclick={() => dispatch('deal')}
    >
        {dealButtonText}
    </button>
    <button
            class="control-btn hit"
            disabled={!canHit}
            onclick={() => dispatch('hit')}
    >
        Hit
    </button>
    <button
            class="control-btn stand"
            disabled={!canStand}
            onclick={() => dispatch('stand')}
    >
        Stand
    </button>
</div>

<style>
    .controls {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-top: 30px;
        flex-wrap: wrap;
    }

    .control-btn {
        padding: 12px 25px;
        border: none;
        border-radius: 30px;
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        min-width: 110px;
        text-transform: uppercase;
        letter-spacing: 1px;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0,0,0,0.25);
        color: white;
    }

    .control-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: #555 !important;
        color: #aaa !important;
        box-shadow: none;
    }
    .control-btn:disabled::after {
        display: none;
    }

    .control-btn::after {
        content: '';
        position: absolute;
        top: -50%;
        left: -60%;
        width: 20%;
        height: 200%;
        background: rgba(255,255,255,0.15);
        transform: rotate(30deg);
        transition: all 0.6s ease;
    }

    .control-btn:hover:not(:disabled)::after {
        left: 120%;
    }
    .control-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.3);
    }

    .control-btn.deal {
        background: linear-gradient(to right, #2980b9, #3498db);
    }
    .control-btn.hit {
        background: linear-gradient(to right, #e67e22, #f39c12);
    }
    .control-btn.stand {
        background: linear-gradient(to right, #c0392b, #e74c3c);
    }

    @media (max-width: 768px) {
        .control-btn {
            padding: 10px 20px;
            min-width: 90px;
            font-size: 0.8rem;
        }
        .controls {
            gap: 10px;
            margin-top: 20px;
        }
    }
</style>