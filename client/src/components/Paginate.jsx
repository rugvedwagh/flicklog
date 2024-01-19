import { Pagination, PaginationItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../actions/posts';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import React from 'react';

const Paginate = ({ page }) => {

    const dispatch = useDispatch();

    useEffect(() => {
        if (page) dispatch(getPosts(page))
    }, [page, dispatch]);

    const { numberOfPages } = useSelector((state) => state.posts)

    return (
        <Pagination
            count={numberOfPages}
            page={Number(page) || 1}
            variant='outlined'
            color='primary'
            renderItem={(item) => (
                <PaginationItem {...item} component={Link} to={`/posts?page=${item.page}`} />
            )}
            style={{ borderRadius: '4', margin: '10px 0px', padding: '16px', justifyContent: 'space-around' }}
        />
    );
};

export default Paginate;