// signup component similar to login page (except loginWithPassword)
// instead createUser to insert a new user account document

// login page overrides the form’s submit event and call Meteor’s loginWithPassword()
// Authentication errors modify the component’s state to be displayed
import React from 'react';
import { NavigateFunction } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import Container from '@mui/material/Container';
import TextField from '../../components/SimpleFormFields/TextField/TextField';
import Button from '@mui/material/Button';
import { userprofileApi } from '../../../userprofile/api/UserProfileApi';
import SimpleForm from '/imports/ui/components/SimpleForm/SimpleForm';

import { signUpStyle } from './SignUpStyle';
import { Box } from '@mui/system';
import { IUserProfile } from '/imports/userprofile/api/UserProfileSch';
import { FixedMenuLayoutContext } from '../../layouts/FixedMenuLayout';

interface ISignUp {
	showNotification: (options?: Object) => void;
	navigate: NavigateFunction;
	user: IUserProfile;
}

export const SignUp = (props: ISignUp) => {
	const { showNotification, navigate } = props;

	const { handleOcultarAppBar, handleExibirAppBar } = React.useContext(FixedMenuLayoutContext);

	React.useEffect(() => {
		handleOcultarAppBar();
		return () => handleExibirAppBar();
	}, []);



	const handleSubmit = (doc: { email: string; password: string }) => {
		const { email, password } = doc;

		userprofileApi.insertNewUser({ email, username: email, password }, (err, r) => {
			if (err) {
				console.log('Login err', err);
				showNotification &&
					showNotification({
						type: 'warning',
						title: 'Problema na criação do usuário!',
						description: 'Erro ao fazer registro em nossa base de dados!'
					});
			} else {
				showNotification &&
					showNotification({
						type: 'sucess',
						title: 'Cadastrado com sucesso!',
						description: 'Registro de usuário realizado em nossa base de dados!'
				});

				Meteor.loginWithPassword(email, password, (err: any) => {
					if (err) {
						showNotification({
							type: 'warning',
							title: 'Acesso negado!',
							description:
								err.reason === 'Incorrect password'
									? 'Email ou senha inválidos'
									: err.reason === 'User not found'
									? 'Este email não está cadastrado em nossa base de dados.'
									: ''
						});
					} else {
						showNotification({
							type: 'sucess',
							title: 'Acesso autorizado!',
							description: 'Login de usuário realizado em nossa base de dados!'
						});

						navigate('/');
					}
				});
			}
		});
	};

	return (
		<Container style={signUpStyle.containerSignUp} sx={{my:4}}>
			<Box sx={signUpStyle.labelRegisterSystem} style={{marginBottom:10}}>
				<img src="/images/wireframe/profile.png" style={signUpStyle.imageLogo} />
				Cadastro
			</Box>
			<SimpleForm
				schema={{
					email: {
						type: String,
						label: 'Email',
						optional: false
					},
					password: {
						type: String,
						label: 'Senha',
						optional: false
					}
				}}
				onSubmit={handleSubmit}>
				<TextField id="Email" label="Email" fullWidth name="email" type="email" placeholder="Digite um email" sx={{marginBottom: 2}}/>
				<TextField id="Senha" label="Senha" fullWidth name="password" placeholder="Digite uma senha" type="password" />
				<Box sx={signUpStyle.containerButtonOptions}>
					<Button color={'primary'} variant={'contained'} id="submit" sx={{display: 'flex', margin:'auto', width:'90%', marginTop:5}}>
						Cadastrar
					</Button>
				</Box>
			</SimpleForm>
			<Box sx={signUpStyle.containerRouterSignIn}>
				Já tem uma conta? 
				<Button color={'secondary'} onClick={() => navigate('/signin')} variant='text'>
					Entrar
				</Button>
			</Box>
		</Container>
	);
};
