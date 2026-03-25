import { useState } from "react";
import { useLogin, useNotification } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { authClient } from "@/lib/auth-client";

export const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [isLoading, setIsLoading] = useState(false);
    
    const { mutate: login } = useLogin();
    const { open } = useNotification();
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const signUpOptions = {
                email,
                password,
                name,
                role,
            };
            const { data, error } = await (authClient.signUp.email as any)(signUpOptions);

            if (error) {
                open?.({
                    type: "error",
                    message: error.message || "Failed to register account",
                });
                setIsLoading(false);
                return;
            }

            open?.({
                type: "success",
                message: "Registration successful!",
            });

            // Automatically log in after registration
            login({ email, password });
            
        } catch (error: any) {
            open?.({
                type: "error",
                message: error.message || "Failed to register account",
            });
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-md shadow-lg border-orange-100/20">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight text-gradient-orange">Create an Account</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Join our classroom management platform
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={role} onValueChange={setRole}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="student">Student</SelectItem>
                                    <SelectItem value="teacher">Teacher</SelectItem>
                                    {/* Excluded Admin for normal sign up flow */}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" className="w-full font-semibold" disabled={isLoading || !email || !password || !name}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground">
                    <div>
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-orange-600 hover:text-orange-500">
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};
