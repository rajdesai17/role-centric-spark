import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-background to-primary/10 px-4">
      <Card className="w-full max-w-md shadow-elegant border-none bg-card/80 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary text-center">Welcome to RoleApp</CardTitle>
          <CardDescription className="text-center text-muted-foreground mt-2">
            A modern, role-centric platform for seamless collaboration and management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-base mb-6">
            Experience a clean, distraction-free interface designed for productivity and clarity.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full" size="lg" onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button className="w-full" size="lg" variant="outline" onClick={() => navigate('/signup')}>
            Sign Up
          </Button>
        </CardFooter>
      </Card>
      <footer className="mt-10 text-xs text-muted-foreground text-center opacity-80">
        &copy; {new Date().getFullYear()} RoleApp. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage; 