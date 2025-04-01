
<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    let {
        canDeal = false,
        canHit = false,
        canStand = false,
        isLoading = false,
        dealText = "Deal / New Game"
    }: {
        canDeal?: boolean;
        canHit?: boolean;
        canStand?: boolean;
        isLoading?: boolean;
        dealText?: string;
    } = $props();

    const dispatch = createEventDispatcher();

    const btnBaseClass = "px-6 py-3 text-base font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-105 disabled:scale-100";
    const loadingClass = "opacity-75 animate-pulse";
</script>

<div class="controls flex justify-center items-center space-x-5 my-8 p-4 bg-gray-900/30 rounded-lg">
    <button
            class="{btnBaseClass} bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-400 {isLoading && !canHit && !canStand ? loadingClass : ''}"
            onclick={() => dispatch('deal')}
            disabled={!canDeal || isLoading}
    >
        {#if isLoading && !canHit && !canStand}<span class="inline-block animate-spin mr-2">🔄</span>{/if}{isLoading && !canHit && !canStand ? 'Dealing...' : dealText}
    </button>
    <button
            class="{btnBaseClass} bg-yellow-500 text-gray-900 hover:bg-yellow-400 focus:ring-yellow-300 {isLoading && canHit ? loadingClass : ''}"
            onclick={() => dispatch('hit')}
            disabled={!canHit || isLoading}
    >
        {#if isLoading && canHit}<span class="inline-block animate-spin mr-2">🔄</span>{/if}{isLoading && canHit ? 'Hitting...' : 'Hit'}
    </button>
    <button
            class="{btnBaseClass} bg-red-600 text-white hover:bg-red-500 focus:ring-red-400 {isLoading && !canHit && canHit ? loadingClass : ''}"
            onclick={() => dispatch('stand')}
            disabled={!canStand || isLoading}
    >
        {#if isLoading && !canHit && canHit}<span class="inline-block animate-spin mr-2">🔄</span>{/if}Stand
    </button>
</div>

<style>
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    .animate-spin {
        animation: spin 1s linear infinite;
    }
</style>