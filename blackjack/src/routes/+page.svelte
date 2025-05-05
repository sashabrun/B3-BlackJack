<script lang="ts">
    import { goto } from '$app/navigation';

    function navigateToRules() {
        goto('/rules');
    }

    function navigateToPlay() {
        goto('/play');
    }
</script>

<div class="home-container">
    <div class="rules-button-container">
        <button class="rules-button" on:click={navigateToRules}>Règles</button>
    </div>

    <div class="welcome-content">
        <div class="welcome-title">
            <h1>Bienvenue à</h1>
            <h1 class="casino-name">Casino Royale</h1>
        </div>

        <div class="game-info">
            <p>Découvrez notre jeu de Blackjack en ligne!</p>
            <p>Testez votre chance contre le croupier et tentez de gagner gros!</p>
        </div>

        <div class="action-buttons">
            <button class="action-btn signup" on:click={navigateToPlay}>S'inscrire</button>
            <button class="action-btn login" on:click={navigateToPlay}>Se connecter</button>
        </div>
    </div>

    <div class="decorations">
        <div class="card-decoration spade">♠</div>
        <div class="card-decoration heart">♥</div>
        <div class="card-decoration club">♣</div>
        <div class="card-decoration diamond">♦</div>
    </div>
</div>

<style>
    .home-container {
        display: flex;
        flex-direction: column;
        min-height: 65vh;
        position: relative;
        padding: 20px;
    }

    .rules-button-container {
        position: absolute;
        top: 0;
        right: 20px;
        z-index: 10;
    }

    .rules-button {
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

    .rules-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.3);
        background: linear-gradient(to right, #a0522d, #cd853f);
    }

    .welcome-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        margin-top: 60px;
        z-index: 5;
    }

    .welcome-title {
        margin-bottom: 30px;
    }

    .welcome-title h1 {
        font-size: 2.5rem;
        margin: 0;
        line-height: 1.2;
    }

    .casino-name {
        font-family: 'Playfair Display', serif;
        font-weight: 900;
        font-size: 3.5rem !important;
        background: linear-gradient(to right, #e6c656, #f7df8e, #e6c656);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        text-transform: uppercase;
        letter-spacing: 2px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .game-info {
        max-width: 600px;
        margin: 0 auto 40px;
    }

    .game-info p {
        font-size: 1.2rem;
        margin: 10px 0;
        color: #e2e2e2;
    }

    .action-buttons {
        display: flex;
        gap: 20px;
        margin-top: 20px;
    }

    .action-btn {
        padding: 14px 28px;
        border: none;
        border-radius: 30px;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        min-width: 160px;
        text-transform: uppercase;
        letter-spacing: 1px;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0,0,0,0.25);
        color: white;
    }

    .action-btn::after {
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

    .action-btn:hover::after {
        left: 120%;
    }

    .action-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.3);
    }

    .action-btn.signup {
        background: linear-gradient(to right, #2980b9, #3498db);
    }

    .action-btn.login {
        background: linear-gradient(to right, #e67e22, #f39c12);
    }

    .decorations {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
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
        .welcome-title h1 {
            font-size: 2rem;
        }

        .casino-name {
            font-size: 2.8rem !important;
        }

        .game-info p {
            font-size: 1rem;
        }

        .action-buttons {
            flex-direction: column;
            gap: 15px;
        }

        .action-btn {
            min-width: 200px;
        }

        .card-decoration {
            font-size: 4rem;
        }
    }
</style>