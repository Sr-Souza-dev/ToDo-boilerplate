import { AccountCircle } from '@mui/icons-material';
import { Box, Button, Container, Menu } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DayNightToggle } from './DayNightToggle';
import { ILayoutProps } from '/imports/typings/BoilerplateDefaultTypings';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuItem from '@mui/material/MenuItem';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { appTopMenuStyle } from './AppTopMenuStyle';

export const AppTopMenu = (props: ILayoutProps) => {
	const { user, showDrawer, themeOptions } = props;

	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState<Object | null>(null);
	const open = Boolean(anchorEl);

	const openPage = (url: string) => () => {
		handleClose();
		navigate(url);
	};

	const viewProfile = () => {
		handleClose();
		showDrawer && showDrawer({ title: 'Usuário', url: `/userprofile/view/${user._id}` });
	};

	const handleMenu = (event: React.SyntheticEvent) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<Box sx={{ width: '100%', backgroundColor: '#d5d5d5' }}>
			<Container
				sx={{
					width: '100%',
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					height: 40,
					maxHeight: 40
				}}>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center'
					}}>
					<DayNightToggle
						isDarkMode={themeOptions?.isDarkThemeMode as boolean}
						setDarkMode={(evt) => {
							themeOptions?.setDarkThemeMode(evt.target.checked);
						}}
					/>
				</Box> 
				<Button
					onClick={handleMenu}
					sx={appTopMenuStyle.containerAccountCircle}>
					<>
						<AccountCircle id="Perfil" name="Perfil" sx={appTopMenuStyle.accountCircle} />
						<ArrowDropDownIcon
							sx={{
								color: "primary",
								width: 17
							}}
						/>
					</>
				</Button>
				<Menu
					id="menu-appbar"
					anchorEl={anchorEl as Element}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'right'
					}}
					sx={{
						color: "red"
					}}
					keepMounted
					transformOrigin={{
						vertical: 'top',
						horizontal: 'right'
					}}
					open={open}

					onClose={handleClose}>
					{!user || !user._id
						? [
								<MenuItem key={'signin'} onClick={openPage('/signin')}>
									Entrar
								</MenuItem>
						  ]
						: [
								<MenuItem key={'userprofile'} onClick={viewProfile}>
									{user.username || 'Editar'}
								</MenuItem>,
								<MenuItem key={'signout'} onClick={openPage('/signout')}>
									<ExitToAppIcon fontSize="small" /> Sair
								</MenuItem>
						  ]}
				</Menu>
			</Container>
		</Box>
	);
};
