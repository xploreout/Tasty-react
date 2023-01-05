import '../App.css';
import { GoogleLogout} from 'react-google-login';

const clientId = "966337310197-iriuog9i3q1go8tl8q7a10hqrj0j9aga.apps.googleusercontent.com";

function Logout(props) {
   
  return (
    <div className="Login">
     
     <div id="signInButton">
      <GoogleLogout 
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={props.funcSuccess}
      />
     </div>
     
    </div>

  );
}

export default Logout;