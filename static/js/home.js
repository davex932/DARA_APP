document.querySelectorAll('.view-comments-link').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();

                const postId = this.dataset.postId;
                const modal = document.getElementById(`comments-modal-${postId}`);

                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
});

function closeModal(postId) {
    if (postId) {
        const modal = document.getElementById(`comments-modal-${postId}`);
        if (modal) modal.classList.remove('active');
    } else {
        document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    }
    document.body.style.overflow = 'auto';
}


// Fermer au clic sur l'overlay (arrière-plan) pour chaque modal
document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// Fermer avec la touche Échap
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Gestion des likes avec changement de couleur
document.querySelectorAll('.like-form').forEach(form => {
    const likeBtn = form.querySelector('.like-btn');
    const heartIcon = likeBtn.querySelector('i');
    
    // Vérifier l'état initial du like (si le bouton a déjà la classe 'liked' ou le cœur est plein)
    let isCurrentlyLiked = heartIcon.classList.contains('fas');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Soumettre le formulaire normalement pour envoyer les données
        const formData = new FormData(form);
        
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'same-origin'
        })
        .then(response => {
            if (response.ok) {
                // Toggle l'état du like visuellement après confirmation du serveur
                if (isCurrentlyLiked) {
                    // Retirer le like
                    heartIcon.classList.remove('fas');
                    heartIcon.classList.add('far');
                    likeBtn.style.color = '';
                    likeBtn.classList.remove('liked');
                    isCurrentlyLiked = false;
                } else {
                    // Ajouter le like
                    heartIcon.classList.remove('far');
                    heartIcon.classList.add('fas');
                    likeBtn.style.color = '#e91e63';
                    likeBtn.classList.add('liked');
                    isCurrentlyLiked = true;
                    
                    // Animation de "pop"
                    likeBtn.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        likeBtn.style.transform = 'scale(1)';
                    }, 200);
                }
                console.log('Like/Unlike effectué avec succès');
            } else {
                console.error('Erreur lors de la requête');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            // Si le fetch échoue, soumettre le formulaire normalement (rechargement de page)
            form.submit();
        });
    });
});

// Initialiser l'état visuel au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.like-form').forEach(form => {
        const likeBtn = form.querySelector('.like-btn');
        const heartIcon = likeBtn.querySelector('i');
        
        // Si le cœur est plein au chargement, appliquer le style rose
        if (heartIcon.classList.contains('fas')) {
            likeBtn.style.color = '#e91e63';
            likeBtn.classList.add('liked');
        }
    });
});