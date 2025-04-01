
<script>
    import '../app.css';
    const { children } = $props();
</script>

<div class="casino-table">
    <div class="table-felt">
        <div class="casino-logo">
            <h1>Casino Royale</h1>
        </div>
        <div class="table-edge"></div>

        {@render children()}

        <div class="table-decorations"></div>
        <div class="dealer-spotlight"></div>

    </div>
</div>

<style>
    .casino-logo {
        text-align: center;
        padding-bottom: 15px;
        position: relative;
        z-index: 1;
    }
    .casino-logo h1 {
        font-family: 'Playfair Display', serif;
        font-weight: 900;
        font-size: 2.2rem;
        margin: 0;
        background: linear-gradient(to right, #e6c656, #f7df8e, #e6c656);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        text-transform: uppercase;
        letter-spacing: 1px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .table-edge {
        height: 15px;
        background: linear-gradient(to bottom, #8b4513, #5d2906);
        border-radius: 5px;
        margin-bottom: 25px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        position: relative;
        z-index: 1;
    }

    .dealer-spotlight, .table-decorations::before, .table-decorations::after {
        position: absolute;
        pointer-events: none;
        z-index: 0;
        color: rgba(255,255,255,0.04);
    }
    .dealer-spotlight {
        top: -80px;
        left: 50%;
        transform: translateX(-50%);
        width: 350px;
        height: 250px;
        background: radial-gradient(ellipse at center, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 70%);
    }
    .table-decorations::before {
        content: '♠';
        font-size: 2.5rem;
        top: 60px;
        left: 40px;
    }
    .table-decorations::after {
        content: '♦';
        font-size: 2.5rem;
        bottom: 80px;
        right: 40px;
    }

    @media (max-width: 768px) {
        .casino-logo h1 {
            font-size: 1.8rem;
        }
        .table-edge {
            margin-bottom: 15px;
        }
    }
</style>