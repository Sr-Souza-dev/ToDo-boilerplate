import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Modules from '../../modules';
import { isMobile } from '/imports/libs/deviceVerify';
import { appNavBarStyle } from './AppNavBarStyle';
import AppBar from '@mui/material/AppBar';
import { fixedMenuLayoutStyle } from './FixedMenuLayoutStyle';
import Toolbar from '@mui/material/Toolbar';
import * as appStyle from '/imports/materialui/styles';
import Container from '@mui/material/Container';
import { IAppMenu } from '/imports/modules/modulesTypings';
import { ILayoutProps } from '/imports/typings/BoilerplateDefaultTypings';
import Box from '@mui/material/Box';


interface IAppNavBar extends ILayoutProps {}

export const AppNavBar = (props: IAppNavBar) => {
	const navigate = useNavigate();
	const location = useLocation();

	const { user, theme, themeOptions } = props;

	const pathIndex = (Modules.getAppMenuItemList() || [])
		.filter((item: IAppMenu | null) => !item?.isProtected || (user && user.roles?.indexOf('Publico') === -1))
		.findIndex(
			(menuData) =>
				(menuData?.path === '/' && location.pathname === '/') ||
				(menuData?.path !== '/' && location && location.pathname.indexOf(menuData?.path as string) === 0)
		);
	if (isMobile) {
		return (
			<Box
				sx={{
					minHeight: 70,
					width: '100%',
					bottom: 0,
					backgroundColor: "primary.main",
					
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-around',

				}}>
				
					{(Modules.getAppMenuItemList() || [])
						.filter((item: IAppMenu | null) => !item?.isProtected || (user && user.roles?.indexOf('Publico') === -1))
						.map((menuData, menuIndex) => (
							<Button key={menuData?.path} onClick={() => navigate(menuData?.path as string)} 
								sx={{
									backgroundColor: 'transparent',
									border: 'none',
								}}
							>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										justifyContent: 'center',
										
									}}>
									{menuData?.icon ? menuData?.icon : null}

								</Box>
							</Button>
						))}
			</Box>
		);
	}

	return (
		<AppBar position="static" enableColorOnDark>
			<Container sx={fixedMenuLayoutStyle.containerFixedMenu}>
				{/* <HomeIconButton navigate={navigate} /> */}
				<Toolbar sx={fixedMenuLayoutStyle.toolbarFixedMenu}>
					<Box
						sx={{
							width: '100%',
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center'
						}}>
						{(Modules.getAppMenuItemList() || [])
							.filter((item: IAppMenu | null) => !item?.isProtected || (user && user.roles?.indexOf('Publico') === -1))
							.map((menuData, ind) => (
								<Button
									variant={pathIndex !== ind ? 'text' : 'outlined'}
									sx={{
										...appNavBarStyle.buttonMenuItem,
										color: appStyle.secondaryColor,
										margin: 1
									}}
									key={menuData?.path}
									onClick={() => navigate(menuData?.path as string)}>
									{menuData?.name}
								</Button>
							))}
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
};
