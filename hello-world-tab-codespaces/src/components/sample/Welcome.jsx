import { useState } from "react";
import { authentication } from "@microsoft/teams-js";
import { Image, TabList, Tab } from "@fluentui/react-components";
import "./Welcome.css";
import { EditCode } from "./EditCode";
import { Deploy } from "./Deploy";
import { Publish } from "./Publish";
import { AddSSO } from "./AddSSO";

export function Welcome(props) {
  const { environment } = {
    environment: window.location.hostname === "localhost" ? "local" : "azure",
    ...props,
  };
  const friendlyEnvironmentName =
    {
      local: "local environment",
      azure: "Azure environment",
    }[environment] || "local environment";

  const [selectedValue, setSelectedValue] = useState("local");

  const [loginError, setLoginError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const onTabSelect = (event, data) => {
    setSelectedValue(data.value);
  };

  const onSSOClick = () => {
    setLoginError(null);

    authentication.authenticate({
      url: window.location.origin + "/oauthstart",
      width: 600,
      height: 535
    })
      .then((result) => {
        console.log("Login succeeded: " + result);
        let data = localStorage.getItem(result);
        localStorage.removeItem(result);
        let tokenResult = JSON.parse(data);
        showIdTokenAndClaims(tokenResult.idToken);
        getUserProfile(tokenResult.accessToken);
      })
      .catch((reason) => {
        console.log("Login failed: " + reason);
        handleAuthError(reason);
      });
  }

  const showIdTokenAndClaims = (idToken) => {
    console.log('idToken:', idToken);
  }

  const getUserProfile = (accessToken) => {
    console.log('accessToken:', accessToken);
    setAccessToken(accessToken);
  }

  const handleAuthError = (reason) => {
    setLoginError(reason);
  }

  return (
    <div className="welcome page">
      <div className="narrow page-padding">
        <Image src="hello.png" />
        <h1 className="center">Congratulations!</h1>
        <p className="center">
          Your app is running in your {friendlyEnvironmentName}
        </p>
        <p className="center">
          origin: {window.location.origin}
        </p>
        <p className="center">
          {accessToken ? 'You have logged in' : 'You are not logged in'}
        </p>

        <button onClick={onSSOClick}>Login</button>
        {loginError ? <span style={{color: 'red'}}>{loginError.toString()}</span> : null}

        <div className="tabList">
          <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
            <Tab id="Local" value="local">
              1. Build your app locally
            </Tab>
            <Tab id="Azure" value="azure">
              2. Provision and Deploy to the Cloud
            </Tab>
            <Tab id="Publish" value="publish">
              3. Publish to Teams
            </Tab>
          </TabList>
          <div>
            {selectedValue === "local" && (
              <div>
                <EditCode />
                <AddSSO />
              </div>
            )}
            {selectedValue === "azure" && (
              <div>
                <Deploy />
              </div>
            )}
            {selectedValue === "publish" && (
              <div>
                <Publish />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
