import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Link } from "react-router-dom";

const LogoWW = () => {
  const isTable = useMediaQuery("(min-width: 768px)");

  return (
    <Link to={"/"} className="w-fit flex items-center">
      {isTable ? (
        <img src="/logo.svg" width={128} className="lg:visible" />
      ) : (
        <img src="/logo_mini.svg" width={32} className="lg:hidden" />
      )}
    </Link>
  );
};

export default LogoWW;
