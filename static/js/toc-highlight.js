document.addEventListener('DOMContentLoaded', function() {
    const tocContainer = document.querySelector('.desktop-toc');
    if (!tocContainer) return;

    let activeLink = null;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const tocLink = tocContainer.querySelector(`a[href="#${id}"]`);
            
            if (entry.isIntersecting) {
                // Remove active class from previous link
                if (activeLink) {
                    activeLink.classList.remove('active');
                }
                
                // Add active class to current link
                if (tocLink) {
                    tocLink.classList.add('active');
                    activeLink = tocLink;
                    
                    // Auto-scroll the TOC to keep active item visible
                    const tocRect = tocContainer.getBoundingClientRect();
                    const linkRect = tocLink.getBoundingClientRect();
                    
                    if (linkRect.top < tocRect.top || linkRect.bottom > tocRect.bottom) {
                        tocLink.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }
                }
            }
        });
    }, { 
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0.1
    });

    // Track all headings that have an ID
    document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]').forEach((heading) => {
        observer.observe(heading);
    });

});