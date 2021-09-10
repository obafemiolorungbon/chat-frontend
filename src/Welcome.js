import { Link } from "react-router-dom";

export const Welcome = () => {
  return (
    <>
      <div className="WelcomePage">
        <p>Welcome to Zuri Chat</p>
        <span>
          <Link to="/chat">Continue to Chat room</Link>
        </span>
      </div>
    </>
  );
};
