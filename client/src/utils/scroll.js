const handleScroll = (setShowScrollButton, threshold = 200) => {
    return () => {
        const scrollY = window.scrollY;
        setShowScrollButton(scrollY > threshold);
    };
};

const handleNavbarScroll = (setIsVisible) => {
    let lastScrollY = window.scrollY;
    const scrollThreshold = 300;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > scrollThreshold) {
            setIsVisible(currentScrollY <= lastScrollY);
        } else {
            setIsVisible(true);
        }

        lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
};

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};

export {
    scrollToTop,
    handleScroll,
    handleNavbarScroll
}