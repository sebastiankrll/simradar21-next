export const fetcher = async <T>(url: string): Promise<T> => {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Error fetching data from ${url}`)
    }
    return response.json()
}
