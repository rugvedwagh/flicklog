import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { fetchPostsBySearch } from '../../redux/actions/post.actions';
import { useTheme } from '../../context/themeContext';
import { AppBar, Button } from "@mui/material"
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from 'react';

const Search = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const darkMode = useTheme();

    const [searchInput, setSearchInput] = useState('');

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            searchPost();
        }
    };

    const searchPost = () => {
        if (searchInput.trim()) {

            const terms = searchInput.split(',').map((term) => term.trim());
            const search = terms[0];
            const tags = terms.slice(1).join(',');

            navigate(`/posts/search?searchQuery=${search || 'none'}&tags=${tags || 'none'}`);

            dispatch(fetchPostsBySearch({ search, tags }));
        } else {
            navigate('/');
        }
    };

    return (
        <AppBar
            className={`appBarSearch ${darkMode ? 'dark' : ''}`}
            elevation={6}
            position='static'
        >
            <section className="box">

                <input
                    type="text"
                    name=""
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <Button
                    variant="filled"
                    disabled={!searchInput.trim()}
                    onClick={searchPost}
                    className={`search-button ${darkMode ? 'dark' : ''}`}
                >
                    <SearchOutlinedIcon />
                </Button>

            </section>
        </AppBar>
    )
}

export default Search;