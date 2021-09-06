import React from 'react';
import styles from 'src/styles/misc.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface Props {};

function SearchBar(props: Props) {
    const {} = props;

    return (
        <form action="submit" role="search" className={styles.searchFormContainer}>
                <FontAwesomeIcon icon={faSearch} />
                <input type="text" placeholder="Search" className={styles.searchFormInput}/>
        </form>
    );
};

export default SearchBar;
