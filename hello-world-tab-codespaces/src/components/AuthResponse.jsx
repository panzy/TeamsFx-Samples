import { app, authentication } from "@microsoft/teams-js";

export function AuthResponse() {
	app.initialize()
	.then(() => {
		let queryParams = new URLSearchParams(window.location.search);
		if (queryParams.get('error')) {
			authentication.notifyFailure(queryParams.get('error') + ': ' + queryParams.get('error_description'));
		}

		let hashParams = new URLSearchParams(window.location.hash);
		if (hashParams.get('error')) {
			authentication.notifyFailure(hashParams.get('error') + ': ' + hashParams.get('error_description'));
		}

		let state = hashParams.get('session_state');
		let idToken = hashParams.get('id_token');
		let accessToken = hashParams.get('access_token');
		localStorage[state] = JSON.stringify({ state, idToken, accessToken });
		authentication.notifySuccess(state);
	});
}