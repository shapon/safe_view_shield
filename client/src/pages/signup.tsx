import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, CheckCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const signupSchema = z.object({
  name: z.string().min(2, "Family/Organization name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  subscriptionTier: z.enum(["family", "school_basic", "school_enterprise"]),
  numberOfDevices: z.string().min(1, "Please specify number of devices"),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms and conditions"),
  agreeToPrivacy: z.boolean().refine(val => val === true, "You must agree to the privacy policy")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      subscriptionTier: "family",
      numberOfDevices: "3",
      agreeToTerms: false,
      agreeToPrivacy: false
    }
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupForm) => {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          subscriptionTier: data.subscriptionTier,
          numberOfDevices: parseInt(data.numberOfDevices)
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to create account");
      }
      
      return response.json();
    },
    onSuccess: () => {
      setStep(3); // Success step
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Account Created Successfully!",
        description: "Your 7-day free trial has started. Welcome to SafeViewShield!"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Signup Failed",
        description: error.message || "Please try again or contact support.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: SignupForm) => {
    setStep(2); // Move to review step
  };

  const confirmSignup = () => {
    const formData = form.getValues();
    signupMutation.mutate(formData);
  };

  const subscriptionPlans = {
    family: {
      name: "Family Plan",
      price: "$9/month",
      features: ["Up to 5 devices", "Real-time AI detection", "Parent dashboard", "Mobile notifications", "24/7 support"],
      trialDays: 7
    },
    school_basic: {
      name: "School Basic",
      price: "$349/month", 
      features: ["Up to 500 students", "Advanced AI detection", "Admin dashboard", "Teacher controls", "Detailed reporting", "Priority support"],
      trialDays: 14
    },
    school_enterprise: {
      name: "School Enterprise",
      price: "$599/month",
      features: ["Unlimited students", "Custom AI training", "API integration", "White-label option", "SLA guarantee", "Dedicated support"],
      trialDays: 30
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full" data-testid="signup-success">
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900" data-testid="success-title">
              Welcome to SafeViewShield!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6" data-testid="success-message">
              Your free trial has started! Check your email for setup instructions and download links.
            </p>
            <div className="space-y-3">
              <Link href="/dashboard">
                <Button className="w-full bg-primary-500 hover:bg-primary-600" data-testid="button-dashboard">
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="outline" className="w-full" data-testid="button-setup-guide">
                  View Setup Guide
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-primary-500 hover:text-primary-600 mb-4" data-testid="link-back-home">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-primary-500 mr-3" />
            <span className="font-sans font-bold text-2xl text-gray-900">SafeViewShield</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="signup-title">
            Start Your Free Trial
          </h1>
          <p className="text-gray-600" data-testid="signup-subtitle">
            {step === 1 ? "Choose your plan and create your account" : "Review your selections"}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'}`} data-testid="step-1">
              1
            </div>
            <div className={`w-16 h-1 mx-2 ${step >= 2 ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'}`} data-testid="step-2">
              2
            </div>
            <div className={`w-16 h-1 mx-2 ${step >= 3 ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'}`} data-testid="step-3">
              3
            </div>
          </div>
        </div>

        {step === 1 && (
          <Card data-testid="signup-form">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Family/Organization Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Johnson Family" {...field} data-testid="input-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="parent@example.com" {...field} data-testid="input-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} data-testid="input-password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} data-testid="input-confirm-password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="subscriptionTier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Plan Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-plan">
                                <SelectValue placeholder="Select a plan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="family">Family Plan - $9/month</SelectItem>
                              <SelectItem value="school_basic">School Basic - $349/month</SelectItem>
                              <SelectItem value="school_enterprise">School Enterprise - $599/month</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="numberOfDevices"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Devices</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" placeholder="3" {...field} data-testid="input-devices" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="agreeToTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-terms"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm">
                              I agree to the{" "}
                              <Link href="/terms" className="text-primary-500 hover:underline">
                                Terms and Conditions
                              </Link>
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="agreeToPrivacy"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-privacy"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm">
                              I agree to the{" "}
                              <Link href="/privacy" className="text-primary-500 hover:underline">
                                Privacy Policy
                              </Link>
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary-500 hover:bg-primary-600" 
                    size="lg"
                    data-testid="button-continue"
                  >
                    Continue to Review
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card data-testid="signup-review">
            <CardHeader>
              <CardTitle>Review Your Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Account Details */}
                <div>
                  <h3 className="font-semibold text-lg mb-3" data-testid="review-account-title">Account Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span>Name:</span>
                      <span className="font-medium" data-testid="review-name">{form.getValues("name")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span className="font-medium" data-testid="review-email">{form.getValues("email")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Devices:</span>
                      <span className="font-medium" data-testid="review-devices">{form.getValues("numberOfDevices")}</span>
                    </div>
                  </div>
                </div>

                {/* Plan Details */}
                <div>
                  <h3 className="font-semibold text-lg mb-3" data-testid="review-plan-title">Selected Plan</h3>
                  <div className="border border-primary-200 bg-primary-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-lg" data-testid="review-plan-name">
                          {subscriptionPlans[form.getValues("subscriptionTier")].name}
                        </h4>
                        <p className="text-primary-600 font-medium" data-testid="review-plan-price">
                          {subscriptionPlans[form.getValues("subscriptionTier")].price}
                        </p>
                      </div>
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium" data-testid="review-trial">
                        {subscriptionPlans[form.getValues("subscriptionTier")].trialDays}-day free trial
                      </div>
                    </div>
                    <ul className="space-y-1 text-sm">
                      {subscriptionPlans[form.getValues("subscriptionTier")].features.map((feature, index) => (
                        <li key={index} className="flex items-center" data-testid={`review-feature-${index}`}>
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Trial Information */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2" data-testid="trial-info-title">Free Trial Details</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li data-testid="trial-info-duration">• Your {subscriptionPlans[form.getValues("subscriptionTier")].trialDays}-day free trial starts immediately</li>
                    <li data-testid="trial-info-no-charge">• No charges during the trial period</li>
                    <li data-testid="trial-info-cancel">• Cancel anytime before trial ends</li>
                    <li data-testid="trial-info-reminder">• We'll remind you 2 days before trial ends</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(1)} 
                    className="flex-1"
                    data-testid="button-back"
                  >
                    Back to Edit
                  </Button>
                  <Button 
                    onClick={confirmSignup}
                    disabled={signupMutation.isPending}
                    className="flex-1 bg-primary-500 hover:bg-primary-600"
                    data-testid="button-start-trial"
                  >
                    {signupMutation.isPending ? "Creating Account..." : "Start Free Trial"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}