import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { fetchPostsBySearch } from '../../redux/actions/post.actions';
import { useTheme } from '../../context/themeContext';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from 'react';
import "./search.styles.css";

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
        <section className={`box ${darkMode ? 'dark' : ''}`}>
            <input
                type="text"
                placeholder="Search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="input"
            />

            <SearchOutlinedIcon onClick={searchPost}/>
        </section>
    );
};

export default Search;
