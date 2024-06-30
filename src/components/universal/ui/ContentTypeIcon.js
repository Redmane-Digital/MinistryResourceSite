/************************************************************************************************
 *                               IMPORTANT LICENSE INFORMATION                                  *
 * This file is part of Ministry Resource Sity by Redmane Digital which is released under RDSL. *
 * See file LICENSE for full license details.                                                   *
 ************************************************************************************************/

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faFilePdf, faVideo, faPodcast } from '@fortawesome/free-solid-svg-icons';

const ContentTypeIcon = (contentType, size = "3x", color = '#eb6651') => {
    const lookup = {
        editable: faFileAlt,
        pdf: faFilePdf,
        video: faVideo,
        podcast: faPodcast
    };
    return (
        <FontAwesomeIcon icon={lookup[contentType.contentType]} style={{ color }} className="mr-2" size="lg" />
    );
};

export default ContentTypeIcon;