import { useEffect } from "react";
import { app } from "@microsoft/teams-js";
import { v4 as _guid } from 'uuid';
import toQueryString from 'to-querystring';

export function AuthStart() {
	useEffect(() => {
		app.getContext().then((context) => {
			// Generate random state string and store it, so we can verify it in the callback
			let state = _guid(); // _guid() is a helper function in the sample
			localStorage.setItem("simple.state", state);
			localStorage.removeItem("simple.error");

			const clientId = 'barkoder-frontend-test';

			// Go to the Azure AD authorization endpoint
			let queryParams = {
				client_id: clientId,
				response_type: "id_token token",
				response_mode: "fragment",
				scope: "openid",
				redirect_uri: window.location.origin + "/oauthresponse",
				nonce: _guid(),
				state: state,
				// The context object is populated by Teams; the loginHint attribute
				// is used as hinting information
				login_hint: context.user.loginHint,
			};

			let authorizeEndpoint = `https://sso.fortivoice-cloud.com/auth/realms/id:ott.fortivoice-cloud.net/protocol/openid-connect/auth?${toQueryString(queryParams)}`;
			window.location.assign(authorizeEndpoint);
		});
	});
}