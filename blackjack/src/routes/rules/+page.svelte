<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';

    function navigateToHome() {
        goto('/');
    }

    function navigateToPlay() {
        goto('/play');
    }

    function navigateBack() {
        goto('/play');
    }

    const isLoggedIn = $derived($page.data.userId !== undefined);
</script>

<div class="rules-container">
    <h1>Règles du Blackjack</h1>

    <section>
        <h2>Objectif du jeu</h2>
        <p>Le but est d'obtenir une main dont la valeur totale est la plus proche possible de 21, sans dépasser cette valeur.</p>
    </section>

    <section>
        <h2>Valeurs des cartes</h2>
        <ul>
            <li>Les cartes de 2 à 10 valent leur valeur nominale</li>
            <li>Les figures (Valet, Dame, Roi) valent 10</li>
            <li>L'As vaut 1 ou 11, selon ce qui est le plus avantageux pour le joueur</li>
        </ul>
    </section>

    <section>
        <h2>Déroulement d'une partie</h2>
        <ol>
            <li>Le joueur et le croupier reçoivent chacun deux cartes</li>
            <li>Une des cartes du croupier est cachée</li>
            <li>Le joueur peut :
                <ul>
                    <li><strong>Tirer</strong> : prendre une carte supplémentaire</li>
                    <li><strong>Rester</strong> : garder sa main actuelle</li>
                </ul>
            </li>
            <li>Le croupier doit tirer tant que sa main est inférieure à 17</li>
        </ol>
    </section>

    <section>
        <h2>Résultats possibles</h2>
        <ul>
            <li><strong>Blackjack</strong> : main de 21 avec seulement 2 cartes (As + 10 ou figure)</li>
            <li><strong>Victoire</strong> : main plus proche de 21 que celle du croupier</li>
            <li><strong>Égalité</strong> : même valeur que le croupier</li>
            <li><strong>Défaite</strong> : dépassement de 21 ou main inférieure à celle du croupier</li>
        </ul>
    </section>

    <div class="button-container">
        {#if isLoggedIn}
            <button class="nav-button back" on:click={navigateBack}>Retour au jeu</button>
        {:else}
            <button class="nav-button home" on:click={navigateToHome}>Accueil</button>
            <button class="nav-button play" on:click={navigateToPlay}>Jouer</button>
        {/if}
    </div>
</div>

<style>
    .rules-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }

    h1 {
        text-align: center;
        color: #e6c656;
        margin-bottom: 30px;
        font-size: 2.5rem;
    }

    section {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 20px;
    }

    h2 {
        color: #e6c656;
        margin-bottom: 15px;
        font-size: 1.5rem;
    }

    ul, ol {
        margin-left: 20px;
        margin-bottom: 15px;
    }

    li {
        margin-bottom: 8px;
        line-height: 1.4;
    }

    .button-container {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 30px;
    }

    .nav-button {
        padding: 12px 24px;
        background: linear-gradient(to right, #8b4513, #a0522d);
        color: white;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        font-weight: 600;
        font-size: 1rem;
        letter-spacing: 1px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.25);
        transition: all 0.2s ease;
    }

    .nav-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.3);
        background: linear-gradient(to right, #a0522d, #cd853f);
    }

    .nav-button.back {
        background: linear-gradient(to right, #2c3e50, #34495e);
    }

    .nav-button.back:hover {
        background: linear-gradient(to right, #34495e, #2c3e50);
    }

    @media (max-width: 768px) {
        .rules-container {
            padding: 15px;
        }

        h1 {
            font-size: 2rem;
        }

        section {
            padding: 15px;
        }

        .button-container {
            flex-direction: column;
            align-items: center;
        }

        .nav-button {
            width: 100%;
            max-width: 300px;
        }
    }
</style>