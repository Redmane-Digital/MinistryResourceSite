/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React from 'react';
import LiveSearchBox from './LiveSearchBox';
import styled from 'styled-components';

const Section = styled.section`
    min-height: 170px;
`;

const BasicSearch = ({ location }) => {
    return (
        <Section className='bg-light py-3'>
            <LiveSearchBox noTitle location={location} />
        </Section>
    );
};

export default BasicSearch;