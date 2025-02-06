const handleScroll = (setShowScrollButton, threshold = 200) => {
    return () => {
        const scrollY = window.scrollY;
        setShowScrollButton(scrollY > threshold);
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
    handleScroll
}