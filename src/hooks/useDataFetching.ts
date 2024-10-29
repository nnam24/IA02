import { useState, useEffect } from 'react';

type UseDataFetching<T> = {
    data: T | null,
    isLoading: boolean,
    error: string | null,
}

const useDataFetching = <T>(url: string): UseDataFetching<T> => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); // Start loading

            try {
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result: T = await response.json();
                setData(result); // Update data state
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message); // Set error message
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setIsLoading(false); // End loading state
            }
        };

        fetchData();
    }, [url]);

    return { data, isLoading, error };
}

export default useDataFetching;