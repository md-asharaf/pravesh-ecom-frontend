function SocialMediaHandle() {
    return (
        <div className="mt-8 pt-6 border-t border-gray-200/50">
            <h4 className="text-lg font-semibold">Follow Us</h4>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                Stay updated on product arrivals, tips, and showroom news.
            </p>

            <nav aria-label="Social links" className="mt-4">
                <ul className="flex flex-wrap items-center gap-4">
                    <li>
                        <a
                            href="https://www.facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                            aria-label="Pravesh Hardware on Facebook"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.03H8.08v-2.9h2.36V9.41c0-2.33 1.38-3.62 3.5-3.62.99 0 2.03.18 2.03.18v2.23h-1.14c-1.12 0-1.47.7-1.47 1.42v1.7h2.5l-.4 2.9h-2.1v7.03C18.34 21.25 22 17.09 22 12.07z" />
                            </svg>
                            Facebook
                        </a>
                    </li>

                    <li>
                        <a
                            href="https://www.instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                            aria-label="Pravesh Hardware on Instagram"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                                <rect x="3" y="3" width="18" height="18" rx="5" />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <path d="M17.5 6.5h.01" />
                            </svg>
                            Instagram
                        </a>
                    </li>

                    <li>
                        <a
                            href="https://www.linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                            aria-label="Pravesh Hardware on LinkedIn"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM3 9h4v11H3zM9 9h3.78v1.52h.05c.53-1 1.82-2.06 3.75-2.06C20.77 8.46 21 11.06 21 14.1V20H17v-5.1c0-1.2-.02-2.74-1.67-2.74-1.68 0-1.94 1.31-1.94 2.66V20H9V9z" />
                            </svg>
                            LinkedIn
                        </a>
                    </li>

                    <li>
                        <a
                            href="https://www.youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                            aria-label="Pravesh Hardware on YouTube"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M23.5 6.2s-.2-1.6-.82-2.3c-.78-.82-1.66-.82-2.07-.87C16.8 2.6 12 2.6 12 2.6h-.02s-4.8 0-8.6.38c-.4.05-1.3.05-2.07.87C.7 4.6.5 6.2.5 6.2S.3 8 .3 9.8v1.4c0 1.8.2 3.6.2 3.6s.2 1.6.82 2.3c.78.82 1.8.8 2.25.9 1.6.15 6.8.38 6.8.38s4.8-.03 8.6-.4c.4-.05 1.3-.05 2.07-.87.62-.68.82-2.3.82-2.3s.18-1.8.18-3.6V9.8c0-1.8-.18-3.6-.18-3.6zM9.8 14.6V7.4l6.3 3.6-6.3 3.6z" />
                            </svg>
                            YouTube
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default SocialMediaHandle