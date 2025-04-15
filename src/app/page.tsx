"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <LandingContent />
    </div>
  );
}

const LandingContent = () => {
  const { t } = useTranslation();
  const [requestStatus, setRequestStatus] = useState<"idle" | "success" | "error">("idle");

  const handleAffiliateRequest = async () => {
    try {
      setRequestStatus("idle");
      const response = await fetch('/affiliate/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setRequestStatus("success");
        setTimeout(() => setRequestStatus("idle"), 5000);
      } else {
        setRequestStatus("error");
        setTimeout(() => setRequestStatus("idle"), 5000);
      }
    } catch (error) {
      setRequestStatus("error");
      setTimeout(() => setRequestStatus("idle"), 5000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      {/* Hero Section */}
      <section className="mb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="purple" className="mb-2">{t("landing.hero.badge", "AI-Powered Platform")}</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              {t("landing.hero.title", "Welcome to Infinity AI System")}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t("landing.hero.description", "Your all-in-one AI-powered platform to manage social media, marketing, scheduling, analytics, CRM, tasks, and more – powered by smart automation.")}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg">
                {t("landing.hero.getStarted", "Get Started")}
              </Button>
              <Button size="lg" variant="outline">
                {t("landing.hero.learnMore", "Learn More")}
              </Button>
            </div>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/30 z-10 rounded-2xl" />
            <Image
              src="/next.svg" 
              alt="Infinity AI Dashboard"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Affiliate Program Section */}
      <section className="py-16 px-6 bg-slate-50 dark:bg-slate-900/40 rounded-3xl mb-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" className="text-primary">
            <defs>
              <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 20 L40 20 M20 0 L20 40" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-3">{t("landing.affiliate.badge", "Affiliate Program")}</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {t("landing.affiliate.title", "Earn with Us – Join the Affiliate Program")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t("landing.affiliate.description", "Become a partner and earn commissions by referring new users. Promote Infinity AI System and grow your income.")}
            </p>
          </div>

          {/* Affiliate Program Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Requirements Card */}
            <Card>
              <CardHeader>
                <CardTitle>{t("landing.affiliate.requirements.title", "Conditions to Join")}</CardTitle>
                <CardDescription>
                  {t("landing.affiliate.requirements.description", "Meet these requirements to become an affiliate")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>{t("landing.affiliate.requirements.socialAccount", "Must have at least 1 connected social media account")}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>{t("landing.affiliate.requirements.active", "Active for at least 3 days")}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>{t("landing.affiliate.requirements.post", "Minimum 1 published post")}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>{t("landing.affiliate.requirements.verified", "Profile must be verified (email confirmed)")}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 h-6 w-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600 dark:text-yellow-400">
                        <path d="M12 19l-7-7 7-7"/>
                        <path d="M19 12H5"/>
                      </svg>
                    </div>
                    <span>{t("landing.affiliate.requirements.paidPlan", "Optional: Must be subscribed to a paid plan")}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Info and CTA Card */}
            <Card>
              <CardHeader>
                <CardTitle>{t("landing.affiliate.cta.title", "Ready to Start Earning?")}</CardTitle>
                <CardDescription>
                  {t("landing.affiliate.cta.description", "Apply to our affiliate program today")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Custom Alert Component */}
                <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 flex gap-3 dark:bg-amber-900/20 dark:border-amber-900/30 dark:text-amber-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-1">
                    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <div>
                    <p>{t("landing.affiliate.notice", "Your affiliate account will remain inactive until all conditions are met. We review each request manually.")}</p>
                  </div>
                </div>

                {/* Benefits List */}
                <div>
                  <h4 className="font-medium text-base mb-3">{t("landing.affiliate.benefits.title", "Why Join Our Affiliate Program?")}</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                      </div>
                      <span>{t("landing.affiliate.benefits.commission", "Earn competitive commission on each referral")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                          <path d="M3 3v18h18" />
                          <path d="m19 9-5 5-4-4-3 3" />
                        </svg>
                      </div>
                      <span>{t("landing.affiliate.benefits.dashboard", "Access real-time analytics and reporting dashboard")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-0.5 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                      </div>
                      <span>{t("landing.affiliate.benefits.resources", "Get marketing materials and dedicated support")}</span>
                    </li>
                  </ul>
                </div>

                {/* Status Messages */}
                {requestStatus === "success" && (
                  <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 dark:bg-green-900/20 dark:border-green-900/30 dark:text-green-400">
                    {t("landing.affiliate.success", "Your request has been submitted successfully! We'll review it shortly.")}
                  </div>
                )}

                {requestStatus === "error" && (
                  <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-400">
                    {t("landing.affiliate.error", "An error occurred. Please try again later.")}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleAffiliateRequest}
                  disabled={requestStatus === "success"}
                >
                  {requestStatus === "success" 
                    ? t("landing.affiliate.requested", "Request Submitted") 
                    : t("landing.affiliate.requestButton", "Request to Join")}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Highlight Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-3">{t("landing.features.badge", "Platform Features")}</Badge>
          <h2 className="text-3xl font-bold mb-4">
            {t("landing.features.title", "Everything You Need In One Platform")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("landing.features.description", "Discover how Infinity AI System can transform your digital presence")}
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature Cards */}
          {[1, 2, 3].map((index) => (
            <Card key={index} className="overflow-hidden">
              <div className="h-3 bg-primary/80" />
              <CardHeader>
                <CardTitle>
                  {t(`landing.features.card${index}.title`, `Feature ${index}`)}
                </CardTitle>
                <CardDescription>
                  {t(`landing.features.card${index}.description`, "Description of this amazing feature")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-slate-100 dark:bg-slate-800/50 rounded-md flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary/50">
                    <rect width="18" height="18" x="3" y="3" rx="2"/>
                    <path d="M7 7h.01"/>
                    <path d="M17 7h.01"/>
                    <path d="M7 17h.01"/>
                    <path d="M17 17h.01"/>
                  </svg>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
