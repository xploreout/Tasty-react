import '../App.css';
import {GoogleLogin} from 'react-google-login';

const clientId = "966337310197-iriuog9i3q1go8tl8q7a10hqrj0j9aga.apps.googleusercontent.com";

function Login(props) {

  return (
    <div className="Login">
     <div id="signInButton">
      <GoogleLogin 
      clientId={clientId}
      buttonText="Log in"
      onSuccess={props.funcSuccess}
      onFailure={props.funcFailure}
      cookiePolicy={'single_host_origin'}
      isSignedIn={true}
      />
     </div>    
    </div>

  );
}

export default Login;