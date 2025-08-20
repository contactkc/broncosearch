type CardProps = {
    subject: string;
    catalog_number: string;
    title: string;
    description: string;
    score: number;
};

const Card = ({ subject, catalog_number, title, description, score }: CardProps) => {
    return (
        <div className="border border-neutral-800 rounded-xl p-4 mb-4 bg-neutral-900">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-white text-left mb-4">
                    {subject} {catalog_number} - {title}
                </h2>
            </div>
            <p className="text-neutral-400 text-sm text-left mb-4">{description}</p>
            <p className="text-xs text-neutral-400 text-left border border-neutral-700 w-fit p-1 rounded-lg bg-neutral-800">similarity: {(score * 100).toFixed(1)}%</p>
        </div>
    );
};

export default Card;