import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { fetchPostsBySearch } from '../../actions/post.actions';
import { AppBar, Button } from "@mui/material"
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from 'react';

const Search = ({ darkMode }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

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
        <AppBar className={`appBarSearch ${darkMode ? 'dark' : ''}`} elevation={6} position='static'>
            <section className="box">

                <input
                    type="text"
                    name=""
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <Button variant="filled" className={`search-button ${darkMode ? 'dark' : ''}`} onClick={searchPost}>
                    <SearchOutlinedIcon />
                </Button>

            </section>
        </AppBar>
    )
}

export default Search;