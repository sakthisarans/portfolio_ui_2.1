"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Custom hook for scroll-based animations using Intersection Observer
 * @param {Object} options - Intersection Observer options
 * @param {number} options.threshold - Percentage of element visibility to trigger (0-1)
 * @param {string} options.rootMargin - Margin around root element
 * @param {boolean} options.triggerOnce - Whether to trigger animation only once
 * @returns {Array} [ref, isInView] - Ref to attach to element and visibility state
 */
export function useScrollAnimation(options = {}) {
    const {
        threshold = 0.1,
        rootMargin = "0px",
        triggerOnce = true,
    } = options;

    const ref = useRef(null);
    const [isInView, setIsInView] = useState(false);
    const hasTriggered = useRef(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
            setIsInView(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                const inView = entry.isIntersecting;

                if (inView && triggerOnce && !hasTriggered.current) {
                    setIsInView(true);
                    hasTriggered.current = true;
                    // Disconnect observer after triggering once for performance
                    observer.disconnect();
                } else if (!triggerOnce) {
                    setIsInView(inView);
                }
            },
            {
                threshold,
                rootMargin,
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [threshold, rootMargin, triggerOnce]);

    return [ref, isInView];
}

/**
 * Hook for staggered animations on multiple children
 * @param {number} count - Number of items to animate
 * @param {Object} options - Intersection Observer options
 * @returns {Array} [ref, isInView] - Ref to attach to parent and visibility state
 */
export function useStaggerAnimation(count, options = {}) {
    const [ref, isInView] = useScrollAnimation(options);
    const [visibleItems, setVisibleItems] = useState([]);

    useEffect(() => {
        if (isInView && visibleItems.length < count) {
            const timer = setInterval(() => {
                setVisibleItems((prev) => {
                    if (prev.length >= count) {
                        clearInterval(timer);
                        return prev;
                    }
                    return [...prev, prev.length];
                });
            }, 100); // 100ms delay between each item

            return () => clearInterval(timer);
        }
    }, [isInView, count, visibleItems.length]);

    return [ref, isInView, visibleItems];
}
