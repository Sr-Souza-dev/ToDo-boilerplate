import React from 'react';

import Container from '@mui/material/Container';
import * as appStyle from '/imports/materialui/styles';
import { FixedMenuLayoutContext } from '../../layouts/FixedMenuLayout';

const Home = () => {
    return (<>
        <Container>
            <img src="/images/wireframe/media-paragraph.png" style={appStyle.containerHome} />
            <img src="/images/wireframe/paragraph.png" style={appStyle.containerHome} />
            <img src="/images/wireframe/paragraph.png" style={appStyle.containerHome} />
            <img src="/images/wireframe/paragraph.png" style={appStyle.containerHome} />
            <img src="/images/wireframe/paragraph.png" style={appStyle.containerHome} />
            <img src="/images/wireframe/paragraph.png" style={appStyle.containerHome} />
            <img src="/images/wireframe/paragraph.png" style={appStyle.containerHome} />
        </Container>
    </>);
};

export default Home;
