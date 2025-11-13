import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  showText?: boolean;
}

export const Logo = ({ className = "", size = "md", onClick, showText = false }: LogoProps) => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Determine if current theme is light or dark
  const isLightTheme = theme === "light";

  // For light themes, use dark logo (dark.png/darklogo.png)
  // For dark themes, use light logo (light.png/lightlogo.png)
  const logoSrc = isLightTheme ? "/darklogo.png" : "/lightlogo.png";

  // Size mappings
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10"
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/');
    }
  };

  return (
    <div
      className={`flex items-center gap-2 cursor-pointer ${className}`}
      onClick={handleClick}
    >
      <img
        src={logoSrc}
        alt="Trelix"
        className={`${sizeClasses[size]} w-auto object-contain transition-all duration-200 hover:scale-105`}
      />
      {showText && (
        <span className="text-xl font-bold tracking-tight font-mono">
          Trelix
        </span>
      )}
    </div>
  );
};
