<script lang="ts">
    import { goto } from '$app/navigation';

    function navigateToHome() {
        goto('/');
    }

    function navigateToPlay() {
        goto('/play');
    }
</script>

<div class="rules-container">
    <div class="nav-buttons">
        <button class="nav-button home" on:click={navigateToHome}>Accueil</button>
        <button class="nav-button play" on:click={navigateToPlay}>Jouer</button>
    </div>

    <div class="rules-content">
        <h1 class="rules-title">Règles du Blackjack</h1>

        <div class="rules-section">
            <h2>Objectif du jeu</h2>
            <p>Le but du Blackjack est d'obtenir une main dont la valeur est la plus proche possible de 21 sans dépasser ce nombre. Le joueur joue uniquement contre le croupier, pas contre les autres joueurs.</p>
        </div>

        <div class="rules-section">
            <h2>Valeur des cartes</h2>
            <ul>
                <li>Les cartes numérotées de 2 à 10 valent leur valeur nominale.</li>
                <li>Les figures (Valet, Dame, Roi) valent chacune 10 points.</li>
                <li>L'As vaut soit 1 point, soit 11 points, selon ce qui avantage le plus la main.</li>
            </ul>
        </div>

        <div class="rules-section">
            <h2>Déroulement d'une partie</h2>
            <ol>
                <li>Le croupier distribue deux cartes face visible au joueur.</li>
                <li>Le croupier se distribue une carte face visible et une carte face cachée.</li>
                <li>Le joueur décide alors de "tirer" (recevoir une autre carte) ou de "rester" (garder sa main actuelle).</li>
                <li>Le joueur peut continuer à tirer des cartes jusqu'à ce qu'il décide de rester ou dépasse 21 (ce qui constitue un "bust" et entraîne une défaite).</li>
                <li>Une fois que le joueur a terminé, le croupier révèle sa carte cachée.</li>
                <li>Le croupier doit tirer des cartes jusqu'à ce que sa main atteigne au moins 17 points.</li>
                <li>Si le croupier dépasse 21, le joueur gagne. Sinon, la main la plus proche de 21 l'emporte.</li>
            </ol>
        </div>

        <div class="rules-section">
            <h2>Le Blackjack</h2>
            <p>Un "Blackjack" est une main de deux cartes qui totalise exactement 21 points (un As et une carte valant 10). Un Blackjack bat toutes les autres mains à 21 points qui ne sont pas des Blackjacks.</p>
        </div>

        <div class="rules-section">
            <h2>Égalité (Push)</h2>
            <p>Si la main du joueur et celle du croupier ont la même valeur sans dépasser 21, la partie est déclarée égalité, ou "push". Dans ce cas, le joueur récupère sa mise.</p>
        </div>

        <div class="play-button-container">
            <button class="play-button" on:click={navigateToPlay}>Jouer maintenant</button>
        </div>
    </div>

    <div class="decorations">
        <div class="card-decoration spade">♠</div>
        <div class="card-decoration club">♣</div>
    </div>
</div>

<style>
    .rules-container {
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

    .rules-content {
        background-color: rgba(0,0,0,0.25);
        border-radius: 15px;
        padding: 30px;
        max-width: 800px;
        margin: 0 auto;
        position: relative;
        z-index: 5;
        border: 1px solid rgba(230, 198, 86, 0.2);
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }

    .rules-title {
        font-family: 'Playfair Display', serif;
        font-weight: 900;
        font-size: 2.5rem;
        background: linear-gradient(to right, #e6c656, #f7df8e, #e6c656);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        text-align: center;
        margin-bottom: 30px;
        letter-spacing: 1px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .rules-section {
        margin-bottom: 25px;
    }

    .rules-section h2 {
        color: #f7df8e;
        font-size: 1.5rem;
        margin-bottom: 10px;
        border-bottom: 1px solid rgba(230, 198, 86, 0.3);
        padding-bottom: 5px;
    }

    .rules-section p, .rules-section li {
        color: #e2e2e2;
        line-height: 1.6;
        margin-bottom: 10px;
    }

    .rules-section ul, .rules-section ol {
        padding-left: 25px;
        margin-bottom: 15px;
    }

    .play-button-container {
        text-align: center;
        margin-top: 30px;
    }

    .play-button {
        padding: 14px 30px;
        background: linear-gradient(to right, #2980b9, #3498db);
        color: white;
        border: none;
        border-radius: 30px;
        cursor: pointer;
        font-weight: 600;
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        transition: all 0.2s ease;
        box-shadow: 0 4px 8px rgba(0,0,0,0.25);
        position: relative;
        overflow: hidden;
    }

    .play-button::after {
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

    .play-button:hover::after {
        left: 120%;
    }

    .play-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.3);
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
        font-size: 12rem;
        opacity: 0.03;
        color: #fff;
    }

    .spade {
        top: 10%;
        right: 5%;
        transform: rotate(15deg);
    }

    .club {
        bottom: 10%;
        left: 5%;
        transform: rotate(-15deg);
    }

    @media (max-width: 768px) {
        .rules-content {
            padding: 20px;
        }

        .rules-title {
            font-size: 2rem;
        }

        .rules-section h2 {
            font-size: 1.3rem;
        }

        .nav-buttons {
            margin-bottom: 20px;
        }

        .card-decoration {
            font-size: 8rem;
        }
    }
</style>