import { Link } from "react-router-dom";
import RouteConfig from "../RouteConfig";

export default function GoTo({ page, children, ...props }) {
  const matched = RouteConfig.find(r => r.component === page);
  const path = matched ? matched.path : "/";

  return (
    <Link to={path} {...props}>
      {children}
    </Link>
  );
}
