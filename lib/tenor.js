const TENOR_API_KEY = "AIzaSyCvq6XcbdjjMn7kVuv9bc0eLbUK90qFi6E"
const TENOR_API_URL = "https://tenor.googleapis.com/v2/search"

export async function getTenorGifs(query, limit = 5) {
    try {
        const response = await fetch(`${TENOR_API_URL}?q=${encodeURIComponent(query)}&key=${TENOR_API_KEY}&limit=${limit}`)
        const data = await response.json()

        if (data.results && data.results.length > 0) {
            return data.results.map(g => g.media_formats?.gif?.url).filter(Boolean)
        } else {
            return []
        }
    } catch (error) {
        console.error("❌ Error al obtener los GIFs de Tenor:", error)
        return []
    }
}
