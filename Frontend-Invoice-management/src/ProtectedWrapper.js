import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedWrapper(props) {

  const userDetails = useSelector((state) => state.user.userDetails)

  console.log({ userDetails })
  if (!userDetails) {
    return <Navigate to="/login" replace />;
  }

  return props.children;
}
export default ProtectedWrapper;
