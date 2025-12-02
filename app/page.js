"use client";
import { useEffect, useState } from "react";
import AboutSection from "./components/homepage/about";
import Blog from "./components/homepage/blog";
import ContactSection from "./components/homepage/contact";
import Education from "./components/homepage/education";
import Experience from "./components/homepage/experience";
import HeroSection from "./components/homepage/hero-section";
import Projects from "./components/homepage/projects";
import Skills from "./components/homepage/skills";
import Github from "./components/homepage/github";
import Chatbot from "./components/homepage/bot";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import { PacmanLoader } from "react-spinners";
import { v4 as uuidv4 } from "uuid"; // Install with: npm install uuid

export default function Home() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserIdFromDomain = () => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname; // e.g. "localhost" or "xyz.portfolio.com"

      if (hostname.includes(".")) {
        if(hostname.split(".")[0] === "www") {
          return hostname.split(".")[1];
        }
        // Take the first part of the domain (subdomain)
        return hostname.split(".")[0];
      }

      return hostname; // For "localhost"
    }
    return "";
  };

  const getOrCreateUserId = () => {
    if (typeof window !== "undefined") {
      let userId = localStorage.getItem("portfolio_user_id");
      if (!userId) {
        userId = uuidv4();
        localStorage.setItem("portfolio_user_id", userId);
        return { userId, isNew: true };
      }
      return { userId, isNew: false };
    }
    return { userId: "", isNew: false };
  };

  const getDeviceDetails = async () => {
    if (typeof window !== "undefined") {
      let location = {};
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        location = {
          ip: data.ip,
          country: data.country_name,
          city: data.city,
          region: data.region,
        };
      } catch {
        location = {};
      }
      return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        location, // location is now part of deviceDetails
      };
    }
    return {};
  };

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const { userId, isNew } = getOrCreateUserId();
        const deviceDetails = await getDeviceDetails();

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/visitor/track`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, isNew, deviceDetails }),
        });

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/content/portfolio/${getUserIdFromDomain()}`
        );
        const data = await res.json();
        setPortfolio(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolio();
  }, []);

  if (loading || !portfolio) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PacmanLoader color="#a78bfa" size={40} />
      </div>
    );
  }

  return (
    <div suppressHydrationWarning>
      <Navbar personalData={portfolio.personalData} />
      <Chatbot />
      <HeroSection
        personalData={portfolio.personalData}
        skillsData={portfolio.skillsData}
      />
      <AboutSection personalData={portfolio.personalData} />
      <Experience experiences={portfolio.experiences} />
      <Skills skills={portfolio.skillsData} />
      <Projects projects={portfolio.projectsData} />
      <Education educations={portfolio.educations} />
      <Github github={portfolio.github} git={portfolio.personalData.github} />
      <Blog blogs={portfolio.blog} />
      <ContactSection contact={portfolio.contact} />
      <Footer personalData={portfolio.personalData} />
    </div>
  );
}