import type { NextPage } from 'next';
import React from 'react';
import { useState } from 'react';
import Pagination from '../components/Pagination';
import Card from '../components/Card';
import { Spinner } from '@/components/ui/shadcn-io/spinner';

type Course = {
    subject: string;
    catalog_number: string;
    title: string;
    description: string;
    score: number;
};

const RESULTS_PER_PAGE = 10;

const Home: NextPage = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setResults([]);
        setCurrentPage(1);

        try {
            const response = await fetch(`/api/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: query }),
            });
            if (!response.ok) throw new Error('failed to fetch results');
            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'an unknown error has occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const idxOfLastResult = currentPage * RESULTS_PER_PAGE;
    const idxOfFirstResult = idxOfLastResult - RESULTS_PER_PAGE;
    const currentResults = results.slice(idxOfFirstResult, idxOfLastResult);

    return (
        <>
            <div>
                <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="max-w-4xl mx-auto text-center w-full">
                        <h1 className="text-4xl">broncosearch</h1>
                        <p className="text-neutral-400 mb-6">discover over 2000+ cpp courses using natural language</p>

                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="e.g., learn how gravity works"
                                className="p-3 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-white w-full outline-none"
                                aria-label="search for courses"
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-white text-black p-3 rounded-xl cursor-pointer hover:bg-neutral-200"
                            >
                                {isLoading ? <Spinner key="ellipsis" variant="ellipsis" /> : 'search'}
                            </button>
                        </form>
                        <div className="mx-auto mt-6">
                            {isLoading && <Spinner key="ellipsis" variant="ellipsis" className="mx-auto" size={64} />}
                            {error && <p className="text-center text-red-500">{error}</p>}

                            {currentResults.length > 0 && (
                                <div>
                                    {currentResults.map((course) =>(
                                        <Card
                                            key={`${course.subject}-${course.catalog_number}`}
                                            subject={course.subject}
                                            catalog_number={course.catalog_number}
                                            title={course.title}
                                            description={course.description}
                                            score={course.score}
                                        />
                                    ))}
                                </div>
                            )}

                            {results.length > RESULTS_PER_PAGE && (
                                <Pagination
                                    totalPosts={results.length}
                                    postsPerPage={RESULTS_PER_PAGE}
                                    setCurrentPage={setCurrentPage}
                                    currentPage={currentPage}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
