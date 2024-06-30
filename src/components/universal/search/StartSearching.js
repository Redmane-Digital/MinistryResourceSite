/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React from 'react';
import LiveSearchBox from './LiveSearchBox';
import styled from 'styled-components';

const SearchSection = styled.section`
    min-height: 230px;
    position: relative;
`;

const StartSearching = ({ location }) => {
    return (
        <SearchSection className='bg-light'>
            <LiveSearchBox theWidth="reduced-width" className="text-secondary" textColor='secondary' fontWeight='normal' location={location} mt="4" />
        </SearchSection>
    );
};

export default StartSearching;