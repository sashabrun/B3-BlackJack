<script lang="ts">
    import { goto } from '$app/navigation';

    let pseudo = '';
    let email = '';
    let password = '';
    let confirmPassword = '';
    let submitting = false;
    let formErrors: Record<string, string> = {};

    async function handleSubmit(event) {
        submitting = true;
        formErrors = {};

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pseudo,
                    email,
                    password,
                    confirmPassword
                })
            });

            const result = await response.json();

            if (result.success) {
                goto('/play');
            } else {
                formErrors = result.errors;
                submitting = false;
            }
        } catch (error) {
            console.error('Erreur lors de la soumission du formulaire:', error);
            formErrors = {
                form: 'Une erreur inattendue est survenue. Veuillez réessayer.'
            };
            submitting = false;
        }
    }
</script>

<form on:submit|preventDefault={handleSubmit} class="signup-form">
    <h2 class="form-title">Créer un compte</h2>

    {#if formErrors.form}
        <div class="error-message form-error">
            {formErrors.form}
        </div>
    {/if}

    <div class="form-group">
        <label for="pseudo">Pseudo</label>
        <input
            type="text"
            id="pseudo"
            name="pseudo"
            bind:value={pseudo}
            class:error={!!formErrors.pseudo}
            autocomplete="username"
            disabled={submitting}
            required
        />
        {#if formErrors.pseudo}
            <div class="error-message">{formErrors.pseudo}</div>
        {/if}
    </div>

    <div class="form-group">
        <label for="email">Email</label>
        <input
            type="email"
            id="email"
            name="email"
            bind:value={email}
            class:error={!!formErrors.email}
            autocomplete="email"
            disabled={submitting}
            required
        />
        {#if formErrors.email}
            <div class="error-message">{formErrors.email}</div>
        {/if}
    </div>

    <div class="form-group">
        <label for="password">Mot de passe</label>
        <input
            type="password"
            id="password"
            name="password"
            bind:value={password}
            class:error={!!formErrors.password}
            autocomplete="new-password"
            disabled={submitting}
            placeholder="Minimum 6 caractères"
            required
            minlength="6"
        />
        {#if formErrors.password}
            <div class="error-message">{formErrors.password}</div>
        {/if}
    </div>

    <div class="form-group">
        <label for="confirmPassword">Confirmer le mot de passe</label>
        <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            bind:value={confirmPassword}
            class:error={!!formErrors.confirmPassword}
            autocomplete="new-password"
            disabled={submitting}
            required
        />
        {#if formErrors.confirmPassword}
            <div class="error-message">{formErrors.confirmPassword}</div>
        {/if}
    </div>

    <button type="submit" class="submit-button" disabled={submitting}>
        {submitting ? 'Création en cours...' : 'Créer mon compte'}
    </button>
</form>

<style>
    .signup-form {
        background-color: rgba(0,0,0,0.3);
        border-radius: 15px;
        padding: 30px;
        max-width: 450px;
        margin: 0 auto;
        border: 1px solid rgba(230, 198, 86, 0.2);
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }

    .form-title {
        font-family: 'Playfair Display', serif;
        font-weight: 900;
        font-size: 1.8rem;
        background: linear-gradient(to right, #e6c656, #f7df8e, #e6c656);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        text-align: center;
        margin-bottom: 25px;
        letter-spacing: 1px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .form-group {
        margin-bottom: 20px;
    }

    label {
        display: block;
        margin-bottom: 5px;
        color: #e2e2e2;
        font-weight: 500;
    }

    input {
        width: 100%;
        padding: 12px 15px;
        border-radius: 8px;
        border: 1px solid rgba(230, 198, 86, 0.3);
        background-color: rgba(0,0,0,0.25);
        color: #e2e2e2;
        font-size: 1rem;
        transition: all 0.3s ease;
        box-sizing: border-box;
    }

    input::placeholder {
        color: rgba(226, 226, 226, 0.5);
    }

    input:focus {
        outline: none;
        border-color: rgba(230, 198, 86, 0.7);
        box-shadow: 0 0 0 2px rgba(230, 198, 86, 0.2);
    }

    input.error {
        border-color: #ff5555;
    }

    .error-message {
        color: #ff5555;
        font-size: 0.9rem;
        margin-top: 5px;
        padding-left: 5px;
    }

    .form-error {
        background-color: rgba(255, 85, 85, 0.1);
        border-left: 3px solid #ff5555;
        padding: 10px;
        margin-bottom: 20px;
        border-radius: 5px;
    }

    .submit-button {
        width: 100%;
        padding: 14px;
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
        position: relative;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0,0,0,0.25);
    }

    .submit-button::after {
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

    .submit-button:hover:not(:disabled)::after {
        left: 120%;
    }

    .submit-button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.3);
    }

    .submit-button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    @media (max-width: 768px) {
        .signup-form {
            padding: 20px;
            max-width: 95%;
        }

        .form-title {
            font-size: 1.5rem;
        }

        input {
            padding: 10px;
        }
    }
</style>