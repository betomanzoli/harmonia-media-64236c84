
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

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
          A página <span className="font-mono bg-black/20 px-2 py-0.5 rounded">{location.pathname}</span> que você está procurando não existe ou foi movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-harmonia-green hover:bg-harmonia-green/90 flex items-center gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Voltar para Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="#" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
              Voltar à página anterior
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
