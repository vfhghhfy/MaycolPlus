const TENOR_API_KEY = "AIzaSyCvq6XcbdjjMn7kVuv9bc0eLbUK90qFi6E"
const TENOR_API_URL = "https://tenor.googleapis.com/v2/search"

export async function getTenorGif(query) {
    try {
        const response = await fetch(`${TENOR_API_URL}?q=${encodeURIComponent(query)}&key=${TENOR_API_KEY}&limit=1`)
        const data = await response.json()

        console.log("[DEBUG Tenor]", data) // Debug brutal

        if (data.results && data.results.length > 0) {
            return data.results[0].media_formats?.gif?.url || null
        } else {
            return null
        }
    } catch (error) {
        console.error("❌ Error al obtener el GIF de Tenor:", error)
        return null
    }
}
