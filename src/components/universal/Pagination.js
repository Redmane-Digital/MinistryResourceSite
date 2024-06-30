/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import { translateLink } from '../../hooks/';
import { useTranslateContext } from 'gatsby-plugin-translate';

const Pagination = ({ pages, index, params }) => {
    const { category } = params;
    const { language } = useTranslateContext();
    const [links, setLinks] = useState({
        min: null,
        max: null,
        hrefs: []
    });

    const genLinks = () => {
        const min = index < 3 ? 1 : index - 2,
            max = index + 2,
            tmp = [];

        for (let i = min; i <= max && i <= pages; i++) {
            tmp.push({ path: `/books/?category=${category || 'all'}&page=${i}`, i });
        };

        setLinks({ min, max, hrefs: tmp });
    };

    // If the page number changes, update links
    useEffect(() => genLinks(), [index, pages])
    
    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
                {/* <li className="page-item disabled">
                    <a className="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
                </li> */}
                
                {// Creates the pagination links by page number
                links.hrefs.map(href => (
                    <li className={"page-item" + (href.i === index ? ' disabled' : '') } key={href.i}>
                        <Link to={translateLink(href.path, language)} className="page-link">{href.i}</Link>
                    </li>)
                )}

                {/* <li className={`page-item` + (index == pages ? ' disabled' : '')}>
                    <a className="page-link" href="#">Next</a>
                </li> */}
            </ul>
        </nav>
    )
};

export default Pagination;