<script lang="ts">
    import { goto } from '$app/navigation';
    import SignupForm from '$lib/components/SignupForm.svelte';
    import { onMount } from 'svelte';

    const { form } = $props();

    let mounted = $state(false);

    onMount(() => {
        mounted = true;
    });

    function navigateToHome() {
        goto('/');
    }

    function navigateToPlay() {
        goto('/play');
    }
</script>

<div class="signup-container">
    <div class="nav-buttons">
        <button class="nav-button home" on:click={navigateToHome}>Accueil</button>
        <button class="nav-button play" on:click={navigateToPlay}>Jouer</button>
    </div>

    {#if mounted || !form?.errors}
        <SignupForm data={form?.data || {}} errors={form?.errors || {}} />
    {:else}
        <div class="loading-container">
            <div class="loading-spinner"></div>
        </div>
    {/if}

    <div class="login-prompt">
        <p>Déjà un compte ? <button class="link-button" on:click={navigateToPlay}>Se connecter</button></p>
    </div>

    <div class="decorations">
        <div class="card-decoration spade">♠</div>
        <div class="card-decoration heart">♥</div>
        <div class="card-decoration club">♣</div>
        <div class="card-decoration diamond">♦</div>
    </div>
</div>

<style>
    .signup-container {
        display: flex;
        flex-direction: column;
        position: relative;
        padding: 20px;
        min-height: 60vh;
    }

    .nav-buttons {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
    }

    .nav-button {
        padding: 10px 20px;
        background: linear-gradient(to right, #8b4513, #a0522d);
        color: white;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-weight: 600;
        letter-spacing: 1px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.25);
        transition: all 0.2s ease;
    }

    .nav-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.3);
        background: linear-gradient(to right, #a0522d, #cd853f);
    }

    .loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 300px;
    }

    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 5px solid rgba(230, 198, 86, 0.3);
        border-radius: 50%;
        border-top-color: #e6c656;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .login-prompt {
        text-align: center;
        margin-top: 20px;
        color: #e2e2e2;
    }

    .link-button {
        background: none;
        border: none;
        color: #3498db;
        cursor: pointer;
        font-weight: 600;
        padding: 0;
        transition: color 0.2s ease;
        font-size: inherit;
    }

    .link-button:hover {
        color: #2980b9;
        text-decoration: underline;
    }

    .decorations {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: -1;
    }

    .card-decoration {
        position: absolute;
        font-size: 6rem;
        opacity: 0.07;
        color: #fff;
    }

    .spade {
        top: 10%;
        left: 15%;
        transform: rotate(-15deg);
    }

    .heart {
        bottom: 15%;
        left: 20%;
        transform: rotate(10deg);
    }

    .club {
        top: 20%;
        right: 15%;
        transform: rotate(15deg);
    }

    .diamond {
        bottom: 20%;
        right: 20%;
        transform: rotate(-10deg);
    }

    @media (max-width: 768px) {
        .nav-buttons {
            margin-bottom: 20px;
        }

        .card-decoration {
            font-size: 4rem;
        }
    }
</style>