
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center max-w-md px-6">
        <h1 className="text-6xl font-bold mb-4 text-harmonia-green">404</h1>
        <p className="text-xl text-foreground mb-8">Oops! Página não encontrada</p>
        <p className="text-muted-foreground mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Button asChild className="bg-harmonia-green hover:bg-harmonia-green/90">
          <a href="/">Voltar para Home</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
