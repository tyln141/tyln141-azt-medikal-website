export default function SectionTitle({
    subtitle,
    title,
    center = false,
    className = ""
}: {
    subtitle?: string;
    title: string;
    center?: boolean;
    className?: string;
}) {
    return (
        <div className={`mb-12 ${center ? 'text-center' : ''} ${className}`}>
            {subtitle && (
                <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-widest mb-4">
                    {subtitle}
                </span>
            )}
            <h2 className="text-3xl md:text-4xl font-extrabold text-dark tracking-tight">
                {title}
            </h2>
        </div>
    );
}
