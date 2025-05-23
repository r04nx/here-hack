import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';

interface SignInCardProps {
  userType: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  route: string;
}

export function SignInCard({
  userType,
  title,
  description,
  icon,
  color,
  route
}: SignInCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.username === 'admin' && formData.password === 'admin') {
      // Store user info in localStorage
      localStorage.setItem('userType', userType);
      localStorage.setItem('userName', 'John Doe');
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${formData.username}!`,
      });
      
      navigate(route);
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid username or password. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <img 
            src="/assets/logo-no-bg.png" 
            alt="RoadFusion Logo" 
            className="h-10 w-auto"
          />
        </div>

        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate('/login')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Role Selection
        </Button>

        <Card className="w-full">
          <CardHeader className="text-center pb-4">
            <div className={`w-16 h-16 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
              {icon}
            </div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <Button 
                type="submit" 
                className={`w-full bg-gradient-to-r ${color} text-white hover:opacity-90`}
              >
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 