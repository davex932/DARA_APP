document.addEventListener('DOMContentLoaded', function () {
    console.log("JS chargé !");

    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault(); // Empêche le rechargement
            
            const form = this.closest('form');
            if (!form) return; // Sécurité : si pas de form, on arrête

            const formData = new FormData(form);
            const icon = this.querySelector('i');
            
            // On change la couleur immédiatement pour la réactivité
            const isLiked = this.classList.toggle('liked');
            if (icon) {
                icon.classList.toggle('fas', isLiked);
                icon.classList.toggle('far', !isLiked);
                icon.style.color = isLiked ? '#ff6584' : '';
            }

            // ENVOI RÉEL À DJANGO
            fetch(form.action || window.location.href, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': formData.get('csrfmiddlewaretoken')
                }
            })
            .then(response => {
                if (!response.ok) {
                    // Si Django renvoie une erreur, on annule le changement de couleur
                    this.classList.toggle('liked');
                    console.error("Erreur serveur");
                } else {
                    console.log("Données envoyées avec succès !");
                }
            })
            .catch(error => console.error('Erreur réseau:', error));
        });
    });
});