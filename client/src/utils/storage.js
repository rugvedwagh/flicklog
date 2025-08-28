const fetchUserProfile = () => {
    try {
        const profile = JSON.parse(localStorage.getItem('profile')) || {};
        return profile;
    } catch (error) {
        console.error('Error getting the profile data from localSorage:', error);
        return null;
    }
}

export {
    fetchUserProfile
}