import { useState } from "react";
import { useLogin, useTranslate } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Link } from "react-router";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const { mutate: login, isPending } = useLogin();

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-md shadow-lg border-orange-100/20">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight text-gradient-orange">Welcome Back</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Enter your credentials to access your classroom
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            login({ email, password });
                        }}
                        className="space-y-4"
                    >
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
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full font-semibold" disabled={isPending || !email || !password}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground">
                    <div>
                        Don&apos;t have an account?{" "}
                        <Link to="/register" className="font-semibold text-orange-600 hover:text-orange-500">
                            Sign up
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};
